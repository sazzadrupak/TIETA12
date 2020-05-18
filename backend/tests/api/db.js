const winston = require("winston");
const mongoose = require("mongoose");

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB_TEST,
} = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 20000, // Close sockets after 45 seconds of inactivity
};

let url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB_TEST}`;

module.exports = () => {
  mongoose
    .connect(url, options)
    .then(() => winston.info(`Connected to ${url}...`))
    .catch((err) => {
      winston.error("DB connection error", err);
    });
};
