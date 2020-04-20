import axios from "axios";
import qs from "qs";
import { messageBuilder } from "./messages";

// axios.defaults.baseURL = "http://127.0.0.1:7878";

export const get = (route, params, timeout = 30000) => {
  return axios.get("/api/v1" + route, {
    params,
    timeout,
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    }
  });
};
export const api = {
  getMessages({ limit = 50, currentPage }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(messageBuilder(limit, currentPage));
      }, 100);
    });
  },
  getData(params) {
    return get("/data", params);
  }
};
