const { Router } = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");
const {
  Purchase,
  ProductDetail,
  ScheduleDetail,
  Schedule,
  Product,
} = require("../db.js");
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

    //Recupera los asientos ocupados
    const scheduleData = await Schedule.findByPk(scheduleId.schedule_id, {
      attributes: ["boughtSeats"],
    });

    //Extrae la data de asientos ocupados, agrega los asientos seleccionados al usuario, y modifica el schedule
    const scheduleBoughtSeats = [...scheduleData.dataValues.boughtSeats];
    scheduleId.selected.forEach((seat) => scheduleBoughtSeats.push(seat));
    const scheduleSeatsMod = await Schedule.update(
      { boughtSeats: scheduleBoughtSeats },
      {
        where: {
          schedule_id: scheduleId.schedule_id,
        },
      }
    );

    //Crea los detalles de compra de los productos
    let newProductDetails = [];
    productsBuy.forEach(async (product) => {
      const insertProductDetail = await ProductDetail.create({
        product_quantity: product.quantity,
        price: product.price,
        purchase_id: newPurchase.purchase_id,
        product_id: product.id,
      });
    });

    //Recupera el precio de la entrada de la funcion
    const ticketPrice = await Schedule.findByPk(scheduleId.schedule_id, {
      attributes: ["price"],
    });

    //Crea el detalle de compra de funcion
    let newScheduleDetail = await ScheduleDetail.create({
      schedule_quantity: scheduleId.selected.length,
      seat_numbers: scheduleId.selected,
      price: ticketPrice * scheduleId.selected.length,
      purchase_id: newPurchase.purchase_id,
      schedule_id: scheduleId.schedule_id,
    });

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
    extractedStocks.forEach(async (product) => {
      await Product.update(
        {
          stock: product.stock - product.user_selected_product,
        },
        {
          where: {
            product_id: {
              [Op.eq]: product.id,
            },
          },
        }
      );
    });

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
        console.log(err);
        return res.status(400).send(err);
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

    //revierte el stock de cada item comprado
    await productDetails.forEach(async (boughtProduct) => {
      await Product.update(
        { stock: boughtProduct.newStock },
        {
          where: {
            product_id: boughtProduct.product_id,
          },
        }
      );
    });

    //Updatea los asientos ocupados del Schedule
    await Schedule.update(
      { boughtSeats: scheduleDetail.newFreeSeats },
      {
        where: {
          schedule_id: scheduleDetail.schedule_id,
        },
      }
    );

    //Cambia el status de la compra
    await Purchase.update(
      { status: "Auto-Cancelled Cart" },
      {
        where: {
          purchase_id: purchase_id,
        },
      }
    );

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
  // await Purchase.update(
  //   { status: status, mp_id: payment_id },
  //   {
  //     where: {
  //       purchase_id: external_reference,
  //     },
  //   }
  // );
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

// payment.post("/processPayment", async (req, res) => {
//   const { amount, products, functions } = req.body;
//   //console.log(req);
//   //if (!amount || !products || !functions)
//   //return res.status(400).send({ message: "All data must be sent" });
//   try {
//     const newPayment = await stripe.paymentIntents.create({
//       amount,
//       currency: "ARS",
//       description: "Test purchase",
//       payment_method: "card",
//       confirm: true,
//     });
//     return res.status(200).send(newPayment);
//   } catch (err) {
//     return res.status(500).send({ message: err.message });
//   }
// });

// payment.post("/test", async (req, res) => {
//   try {
//     const pago = await Stripe.paymentIntents.create({
//       amount: 1099,
//       currency: "USD",
//       automatic_payment_methods: { enabled: true },
//     });
//     return res.status(200).send({ client_secret: pago.client_secret });
//   } catch (err) {
//     return res.status(500).send(err);
//   }
// });

module.exports = payment;
