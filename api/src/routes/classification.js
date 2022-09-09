const { Router } = require("express");

const { getClassifications } = require("../controllers/getClassifications.js");
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const classifications = getClassifications(); // await no tiene efecto.
    res.json(classifications);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
