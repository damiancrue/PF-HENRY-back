const { Router } = require("express");
const { deletePurchase } = require("../controllers/deletePurchase");
const router = Router();

const {
  Purchase,
  ProductDetail,
  User,
  ScheduleDetail,
  Product,
  Schedule,
  Room,
} = require("../db");

router.post("/create", async (req, res, next) => {
  try {
    const { amount, user_id, product_detail_id } = req.body;
    const purchase = await Purchase.create({
      amount,
      user_id,
      product_detail_id,
    });
    res.send(purchase);
  } catch (error) {
    next(error);
  }
});

//! Purchase por query o todas
router.get("/", async (req, res, next) => {
  const { purchase_id } = req.query;
  try {
    if (purchase_id) {
      const purchase = await Purchase.findByPk(purchase_id, {
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: ProductDetail,
            attributes: ["product_quantity"],
          },
        ],
      });
      if (purchase) return res.send(purchase);
      else return res.send("Not matches were found");
    } else {
      const allPurchases = await Purchase.findAll({
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
          {
            model: ProductDetail,
            attributes: ["product_quantity"],
          },
        ],
      });
      res.send(allPurchases);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/history", async (req, res) => {
  const { email } = req.query;
  try {
    console.log(email);
    if (email) {
      const user = await User.findAll({
        where: {
          email: email,
        },
      });
      if (user.length === 0)
        return res
          .status(400)
          .send({ message: "The selected email does not belong to a user" });
      //let role = user[0].role_id;
      let adminRole = "A";
      if (user[0].role_id === adminRole) {
        const userPurchases = await Purchase.findAll({
          include: [
            {
              model: User,
              attributes: ["email"],
            },
            {
              model: ProductDetail,
              attributes: ["product_quantity", "price", "product_id"],
              include: [
                {
                  model: Product,
                  attributes: ["name", "image"],
                },
              ],
            },
            {
              model: ScheduleDetail,
              attributes: ["schedule_quantity", "seat_numbers", "price"],
              include: [
                {
                  model: Schedule,
                  attributes: ["day", "time", "price", "movie_id"],
                  include: [
                    {
                      model: Room,
                      attributes: ["name"],
                    },
                  ],
                },
              ],
            },
          ],
        });
        return res.status(200).send(userPurchases);
      } else {
        const uid = await User.findAll({
          where: {
            email: email,
          },
          attributes: ["user_id"],
        });

        const userPurchases = await Purchase.findAll({
          where: {
            user_id: uid[0].user_id,
          },
          include: [
            {
              model: ProductDetail,
              attributes: ["product_quantity", "price", "product_id"],
              include: [
                {
                  model: Product,
                  attributes: ["name", "image"],
                },
              ],
            },
            {
              model: User,
              attributes: ["email"],
            },
            {
              model: ScheduleDetail,
              attributes: ["schedule_quantity", "seat_numbers", "price"],
              include: [
                {
                  model: Schedule,
                  attributes: ["day", "time", "price", "movie_id"],
                  include: [
                    {
                      model: Room,
                      attributes: ["name"],
                    },
                  ],
                },
              ],
            },
          ],
        });
        return res.status(200).send(userPurchases);
      }

      // console.log("de la query");
      // console.log(user);
      // const userRole = user[0]?.role_id;
      // console.log("userRole");
      // console.log(userRole);
      // const userID = user[0]?.user_id;
    }
    return res.status(400).send({ message: "An email must be sent" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/update/:purchase_id", async (req, res, next) => {
  const { purchase_id } = req.params;
  const { amount, movie_id, user_id, status } = req.body;
  if (!req.body) return "The form is empty";
  try {
    let purchaseInfo = {
      amount: amount,
      movie_id: movie_id,
      user_id: user_id,
      status: status,
    };
    const purchase = await Purchase.findByPk(purchase_id);
    if (purchase) {
      await Purchase.update(
        {
          amount: amount,
          movie_id: movie_id,
          user_id: user_id,
          status: status,
        },
        {
          where: {
            purchase_id: purchase_id,
          },
        }
      );
      res.status(200).send({
        message: "Purchase updated with the following information",
        purchaseInfo: purchaseInfo,
      });
    } else return res.status(400).send("No matches found");
  } catch (error) {
    return res.status(500).send({ message: err });
  }
});
//! Borrado soft purchase
router.delete("/delete/:purchase_id", async (req, res, next) => {
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
});

module.exports = router;
