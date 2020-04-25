import http from "./httpService";

const apiUrl = "http://localhost:8080/user/signup";

export function register(user) {
  console.log("DATA2", user);
  return http.post(apiUrl, {
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
    email: user.email,
    bankName: user.bankName,
    accountNo: user.accountNo,
    userType: user.userType,
  });
}
