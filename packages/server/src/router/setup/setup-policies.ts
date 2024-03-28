import {
  PolicyDefinitions,
  PolicyOption,
  policyMiddleware,
} from "@gateweaver/policies";
import { Router } from "express";
import { Endpoint } from "../../config/config.types";
import { logger } from "../../logger";

export const setupPolicies = (
  router: Router,
  endpoint: Endpoint,
  policyDefinitions: PolicyDefinitions,
): void => {
  if (policyDefinitions && endpoint.policies) {
    const { policies } = endpoint;

    const { cors, jwt, apiKey, rateLimit } = policyDefinitions;

    if (cors && policies.includes(PolicyOption.Cors)) {
      router.use(endpoint.path, policyMiddleware.cors(cors));
    }

    if (jwt && policies.includes(PolicyOption.Jwt)) {
      router.use(endpoint.path, policyMiddleware.jwt(jwt));
    }

    if (apiKey && policies.includes(PolicyOption.ApiKey)) {
      router.use(endpoint.path, policyMiddleware.apiKey(apiKey));
    }

    if (rateLimit && policies.includes(PolicyOption.RateLimit)) {
      if (
        rateLimit.rateLimitBy === "jwt" &&
        !policies.includes(PolicyOption.Jwt)
      ) {
        logger.warn(
          `rateLimitBy is set to jwt, but jwt policy is not enabled for endpoint ${endpoint.path}`,
        );
      }

      if (
        rateLimit.rateLimitBy === "apiKey" &&
        !policies.includes(PolicyOption.ApiKey)
      ) {
        logger.warn(
          `rateLimitBy is set to apiKey, but apiKey policy is not enabled for endpoint ${endpoint.path}`,
        );
      }

      router.use(endpoint.path, policyMiddleware.rateLimit(rateLimit));
    }
  }
};
