const { Router } = require("express");
const router = Router();
const {genres} = require("../controllers/getGenres.js")

router.get("/", async (req, res, next) => {
  res.json(genres())
})

module.exports = router;