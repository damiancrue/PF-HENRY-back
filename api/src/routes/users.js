const { Router } = require("express");
const { User, Role, Op } = require("../db.js");
const userHelper = require("../helpers/userHelper.js");
const axios = require("axios");
require("dotenv").config();
const { checkActiveUser, checkValidUser } = require("../middlewares/auth.js");

const users = Router();

users.get("/getUser", checkValidUser, async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await User.findByPk(uid);
    res.status(200).send({ email: user.email, name: user.name });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//Crea un usuario en nuestra DB, asignandole un rol y la referencia al UID de firebase
users.post("/createBasicUser", checkValidUser, async (req, res) => {
  const { email, uid, name } = req.body;

  if (!email || !name || email === "" || name === "")
    res.status(400).send({
      message: "All creation fields must be sent, and they can't be empty",
    });

  try {
    await User.create({
      role_id: uid,
      name: name,
      email: email,
      role_id: userHelper.getRoleID("Customer"),
    });
    res
      .status(201)
      .send({ user: { name: name, email: email }, message: "User created" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//Valida que el usuario exista, o que la sesion no haya terminado
users.get("/validateActiveUser", checkActiveUser, (req, res) => {
  res.status(202).send({ message: "Valid user" });
});

module.exports = users;
