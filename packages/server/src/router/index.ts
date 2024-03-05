import { Router } from "express";
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

export const setupRouter = (config: Config) => {
  try {
    const router = Router();

    if (process.env.NODE_ENV === "development") {
      router.get("/config", (_, res) => {
        res.send(config);
      });
    }

    setupEndpoints(router, config);

    return router;
  } catch (error) {
    throw new Error(`Failed to set up router:\n${error}`);
  }
};
