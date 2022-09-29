const { Router } = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");
const {
  Purchase,
  ProductDetail,
  ScheduleDetail,
  Schedule,
  Product,
  User,
} = require("../db.js");
const axios = require("axios");
const formatData = require("../controllers/revertPurchaseFormatter.js");
const { Op } = require("sequelize");
require("dotenv").config();
const { ACCESS_TOKEN } = process.env;
const { getUID } = require("../middlewares/auth.js");

const payment = Router();
//payment.use(cors());
mercadopago.configure({
  access_token: ACCESS_TOKEN,
});

//Crea la compra, modifica el stock, modifica los asientos ocupados de la funcion, crea el detalle los productos comprodos,
//crea el detalle de la funcion de las entradas compradas
payment.post("/", getUID, async (req, res, next) => {
  const { productsBuy, scheduleId } = req.body;
  const uid = req.uid;
  try {
    const mp_items = productsBuy.map((product) => ({
      id: product.id,
      title: product.name,
      unit_price: product.price,
      quantity: product.quantity,
      currency_id: "USD",
    }));
    mp_items.push({
      id: scheduleId.schedule_id,
      title: scheduleId.movie,
      unit_price: scheduleId.selected.length * 5,
      quantity: scheduleId.selected.length,
      currency_id: "USD",
    });

    let promiseArr = [];

    //Recupera los asientos ocupados
    const scheduleData = await Schedule.findByPk(scheduleId.schedule_id, {
      attributes: ["boughtSeats"],
    });

    //Extrae la data de asientos ocupados, agrega los asientos seleccionados al usuario, y modifica el schedule
    const scheduleBoughtSeats =
      scheduleData !== null ? [...scheduleData.dataValues.boughtSeats] : [];

    const seatWasTaken = scheduleBoughtSeats.filter((seat) =>
      scheduleId.selected.includes(seat)
    );

    if (seatWasTaken.length > 0) {
      return res
        .status(400)
        .send({ message: "One of the selected seats is already taken" });
    }

    scheduleId.selected.forEach((seat) => scheduleBoughtSeats.push(seat));

    const scheduleUpdated = Schedule.update(
      { boughtSeats: scheduleBoughtSeats },
      {
        where: {
          schedule_id: scheduleId.schedule_id,
        },
      }
    );
    promiseArr.push(scheduleUpdated);

    //Consigue el total de la compra
    const productsTotalAmount = productsBuy.map(
      (product) => product.quantity * product.price
    );
    let purchaseTotalAmount = 0;
    productsTotalAmount.forEach((amount) => {
      purchaseTotalAmount += amount;
    });

    //Crea la compra en status 'created'
    const newPurchase = await Purchase.create({
      amount: purchaseTotalAmount,
      status: "created",
      user_id: uid,
    });

    //Nuevo (a probar)
    for (var i = 0; i < productsBuy.length; i++) {
      const insertProductDetail = ProductDetail.create({
        product_quantity: productsBuy[i].quantity,
        price: productsBuy[i].price,
        purchase_id: newPurchase.purchase_id,
        product_id: productsBuy[i].id,
      });
      promiseArr.push(insertProductDetail);
    }

    //Recupera el precio de la entrada de la funcion
    const ticketPrice = await Schedule.findByPk(scheduleId.schedule_id, {
      attributes: ["price"],
    });

    //Nuevo (a probar)
    const newScheduleDetail = ScheduleDetail.create({
      schedule_quantity: scheduleId.selected.length,
      seat_numbers: scheduleId.selected,
      price: ticketPrice.dataValues.price * scheduleId.selected.length,
      purchase_id: newPurchase.purchase_id,
      schedule_id: scheduleId.schedule_id,
    });
    promiseArr.push(newScheduleDetail);

    //Actualiza stock
    const extractedIDs = productsBuy.map((product) => product.id);
    const stocks = await Product.findAll({
      where: {
        product_id: {
          [Op.in]: extractedIDs,
        },
      },
      attributes: ["product_id", "stock"],
    });
    const extractedStocks = stocks.map((stockItem) => {
      const relatedProduct = productsBuy.filter(
        (product) => product.id === stockItem.dataValues.product_id
      );
      return {
        stock: stockItem.dataValues.stock,
        id: stockItem.dataValues.product_id,
        user_selected_product: relatedProduct[0].quantity,
      };
    });

    //Nuevo (a probar)
    for (var i = 0; i < extractedStocks.length; i++) {
      const stockUpdated = Product.update(
        {
          stock:
            extractedStocks[i].stock - extractedStocks[i].user_selected_product,
        },
        {
          where: {
            product_id: {
              [Op.eq]: extractedStocks[i].id,
            },
          },
        }
      );
      promiseArr.push(stockUpdated);
    }

    //Realiza la configuracion de todo lo de mercadopago
    let mpPreference = {
      items: mp_items,
      external_reference: newPurchase.purchase_id.toString(),
      payment_methods: {
        excluded_payment_types: [
          {
            id: "atm",
          },
        ],
        installments: 3,
      },
      back_urls: {
        success: "https://api-pf-cine.herokuapp.com/payment/followUp",
        failure: "https://api-pf-cine.herokuapp.com/payment/followUp",
        pending: "https://api-pf-cine.herokuapp.com/payment/followUp",
      },
    };
    mercadopago.preferences
      .create(mpPreference)
      .then((response) => {
        global.id = response.body.id;
        return res
          .status(200)
          .send({ id: global.id, purchase_id: newPurchase.purchase_id });
      })
      .catch((err) => {
        return res.status(404).send(err);
      });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

//Revierte la compra generada por un usuario cuando el da a "Pagar" pero luego se arrepiente y vuelve a editar su carrito
//Es decir: revierte el stock, los asientos ocupados, y setea un nuevo status de compra
payment.put("/revertPurchase", async (req, res) => {
  const { purchase_id } = req.body;
  try {
    const relatedData = await Purchase.findByPk(purchase_id, {
      attributes: ["purchase_id"],
      include: [
        {
          model: ProductDetail,
          attributes: ["product_detail_id", "product_quantity"],
          include: [
            {
              model: Product,
              attributes: ["product_id"],
            },
          ],
        },
        {
          model: ScheduleDetail,
          attributes: ["detail_id", "seat_numbers"],
          include: [
            {
              model: Schedule,
              attributes: ["schedule_id", "boughtSeats"],
            },
          ],
        },
      ],
    });

    //Formatea los datos para usarlos mas facil
    const { productDetails, scheduleDetail } = await formatData(relatedData);

    const promiseArr = [];

    //revierte el stock de cada item comprado
    productDetails.forEach((boughtProduct) => {
      const productStockUpdate = Product.update(
        { stock: boughtProduct.newStock },
        {
          where: {
            product_id: boughtProduct.product_id,
          },
        }
      );
      promiseArr.push(productStockUpdate);
    });

    //Updatea los asientos ocupados del Schedule
    const scheduleUpdate = Schedule.update(
      { boughtSeats: scheduleDetail.newFreeSeats },
      {
        where: {
          schedule_id: scheduleDetail.schedule_id,
        },
      }
    );

    promiseArr.push(scheduleUpdate);
    //Cambia el status de la compra
    const purchaseUpdate = Purchase.update(
      { status: "Auto-Cancelled Cart" },
      {
        where: {
          purchase_id: purchase_id,
        },
      }
    );

    promiseArr.push(purchaseUpdate);

    Promise.all(promiseArr);
    return res
      .status(200)
      .send({ message: `Purchase ${purchase_id} reverted` });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

//PENDIENTE:::AGREGAR LA MODIFIACION DEL STATUS DE LA COMPRA CUANOD HAGA MIERDA LA DB Y PUEDA CAMBIAR
//EL CAMPO MP_ID A INTEGER
payment.get("/followUp", async (req, res) => {
  //approved = APRO
  //in_process = CONT (pendiente de pago)
  //
  console.info("EN LA RUTA DE PAGOS ");
  const payment_id = req.query.payment_id;
  console.log(payment_id);
  const payment_status = req.query.status;
  const external_reference = req.query.external_reference;
  console.log(external_reference);
  const merchant_order_id = req.query.merchant_order_id;
  console.log(merchant_order_id);
  let status = payment_status === "approved" ? "Approved" : "Pay In Process";
  let user = await Purchase.findByPk(external_reference, {
    attributes: ["user_id"],
  });
  let userData = await User.findByPk(user.dataValues.user_id, {
    where: {
      attributes: ["email", "name"],
    },
  });

  await axios.post("http://localhost:3001/purchase/response", {
    email: userData.dataValues.email,
    name: userData.dataValues.name,
    purchase_id: external_reference,
  });

  await Purchase.update(
    { status: status, mp_id: payment_id },
    {
      where: {
        purchase_id: external_reference,
      },
    }
  );

  switch (status) {
    case "Approved":
      return res.redirect("https://estudioda.ar/cinema/payment/success");
    case "Pay In Process":
      return res.redirect("https://estudioda.ar/cinema/payment/pending");
    default:
      return res.redirect("https://estudioda.ar/cinema/payment/fail");
  }
});

payment.get("/pagos/:id", (req, res) => {
  const mp = new mercadopago(ACCESS_TOKEN);
  const id = req.params.id;
  console.info("Buscando el id", id);
  mp.get(`/v1/payments/search`, { id: id })
    .then((resultado) => {
      console.info("resultado", resultado);
      res.status(200).send({ resultado: resultado });
    })
    .catch((err) => {
      console.error("No se consulto:", err);
      res.status(400).send({ error: err });
    });
});

module.exports = payment;
