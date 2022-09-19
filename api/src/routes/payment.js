const { Router } = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");
const { Purchase } = require("../db.js");
require("dotenv").config();
const { ACCESS_TOKEN } = process.env;

const payment = Router();
//payment.use(cors());
mercadopago.configure({
  access_token: ACCESS_TOKEN,
});

payment.get("/", async (req, res, next) => {
  const latest_id = await Purchase.findAll({
    limit: 1,
    order: [["purchase_id", "DESC"]],
  });
  const purchase_id = latest_id.length === 0 ? 1 : latest_id[0] + 1;
  const id_orden = 1;
  const carrito = [
    { title: "Producto 1", quantity: 5, price: 10.5 },
    { title: "Producto 2", quantity: 10, price: 9.5 },
    { title: "Producto 3", quantity: 8, price: 12.5 },
  ];
  const items_ml = carrito.map((item) => ({
    title: item.title,
    unit_price: item.price,
    quantity: item.quantity,
  }));
  let preference = {
    items: items_ml,
    external_reference: `${id_orden}`,
    payment_methods: {
      excluded_payment_types: [
        {
          id: "atm",
        },
      ],
      installments: 3,
    },
    back_urls: {
      success: "http://localhost:3000/cinema",
      failure: "http://localhost:3000/cinema/login",
      pending: "http://localhost:3000/cinema/register",
    },
  };
  mercadopago.preferences
    .create(preference)
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
});

payment.get("/pagos", (req, res) => {
  console.info("EN LA RUTA DE PAGOS ", req);
  const payment_id = req.query.payment_id;
  const payment_status = req.query.status;
  const external_reference = req.query.external_reference;
  const merchant_order_id = req.query.merchant_order_id;
  console.log("EXTERNAL REFERENCE ", external_reference);
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

payment.post("/processPayment", async (req, res) => {
  const { amount, products, functions } = req.body;
  //console.log(req);
  //if (!amount || !products || !functions)
  //return res.status(400).send({ message: "All data must be sent" });
  try {
    const newPayment = await stripe.paymentIntents.create({
      amount,
      currency: "ARS",
      description: "Test purchase",
      payment_method: "card",
      confirm: true,
    });
    return res.status(200).send(newPayment);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

payment.post("/test", async (req, res) => {
  try {
    const pago = await Stripe.paymentIntents.create({
      amount: 1099,
      currency: "USD",
      automatic_payment_methods: { enabled: true },
    });
    return res.status(200).send({ client_secret: pago.client_secret });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = payment;
