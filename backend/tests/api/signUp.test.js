/* eslint-env jest */
/* global before, after */
const chai = require("chai");
const supertest = require("supertest");
const Promise = require("bluebird");
const winston = require("winston");
const mongoose = require("mongoose");

const { expect } = chai;
const server = supertest.agent(`http://backend:8080/user`);

const { User } = require("../../models/user");
const { validUsers } = require("../testData");
// const { connect, disconnect } = require("./db");

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false, // Don't build indexes
  reconnectInterval: 5000,
  connectTimeoutMS: 30000,
  keepAlive: 1,
};
let url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

/*
= create an registered user
= create an shopkeeper
= create another admin (fail)
= create user with duplicate email
= create user with duplicate account no
= create user with first name lenght < 2
= create user with first name lenght > 100
= create user with last name lenght < 2
= create user with last name lenght > 100 
= create user with invalid email address
= create user with password lenght < 100
= create user with invalid user type
= create user with password lenght < 100
= create user with bank name length < 5
= create user with bank name length > 50
= create user with wrong accunt no format
= create user without first name
= create user without last name
= create user without email
= create user without password
= create user without user type
= create user without bank name
= create user without account no
*/
describe("Check /signup POST register api", () => {
  after("clean users test data", () => {
    mongoose.connect(url, options, async (err) => {
      if (err) {
        winston.error("DB connection error", err);
      }
      await Promise.all(
        validUsers.map(async (user) => {
          await User.deleteOne({ email: user.userData.email });
        })
      );
      mongoose.connection.close();
    });
  });

  const exec = async (data) => {
    return server
      .post("/signup")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Cache-Control", "no-cache")
      .send(data);
  };

  describe("signup successfull", () => {
    validUsers.map(async (user) => {
      it(`an ${user.userType} user signup`, async () => {
        const res = await exec(user.userData);
        expect(res.statusCode).to.equal(200);
      });
    });
  });
});
