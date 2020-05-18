const _ = require("lodash");
const express = require("express");
const { Product, validate } = require("../models/product");
const auth = require("../middleware/auth");
const validator = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const asyncMiddleware = require("../middleware/async");
const mongooseError = require("../utils/mongooseError");

const router = express.Router();

router.post("/", [auth, validator(validate)], async (req, res) => {
  const { _id } = req.user;
  const product = new Product(_.pick(req.body, ["productName", "price"]));
  product.userId = _id;
  try {
    const result = await product.save();
    return res.send(_.pick(result, ["productName", "price", "_links"]));
  } catch (ex) {
    const { code, message } = mongooseError(ex);
    return res.status(code).send(message);
  }
});

router.get("/", [auth], async (req, res) => {
  const products = await Product.find().populate("userId");
  return res.send(_.pick(products[0], ["productName", "price", "_links"]));
});

module.exports = router;
