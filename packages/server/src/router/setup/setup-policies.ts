import {
  PolicyDefinitions,
  PolicyOption,
  policyMiddleware,
} from "@gateweaver/policies";
import { Router } from "express";
import { Endpoint } from "../../config/config.types";
import { logger } from "../../utils";

export const setupPolicies = (
  router: Router,
  endpoint: Endpoint,
  policyDefinitions: PolicyDefinitions,
) => {
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
          `Rate limit by jwt is enabled but jwt policy is not enabled for endpoint ${endpoint.path}`,
        );
      }

      if (
        rateLimit.rateLimitBy === "apiKey" &&
        !policies.includes(PolicyOption.ApiKey)
      ) {
        logger.warn(
          `Rate limit by apiKey is enabled but apiKey policy is not enabled for endpoint ${endpoint.path}`,
        );
      }

      router.use(endpoint.path, policyMiddleware.rateLimit(rateLimit));
    }
  }
};
