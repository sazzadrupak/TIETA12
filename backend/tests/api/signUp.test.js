/* eslint-env jest */
/* global before, after */
const chai = require("chai");
const supertest = require("supertest");
const Promise = require("bluebird");

const { expect } = chai;
const server = supertest.agent(`http://backend:8080/user`);

const { User } = require("../../models/user");
const { validUsers } = require("../testData");

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
  after("DELETE all users except admin", async () => {
    const db = require("../../startapp/db");
    console.log("After");
    let Info = await db.User();
    console.log({ User: Info });
    db.disconnect();
    //validUsers.map(async (user) => {

    //});
  });

  const exec = (data) => {
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
