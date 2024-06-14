import { Router } from "express";
import { Config } from "../../config/config.types";
import { setupProxy } from "./setup-proxy";
import { setupPolicies } from "./setup-policies";
import { loadCustomMiddleware } from "./setup-middleware";
import { logger } from "../../logger";

export const setupEndpoints = async (
  router: Router,
  config: Config,
): Promise<void> => {
  const { endpoints, policyDefinitions } = config;

  endpoints.forEach(async (endpoint) => {
    if (policyDefinitions) {
      setupPolicies(router, endpoint, policyDefinitions);
    }

    await loadCustomMiddleware(router, endpoint);

    setupProxy(router, endpoint);

    logger.info(`Created endpoint ${endpoint.path} -> ${endpoint.target.url}`);
  });
};
