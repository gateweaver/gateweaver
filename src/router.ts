import express from "express";
import { parseConfig } from "./utils/parse-config";
import { createProxies } from "./utils/create-proxies";

const config = parseConfig("config.yml");

const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.get("/config", (_, res) => {
    res.send(config);
  });
}

createProxies(router, config.endpoints);

export { router };
