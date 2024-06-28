import { Router } from "express";
import { Config } from "../../../config/config.types";
import { setupProxy } from "./proxy";
import { setupEndpointPolicies } from "./policies";
import { logger } from "../../../utils/logger";
import { setupEndpointMiddleware } from "./middleware";
import { setupHandler } from "./handler";

export const setupEndpoints = async (
  router: Router,
  config: Config,
): Promise<void> => {
  const { endpoints, policyDefinitions } = config;

  for (const endpoint of endpoints) {
    if (policyDefinitions) {
      setupEndpointPolicies({ router, endpoint, policyDefinitions });
    }

    await setupEndpointMiddleware(router, endpoint);

    if (endpoint.target?.url) {
      setupProxy(router, endpoint);
      logger.info(
        `Created proxy endpoint ${endpoint.path} -> ${endpoint.target.url}`,
      );
    } else if (endpoint.target?.handler) {
      await setupHandler(router, endpoint.path, endpoint.target.handler);
      logger.info(
        `Created handler endpoint ${endpoint.path} -> ${endpoint.target.handler.function}`,
      );
    } else {
      logger.error(`No valid target specified for endpoint ${endpoint.path}`);
    }
  }
};
