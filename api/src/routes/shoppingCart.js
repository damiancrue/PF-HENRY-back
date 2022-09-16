const { Router } = require("express");
const cors = require("cors");
const { ShoppingCart, User } = require("../db.js");
const { Op } = require("sequelize");

const shoppingCart = Router();
shoppingCart.use(cors());

shoppingCart.get("/getCart", async (req, res) => {
  const { email } = req.query;
  if (!email || email === "")
    return res.status(400).send({ message: "Incorrect email" });
  try {
    const uid = await User.findAll({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });
    const cart = ShoppingCart.findAll({
      where: {
        user_id: {
          [Op.eq]: uid[0],
        },
      },
    });
    return res.status(200).send(cart);
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

shoppingCart.put("/reconcileCart", async (req, res) => {
  const { products, schedules, email } = req.body;
});

shoppingCart.post("/setCart", async (req, res) => {
  const { email, products, schedules } = req.body;
  if (
    !email ||
    email === "" ||
    (products.length === 0 && schedules.length === 0)
  )
    return res.status(400).send({
      message: "Invalid email, or no products nor schedules were sent",
    });
  try {
    const uid = await User.findAll({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });
    const oldCart = await ShoppingCart.findAll({
      where: {
        user_id: {
          [Op.eq]: uid[0],
        },
      },
    });
    if (oldCart.lengt === 0) {
    }
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

module.exports = shoppingCart;
