const { Router } = require("express");
const { deletePurchase } = require("../controllers/deletePurchase");
const router = Router();

const { Purchase, ProductDetail, User } = require("../db");

router.post('/create', async (req, res, next) => {
  try {
    const { amount, user_id, product_detail_id } = req.body;
    const purchase = await Purchase.create({
      amount,
      user_id,
      product_detail_id
    })
    res.send(purchase)
  } catch (error) {
    next(error)
  }
});

//! Purchase por query o todas
router.get('/', async (req, res, next) => {
  const { purchase_id } = req.query
  try {
    if (purchase_id) {
      const purchase = await Purchase.findByPk(purchase_id, {
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
          {
            model: ProductDetail,
            attributes: ['product_quantity']
          }
        ]
      });
      if (purchase) return res.send(purchase);
      else return res.send("Not matches were found");
    } else {
      const allPurchases = await Purchase.findAll({
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
          {
            model: ProductDetail,
            attributes: ['product_quantity']
          }
        ]
      })
      res.send(allPurchases);
    }
  } catch (error) {
    next(error);
  }
});

router.put('/update/:purchase_id', async (req, res, next) => {
  const { purchase_id } = req.params;
  const { amount, movie_id, user_id } = req.body;
  if (!req.body) return ('The form is empty');
  try {
    const purchase = await Purchase.findByPk(purchase_id);
    if (purchase) {
      await purchase.update({
        amount, movie_id, user_id
      });
      res.send(purchase);
    } else return res.send('No matches found');
  } catch (error) {

  }
});
//! Borrado soft purchase
router.delete('/delete/:purchase_id', async (req, res, next) => {
  const { purchase_id } = req.params;
  try {
    const result = await deletePurchase(purchase_id);
    if (result) res.json(result);
    else {
      res.send("No matches were found");
    }
  } catch (e) {
    next(e);
  }

})

module.exports = router;
