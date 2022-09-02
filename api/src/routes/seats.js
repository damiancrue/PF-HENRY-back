const { Router } = require("express");

const { getSeats } = require("../controllers/getSeats.js");
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const seats = getSeats(); // await no tiene efecto.
    res.json(seats);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
