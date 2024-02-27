import express from "express";
import { parseConfigYaml } from "../config/parse";
import { createProxies } from "./create-proxies";
import { addGlobalPolicies } from "./global-policies";

const setupRouter = (configPath = "config") => {
  const config = parseConfigYaml(configPath);

  const router = express.Router();

  // TODO: Add config path as env variable and validate config.yml to make sure not using same path
  if (process.env.NODE_ENV === "development") {
    router.get("/config", (_, res) => {
      res.send(config);
    });
  }

  const { endpoints, policies } = config;

  if (policies) {
    addGlobalPolicies(router, policies);
  }

  createProxies(router, endpoints);

  return router;
};

export const router = setupRouter();
