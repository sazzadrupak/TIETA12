const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const validator = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const asyncMiddleware = require("../middleware/async");
const mongooseError = require("../utils/mongooseError");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.post("/signup", [validator(validate)], async (req, res) => {
  const userType = req.body.userType;
  if (userType === "admin") {
    let user = await User.findOne({ userType });
    if (user) return res.status(400).send("User can not be admin");
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "userType",
      "bankName",
      "accountNo",
      "email",
      "password",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.tokenId = uuidv4();

  try {
    await user.save();
  } catch (ex) {
    const { code, message } = mongooseError(ex);
    return res.status(code).send(message);
  }

  return res
    .status(200)
    .send({ message: "Your account has been created successfully." });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (_.isEmpty(user)) return res.status(404).send("Invalid email or password");
  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "userType", "_links"]));
  }
  return res.status(400).send("Invalid email or password");
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const { _id, userType } = req.user;
  if (userType === "admin" || _id === req.params.id) {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("The user with the given ID was not found.");
    }
    return res.send(
      _.pick(user, [
        "firstName",
        "lastName",
        "userType",
        "bankName",
        "accountNo",
        "email",
        "_links",
      ])
    );
  }
  return res.status(403).send("Access denied.");
});

router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const { _id, userType } = req.user;
    if (userType === "admin" || _id === req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .send("The user with the given ID was not found.");
      }

      const updateBody = {
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        bankName: req.body.bankName || user.bankName,
        accountNo: req.body.accountNo || user.accountNo,
        email: user.email,
        password: user.password,
      };
      const { error } = validate(updateBody);
      if (error) return res.status(400).send(error.details[0].message);

      try {
        const updateUser = await User.findByIdAndUpdate(
          req.params.id,
          updateBody,
          { new: true }
        );
        return res.send(
          _.pick(updateUser, [
            "firstName",
            "lastName",
            "userType",
            "bankName",
            "accountNo",
            "email",
            "_links",
          ])
        );
      } catch (ex) {
        const { code, message } = mongooseError(ex);
        return res.status(code).send(message);
      }
    }
    return res.status(403).send("Access denied.");
  })
);

router.put(
  "/userType/:id",
  [auth, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const { userType } = req.user;
    if (userType === "admin") {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .send("The user with the given ID was not found.");
      }

      const updateBody = {
        firstName: user.firstName,
        lastName: user.lastName,
        bankName: user.bankName,
        accountNo: user.accountNo,
        email: user.email,
        password: user.password,
        userType: req.body.userType,
      };
      const { error } = validate(updateBody);
      if (error) return res.status(400).send(error.details[0].message);

      try {
        const updateUser = await User.findByIdAndUpdate(
          req.params.id,
          updateBody,
          { new: true }
        );
        return res.send(
          _.pick(updateUser, [
            "firstName",
            "lastName",
            "userType",
            "bankName",
            "accountNo",
            "email",
            "_links",
          ])
        );
      } catch (ex) {
        const { code, message } = mongooseError(ex);
        return res.status(code).send(message);
      }
    }
    return res.status(403).send("Access denied.");
  })
);

module.exports = router;
