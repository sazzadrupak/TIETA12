import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as authService from "../services/authService";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const responseBody = await authService.login(data);
      console.log({ headers: responseBody.headers });
    } catch (ex) {
      if (
        ex.response &&
        (ex.response.status === 400 || ex.response.status === 404)
      ) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email", "email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}
export default LoginForm;
