// pages/api/index.js
import authHandler from "./auth";
import booksHandler from "./books";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
    case "GET":
      await booksHandler(req, res);
      break;
    default:
      await authHandler(req, res);
      break;
  }
}
