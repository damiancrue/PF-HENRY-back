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

const users = Router();

//Valida que el usuario exista, o que la sesion no haya terminado
users.get("/validateActiveUser", checkActiveUser, (req, res) => {
  res.status(202).send({ message: "Valid user" });
});

//Busca a todos los usuarios, con la opcion de pasarle
//el parametro "active"
users.get("/getAll", async (req, res) => {
  const { active } = req.query;

  try {
    const usersResult = await User.findAll(
      userHelper.getUsersOptionalParameter(active)
    );
    res.status(202).send(usersResult);
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
});

//Verifica si el usuario esta logueado
//De no estarlo, el middleware envia la respuesta y no se llega aca
users.get("/isLogged", checkActiveUser, async (req, res) => {
  res.status(200).send({ message: "User is logged" });
});

//Setea el flag de "active" en false
users.put(
  "/banUser",
  //getUID,  Se comenta para probar insertar datos falsos que no se pueden validar en firebase
  async (req, res) => {
    const { uid } = req.body;

    try {
      User.update(
        { active: false },
        {
          where: {
            user_id: uid,
          },
        }
      );
      res.status(200).send({ message: "User is now inactive" });
    } catch (err) {
      res.status(400).send({ message: err });
    }
  }
);

//Crea un usuario en nuestra DB, asignandole un rol y la referencia al UID de firebase
users.post(
  "/createUser",
  //getUID,  Se comenta para probar insertar datos falsos que no se pueden validar en firebase
  async (req, res) => {
    const { email, username, role, uid } = req.body;

    if (!email || !username || email === "" || username === "")
      res.status(400).send({
        message: "All creation fields must be sent, and they can't be empty",
      });

    try {
      await User.create({
        user_id: uid,
        name: username,
        email: email,
        role_id: role,
        active: true,
      });
      res.status(201).send({ message: "User created" });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
);

module.exports = users;
