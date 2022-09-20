const firebase = require("../firebase-config.js");

//Revisa que el token del usuario este activo e informa
const checkActiveUser = async (req, res, next) => {
  const token = req.query.token;

  try {
    const decodedValue = await firebase.auth().verifyIdToken(token);
    if (decodedValue) {
      req.uid = decodedValue.uid;
      return next();
    }
    return res.status(410).send({ message: "Session no longer active" });
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

//Revisa q el UID del usuario es valido
//Responde en el caso de q la sesion no este activa (no llega a revisar el usuario)
//Responde en el caso de q el usuario sea invalido
//Captura y responde ante errores de ejecucion
//Si todo esta ok, next(); y sigue a la ruta
const checkValidUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodedValue = await firebase.auth().verifyIdToken(token);
    if (decodedValue) {
      const uid = decodedValue.uid;
      const user = await firebase.auth().getUser(uid);
      if (user) {
        req.body.uid = uid;
        return next();
      } else {
        res
          .status(401)
          .send({ message: "Invalid user or session no longer active" });
      }
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getUID = async (req, res, next) => {
  const token = req.body.token;
  console.log(token);
  try {
    const decodedValue = await firebase.auth().verifyIdToken(token);
    if (decodedValue) {
      const uid = decodedValue.uid;
      req.uid = uid;
      next();
    } else {
      return res
        .status(401)
        .send({ message: "Invalid user or session no longer active" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(404).send({ message: err });
  }
};

module.exports = { checkActiveUser, checkValidUser, getUID };
