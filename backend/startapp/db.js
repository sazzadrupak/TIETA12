const winston = require("winston");
const mongoose = require("mongoose");

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true,
  poolSize: 5,
};

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

module.exports = () => {
  mongoose
    .connect(url, options)
    .then(() => winston.info(`Connected to ${url}...`))
    .catch((err) => {
      winston.error("DB connection error", err);
    });
};
