import express from "express";
import { parseConfig } from "./utils/config/parse-config";
import { createProxies } from "./utils/proxy/create-proxies";

const config = parseConfig("config.yml");

const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.get("/config", (_, res) => {
    res.send(config);
  });
}

createProxies(router, config.endpoints);

export { router };
