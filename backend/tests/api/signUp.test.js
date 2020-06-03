/* eslint-env jest */
/* global before, after */
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const chai = require("chai");
const supertest = require("supertest");
const Promise = require("bluebird");
const winston = require("winston");
const mongoose = require("mongoose");

const { expect } = chai;
const server = supertest.agent(`http://backend:8080/user`);

const { User } = require("../../models/user");
const { validUsers, invalidUsers } = require("../testData");
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
  poolSize: 1,
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
  before("add admin user", () => {
    mongoose.connect(url, options, async (err) => {
      if (err) {
        winston.error("DB connection error ", err);
      }
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("ZAQ!2wsx", salt);
      await User.create(
        {
          firstName: "Demo",
          lastName: "admin",
          email: "demo@admin.fi",
          password,
          userType: "admin",
          bankName: "Nordea",
          accountNo: "FI21 1234 5678 9012 34",
          tokenId: uuidv4(),
        },
        function (error) {
          if (error) winston.error("Add admin error ", error);
          mongoose.connection.close();
        }
      );
    });
  });

  after("clean users test data", () => {
    mongoose.connect(url, options, async (err) => {
      if (err) {
        winston.error("DB connection error ", err);
      }
      await Promise.all(
        validUsers.map(async (user) => {
          await User.deleteOne({ email: user.userData.email });
        })
      );
      await User.deleteOne({ email: "demo@admin.fi" });
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
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal(
          "Your account has been created successfully."
        );
      });
    });
  });

  describe("unsuccessful registration", () => {
    invalidUsers.map(async (item) => {
      it(`${item.name}`, async () => {
        const res = await exec(item.user);
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal(item.message);
      });
    });
  });
});
