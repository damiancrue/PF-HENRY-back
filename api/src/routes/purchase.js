const { Router } = require("express");
const router = Router();
const { postPurchase } = require("../controllers/postPurchase");

router.post("/create", async (req, res, next) => {
  if (!req.body) res.send("The form is empty");

  try {
    const purchase = await postPurchase(req.body);
    res.json(purchase);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
