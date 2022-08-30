const { Router } = require("express");
const { User, Role, Op } = require("../db.js");
const userHelper = require("../helpers/userHelper.js");
const axios = require("axios");
require("dotenv").config();
const { checkActiveUser, checkValidUser } = require("../middlewares/auth.js");

const users = Router();

users.get("/test", async (req, res) => {
  const roles = await Role.findAll();
  res.status(200).send(roles);
});

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
users.post("/createBasicUser", async (req, res) => {
  const { email, name, user_id } = req.body;
  console.log(email);
  console.log(name);
  console.log("llego");
  if (!email || !name || email === "" || name === "")
    res.status(400).send({
      message: "All creation fields must be sent, and they can't be empty",
    });

  try {
    await User.create({
      user_id: user_id,
      name: name,
      email: email,
      role_id: 1, //userHelper.getRoleID("Customer"),
    });
    res.status(201).send({ message: "User created" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//Valida que el usuario exista, o que la sesion no haya terminado
users.get("/validateActiveUser", checkActiveUser, (req, res) => {
  res.status(202).send({ message: "Valid user" });
});

module.exports = users;
