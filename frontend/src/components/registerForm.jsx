import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";

class RegisterForm extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      bankName: "",
      accountNo: "",
      userType: "",
    },
    errors: {},
  };

  schema = {
    firstName: Joi.string().min(2).max(50).required().label("First name"),
    lastName: Joi.string().min(2).max(50).required().label("Last name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().min(5).label("Password"),
    userType: Joi.string()
      .valid("shopkeeper", "registered")
      .required()
      .label("User type"),
    bankName: Joi.string().min(2).max(50).required().label("Bank name"),
    accountNo: Joi.string()
      .regex(/^[A-Z]{2}[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{2}$/)
      .required()
      .error(() => ({
        message:
          "Account no should match the pattern like `XX00 0000 0000 0000 00`",
      })),
  };

  doSubmit = async () => {
    try {
      await userService.register(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.firstName = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("firstName", "First name")}
          {this.renderInput("lastName", "Last name")}
          {this.renderInput("email", "Email", "email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("bankName", "Bank Name")}
          {this.renderInput("accountNo", "Account no")}
          <div className="form-group row">
            <label htmlFor="userType" className="col-sm-2 col-form-label">
              User type
            </label>
            <div className="col-sm-10">
              {this.renderRadio(
                "userType",
                "Registered",
                "userType-registered",
                "registered"
              )}
              {this.renderRadio(
                "userType",
                "Shopkeeper",
                "userType-shopkeeper",
                "shopkeeper"
              )}
            </div>
          </div>
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
