const winston = require("winston");

module.exports = (err) => {
  winston.error(err.message, err);
  if (err.code === 11000 || err.code === 11001) {
    return {
      code: 400,
      message: `Expected ${Object.keys(err.keyValue)[0]} value to be unique`,
    };
  }
  return {
    code: 400,
    message: err,
  };
};
