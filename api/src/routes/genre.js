const { Router } = require("express");
const { getGenres } = require("../controllers/getGenres.js");
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const genres = getGenres(); // await no tiene efecto porque trae es un array.
    res.json(genres);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
