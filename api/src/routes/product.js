const { Router } = require("express");
const { Product } = require("../db.js");
const productHelper = require("../helpers/productHelper.js");
const router = Router();

router.get("/", async (req, res, next) => {
  const { name, active } = req.query;

  try {
    const products = await Product.findAll(
      productHelper.getProductsOptionalParameter(name, active, Op)
    );
    products.length > 0
      ? res.status(200).send(products)
      : res.status(404).send({ message: "No products were find" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }

  // if (name) {
  //   try {
  //     const products = await Product.findAll({
  //       where: {
  //         name: {
  //           [Op.iLike]: `%${name}%`,
  //         },
  //       },
  //     });

  //     if (products.length > 0) {
  //       res.json(products);
  //     } else {
  //       res.send("Product not found");
  //     }
  //   } catch (e) {
  //     next(e);
  //   }
  // } else {
  //   try {
  //     const products = await Product.findAll();
  //     res.json(products);
  //   } catch (e) {
  //     next(e);
  //   }
  // }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send("No matches were found");
    }
  } catch (e) {
    res.status(500).send({ message: err.message });
    //next(e);
  }
});

router.post("/create", async (req, res, next) => {
  if (!req.body) res.send("The form is empty");

  try {
    const { name, price, stock, image } = req.body;
    //!stock ? (cant = 0) : (cant = parseInt(stock));
    const product = await Product.create({
      name,
      price: parseFloat(price),
      stock: !stock ? 0 : parseInt(stock),
      //stock: cant,
      image,
    });
    res.status(201).send(product);
  } catch (e) {
    next(e);
  }
});

router.put("/update/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!req.body) res.status(400).send("The form is empty");

  try {
    const { name, price, stock, image } = req.body;
    const product = await Product.findByPk(id);

    if (product) {
      await product.update({
        name,
        price,
        stock,
        image,
      });
      res.status(200).send(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
    //next(e);
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
      res.status(200).send(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
    //next(e);
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
      res.status(200).send(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
    //next(e);
  }
});

module.exports = router;
