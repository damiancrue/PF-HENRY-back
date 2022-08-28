const { Router } = require("express");
const { getDisplay } = require("../controllers/getDisplay.js");
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const display = getDisplay(); // await no tiene efecto porque trae es un array.
    res.json(display);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
