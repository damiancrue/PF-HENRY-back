const { Router } = require("express");
const router = Router();
const { postPurchase } = require("../controllers/postPurchase");
const { Purchase, ProductDetail, User } = require("../db");

/* router.post("/create", async (req, res, next) => {
  if (!req.body) res.send("The form is empty");

  try {
    const purchase = await postPurchase(req.body);
    res.json(purchase);
  } catch (e) {
    next(e);
  }
}); */
router.post('/create', async (req, res, next) => {
  try {
    const { amount, user_id, product_detail_id } = req.body;
    const purchase = await Purchase.create({
      amount, user_id, product_detail_id
    });
    console.log(purchase)
    res.send('Hola')
  } catch (error) {
    next(error)
  }
})

module.exports = router;
