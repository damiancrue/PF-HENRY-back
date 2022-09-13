const { Router } = require("express");
const { User, Role, Op } = require("../db.js");
const userHelper = require("../helpers/userHelper.js");
const axios = require("axios");
require("dotenv").config();
const {
  checkActiveUser,
  checkValidUser,
  getUID,
} = require("../middlewares/auth.js");
const e = require("express");

const users = Router();

//Valida que el usuario exista, o que la sesion no haya terminado
users.get("/isActive", checkActiveUser, async (req, res) => {
  const uid = req.uid;

  try {
    const user = await User.findByPk(uid);

    //Lineas agregadas para ambientes de test
    if (user === null)
      return res.status(204).send({ message: "User no longer active" });
    //
    return res.status(200).send({ email: user.email, name: user.name });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

//Busca a todos los usuarios, con la opcion de pasarle
//el parametro "active"
users.get("/getAll", async (req, res) => {
  const { active } = req.query;

  try {
    const usersResult = await User
      .findAll
      //userHelper.getUsersOptionalParameter(active)
      ();
    res.status(200).send(usersResult);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Setea el flag de active en false
users.put("/banUser", async (req, res) => {
  const { email } = req.body;

  try {
    await User.update(
      { active: false },
      {
        where: {
          email: email,
        },
      }
    );
    res.status(200).send({ message: "User is now inactive" });
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

users.put("/modifyRole", async (req, res) => {
  const { email, role } = req.body;
  try {
    const userExists = await userHelper.getUserID(email);
    if (userExists) {
      await User.update({ role_id: role }, { where: { email: email } });
      res.status(200).send();
    } else {
      res.status(404).send({ message: "Specified user does not exists" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//Setea el flag de active en true
users.put("/unbanUser", async (req, res) => {
  const { email } = req.body;

  try {
    const userExists = await userHelper.getUserID(email);
    if (userExists) {
      await User.update({ active: true }, { where: { email: email } });
      res.status(200).send();
    } else {
      res.status(404).send({ message: "Specified user does not exists" });
    }
  } catch (err) {
    res.status(500).send({ message: e.message });
  }
});

//Crea un usuario en nuestra DB, asignandole un rol y la referencia al UID de firebase
users.post(
  "/createUser",
  getUID, //Se comenta para probar insertar datos falsos que no se pueden validar en firebase
  async (req, res) => {
    const { email, username, role } = req.body;
    const uid = req.uid;

    if (!email || !username || email === "" || username === "")
      return res.status(400).send({
        message: "All creation fields must be sent, and they can't be empty",
      });

    try {
      await User.create({
        user_id: uid,
        name: username,
        email: email,
        role_id: "A",
        active: true,
      });
      return res.status(201).send({ message: "User created" });
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  }
);

//Valida que el usuario sea admin
users.post("/isAdmin", getUID, async (req, res) => {
  const uid = req.uid;

  try {
    userRole = await User.findByPk(uid);
    console.log(userRole.role_id);
    if (userRole.role_id === "A") {
      return res.status(200).send(true);
    } else {
      return res.status(202).send(false);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = users;
