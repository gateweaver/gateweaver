import { Router } from "express";
import { parseConfigYaml } from "../config/parse";
import { Config } from "../config/types";
import { setupProxy } from "./setup-proxy";
import { setupPolicies } from "./setup-policies";

const setupEndpoints = (router: Router, config: Config) => {
  const { endpoints, policyDefinitions } = config;

  endpoints.forEach((endpoint) => {
    if (policyDefinitions) {
      setupPolicies(router, endpoint, policyDefinitions);
    }
    setupProxy(router, endpoint);
  });
};

const setupRouter = (configPath = process.env.CONFIG_PATH || "gateway") => {
  try {
    const config = parseConfigYaml(configPath);
    const router = Router();

    if (process.env.NODE_ENV === "development") {
      router.get("/config", (_, res) => {
        res.send(config);
      });
    }

    setupEndpoints(router, config);

    return router;
  } catch (error) {
    console.error(`Failed to setup router: ${error}`);
    throw error;
  }
};

export const router = setupRouter();
