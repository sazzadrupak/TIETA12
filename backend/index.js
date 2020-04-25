const winston = require("winston");
const express = require("express");

const app = express();

require("./startapp/logging")();
require("./startapp/cors")(app);
require("./startapp/routes")(app);
require("./startapp/db")();

const port = process.env.PORT || 8080;
const server = app.listen(port, () =>
  winston.info(`Listening to port ${port}...`)
);
module.exports = server;
