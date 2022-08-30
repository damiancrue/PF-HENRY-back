const { Router } = require("express");
const { Product } = require("../db.js");
const router = Router();

router.get("/", async (req, res, next) => {
  const { name } = req.query;

  if (name) {
    try {
      const products = await Product.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
      });

      if (products.length > 0) {
        res.json(products);
      } else {
        res.send("Product not found");
      }
    } catch (e) {
      next(e);
    }
  } else {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (e) {
      next(e);
    }
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (product) {
      res.json(product);
    } else {
      res.send("No matches were found");
    }
  } catch (e) {
    next(e);
  }
});

router.post("/create", async (req, res, next) => {
  if (!req.body) res.send("The form is empty");

  try {
    const { name, price, stock,image } = req.body;
    !stock?cant=0:cant=parseInt(stock)
    const product = await Product.create({
      name,
      price:parseFloat(price),
      stock: cant,
      image
    });
    res.json(product);
  } catch (e) {
    next(e);
  }
});

router.put("/update/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!req.body) res.send("The form is empty");

  try {
    const { name, price, stock,image } = req.body;
    const product = await Product.findByPk(id);


    if (product) {
      await product.update({
        name,
        price,
        stock,
        image
      });
      res.json(product);
    } else {
      res.send("Product not found");
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (product) {
      await product.update({
        active: false,
      });
      res.json(product);
    } else {
      res.send("Product not found");
    }
  } catch (e) {
    next(e);
  }
});

router.put("/activate/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (product) {
      await product.update({
        active: true,
      });
      res.json(product);
    } else {
      res.send("Product not found");
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
