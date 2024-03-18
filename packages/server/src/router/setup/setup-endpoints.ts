import { Router } from "express";
import { Config } from "../../config/config.types";
import { setupProxy } from "./setup-proxy";
import { setupPolicies } from "./setup-policies";
import { logger } from "../../utils";

export const setupEndpoints = (router: Router, config: Config) => {
  const { endpoints, policyDefinitions } = config;

  endpoints.forEach((endpoint) => {
    if (policyDefinitions) {
      setupPolicies(router, endpoint, policyDefinitions);
    }
    setupProxy(router, endpoint);

    logger.info(`Created endpoint ${endpoint.path} -> ${endpoint.target.url}`);
  });
};
