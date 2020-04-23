const express = require('express');
const error = require('../middleware/error');
const user = require('../routes/users');
const product = require('../routes/products');

module.exports = (app) => {
  app.use(express.json());
  app.use('/user', user);
  app.use('/product', product);
  app.use(express.urlencoded({ extended: true }));
  app.use(error);
};
