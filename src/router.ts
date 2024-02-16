import express from "express";
import { parseConfig } from "./utils/config/parse-config";
import { createProxies } from "./utils/proxy/create-proxies";

// TODO: prevent the app from crashing if the config is invalid
const config = parseConfig("config.yml");

const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.get("/config", (_, res) => {
    res.send(config);
  });
}

createProxies(router, config.endpoints);

export { router };
