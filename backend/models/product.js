const Joi = require("joi");
const mongoose = require("mongoose");

const opts = { toJSON: { virtuals: true } };

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productName: {
      type: String,
      required: true,
      minLength: 2,
      maxlength: 255,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shopkeeperPrice: {
      type: Number,
      min: 1,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    soldTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
  opts
);

/* eslint-disable */
productSchema.virtual("_links").get(function () {
  const links = [
    { rel: "self", href: `http://localhost:3000/product/` + this._id },
  ];
  return links;
});
/* eslint-enable */
const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = {
    productName: Joi.string().min(2).max(255).required(),
    price: Joi.number().integer().min(1).required(),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
