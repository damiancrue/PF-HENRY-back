const { Router } = require("express");

const { getLanguage } = require("../controllers/getLanguage.js");
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const languages = getLanguage(); // await no tiene efecto porque trae es un array.
    res.json(languages);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
