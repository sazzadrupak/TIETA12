const mongoose = require("mongoose");
/* eslint-disable */
module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send("Invalid ID.");
  }
  next();
};
/* eslint-enable */
