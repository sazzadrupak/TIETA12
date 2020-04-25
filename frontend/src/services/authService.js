import http from "./httpService";

const apiUrl = "http://localhost:8080/user/login";

export function login(user) {
  return http.post(apiUrl, {
    email: user.email,
    password: user.password,
  });
}
