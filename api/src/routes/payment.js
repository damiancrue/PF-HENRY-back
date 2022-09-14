require("dotenv").config();
const { Router } = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const { STRIPE_KEY } = process.env;
const stripe = new Stripe(STRIPE_KEY);

const payment = Router();
payment.use(cors());

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

module.exports = payment;
