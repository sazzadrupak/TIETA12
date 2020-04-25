import axios from "axios";
import { toast } from "react-toastify";
import logger from "./logService";

axios.interceptors.response.use(null, (error) => {
  const errorCondition =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!errorCondition) {
    console.log("Error--", error);
    logger.log(error);
    toast.error("Unexpected error occurred");
  }
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
