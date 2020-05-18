const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const opts = { toJSON: { virtuals: true } };

function accountNoValidate(accountNo) {
  return (
    accountNo.length &&
    /^[A-Z]{2}[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{2}$/.test(accountNo)
  );
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
    },
    tokenId: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["admin", "shopkeeper", "registered"],
      default: "registered",
    },
    bankName: {
      type: String,
      required: true,
      minLength: 5,
      maxlength: 50,
    },
    accountNo: {
      type: String,
      required: true,
      unique: true,
      validate: [
        accountNoValidate,
        "Account no should match the pattern like `AB00 0000 0000 0000 00`",
      ],
    },
  },
  { timestamps: true },
  opts
);
/* eslint-disable */
userSchema.virtual("_links").get(function () {
  const links = [
    { rel: "self", href: `http://localhost:3000/user/` + this._id },
  ];
  return links;
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, userType: this.userType, email: this.email },
    config.get("jwtPrivateKey")
  );
  return token;
};
/* eslint-enable */
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required(),
    bankName: Joi.string().min(2).max(50).required(),
    userType: Joi.string()
      .valid("admin", "shopkeeper", "registered")
      .uppercase(),
    accountNo: Joi.string()
      .regex(/^[A-Z]{2}[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{2}$/)
      .required()
      .error(() => ({
        message:
          "Account no should match the pattern like `XX00 0000 0000 0000 00`",
      })),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
