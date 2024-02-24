import express from "express";
import { parseConfig } from "./utils/config/parse-config";
import { createProxies } from "./utils/proxy/create-proxies";
import { addGlobalPolicies } from "./utils/policies/global-policies";

const config = parseConfig("config.yml");

const router = express.Router();

// TODO: Add config path as env variable and validate config.yml to make sure not using same path
if (process.env.NODE_ENV === "development") {
  router.get("/config", (_, res) => {
    res.send(config);
  });
}

const { endpoints, policies } = config;

if (policies) addGlobalPolicies(router, policies);

createProxies(router, endpoints);

export { router };
