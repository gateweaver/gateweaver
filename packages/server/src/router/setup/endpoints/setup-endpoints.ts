import { Router } from "express";
import { Config } from "../../../config/config.types";
import { setupProxy } from "./setup-proxy";
import { setupPolicies } from "./setup-policies";
import { logger } from "../../../logger";
import { setupMiddleware } from "./setup-middleware";
import { setupHandler } from "./setup-handler";

export const setupEndpoints = async (
  router: Router,
  config: Config,
): Promise<void> => {
  const { endpoints, policyDefinitions } = config;

  for (const endpoint of endpoints) {
    if (policyDefinitions) {
      setupPolicies(router, endpoint, policyDefinitions);
    }

    await setupMiddleware(router, endpoint);

    if (endpoint.target?.url) {
      setupProxy(router, endpoint);
      logger.info(
        `Created proxy endpoint ${endpoint.path} -> ${endpoint.target.url}`,
      );
    } else if (endpoint.target?.handler) {
      await setupHandler(router, endpoint.path, endpoint.target.handler);
      logger.info(
        `Created custom handler endpoint ${endpoint.path} -> ${endpoint.target.handler.path}:${endpoint.target.handler.function}`,
      );
    } else {
      logger.error(`No valid target specified for endpoint ${endpoint.path}`);
    }
  }
};
