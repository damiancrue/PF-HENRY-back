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
const { Op } = require("sequelize");
require("dotenv").config();
const { ACCESS_TOKEN } = process.env;
const { getUID } = require("../middlewares/auth.js");

const payment = Router();
//payment.use(cors());
mercadopago.configure({
  access_token: ACCESS_TOKEN,
});

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

    //Crea el detalle de compra de funcion
    let newScheduleDetail = await ScheduleDetail.create({
      schedule_quantity: scheduleId.selected.length,
      seat_numbers: scheduleId.selected,
      price: 10,
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
        success: "http://localhost:3000/payment/followUp",
        failure: "http://localhost:3000/payment/followUp",
        pending: "http://localhost:3000//payment/followUp",
      },
    };
    mercadopago.preferences
      .create(mpPreference)
      .then((response) => {
        console.log("respondio");
        global.id = response.body.id;
        console.log(response.body);
        return res.status(200).send({ id: global.id });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send(err);
      });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});
//comment
payment.get("/followUp", async (req, res) => {
  console.info("EN LA RUTA DE PAGOS ", req);
  const payment_id = req.query.payment_id;
  const payment_status = req.query.status;
  const external_reference = req.query.external_reference;
  const merchant_order_id = req.query.merchant_order_id;
  console.log(payment_status);
  console.log("EXTERNAL REFERENCE ", external_reference);
  const editPurchase = await Purchase.update(
    { status: "completed" },
    {
      where: {
        purchase_id: {
          [Op.eq]: external_reference,
        },
      },
    }
  );
  return res.redirect("http://localhost:3000/cinema");
});

payment.get("/pagos/:id", (req, res) => {
  const mp = new mercadopago(ACCESS_TOKEN);
  const id = req.params.id;
  console.info("Buscando el id", id);
  mp.get(`/v1/payments/search`, { status: "success" })
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
