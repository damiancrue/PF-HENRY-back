const { Router } = require("express");
const axios = require("axios");
const users = require("./users.js");
const { Breed, Temperament } = require("../db");
require("dotenv").config();

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//Agrega el enrutado de /users
router.use("/users", users);

//Esta sería la información para el index.js modularizando las rutas//
const MovieRouter = require("./movie.js");
const RatingRouter = require("./rating.js");
const ProductRouter = require("./product.js");
const GenreRouter = require("./genre.js");

const DisplayRouter = require("./display.js");
router.use("/movies", MovieRouter);
router.use("/ratings", RatingRouter);
router.use("/products", ProductRouter);
router.use("/genres", GenreRouter);
router.use("/displays", DisplayRouter);
router.use("/rooms", RoomRouter);




module.exports = router;
