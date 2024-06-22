import { Router } from "express";
import { Config } from "../../../config/config.types";
import { setupGlobalPolicies } from "./policies";
import { setupGlobalMiddleware } from "./middleware";

export const setupGlobalConfig = async (
  router: Router,
  config: Config,
): Promise<void> => {
  const { global, policyDefinitions } = config;

  if (policyDefinitions && global?.policies) {
    const { policies } = global;

    setupGlobalPolicies({ router, policyDefinitions, policies });
  }

  if (global?.middleware) {
    await setupGlobalMiddleware(router, global.middleware);
  }
};
