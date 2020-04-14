import { messageBuilder } from "./messages";

export const api = {
  getMessages({ limit = 50, currentPage }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(messageBuilder(limit, currentPage));
      }, 100);
    });
  }
};
