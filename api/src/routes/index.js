const { Router } = require("express");
const axios = require("axios");

require("dotenv").config();

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//Agrega el enrutado de /users

//Esta sería la información para el index.js modularizando las rutas//
const MovieRouter = require("./movie.js");
const RatingRouter = require("./rating.js");
const ProductRouter = require("./product.js");
const GenreRouter = require("./genre.js");
const DisplayRouter = require("./display.js");
const LanguageRouter = require("./language.js");
const SeatRouter = require("./seats.js");
const RoomRouter = require("./room.js");
const PurchaseRouter = require("./purchase.js");
const UserRouter = require("./users.js");
const ScheduleRouter = require("./schedule.js");

router.use("/movies", MovieRouter);
router.use("/ratings", RatingRouter);
router.use("/products", ProductRouter);
router.use("/genres", GenreRouter);
router.use("/displays", DisplayRouter);
router.use("/languages", LanguageRouter);
router.use("/seats", SeatRouter);
router.use("/rooms", RoomRouter);
router.use("/purchases", PurchaseRouter);
router.use("/users", UserRouter);
router.use("schedules", ScheduleRouter);

module.exports = router;
