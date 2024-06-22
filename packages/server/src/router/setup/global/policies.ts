import { Router } from "express";
import {
  PolicyDefinitions,
  PolicyOption,
  policyMiddleware,
} from "@gateweaver/policies";
import { logger } from "../../../utils/logger";

interface SetupGlobalPoliciesParams {
  router: Router;
  policyDefinitions: PolicyDefinitions;
  policies: PolicyOption[];
}

export const setupGlobalPolicies = ({
  router,
  policyDefinitions,
  policies,
}: SetupGlobalPoliciesParams): void => {
  if (policyDefinitions && policies) {
    const { cors, jwt, apiKey, rateLimit } = policyDefinitions;

    if (cors && policies.includes(PolicyOption.Cors)) {
      router.use(policyMiddleware.cors(cors));
      logger.info(`Applied CORS policy to all endpoints`);
    }

    if (jwt && policies.includes(PolicyOption.Jwt)) {
      router.use(policyMiddleware.jwt(jwt));
      logger.info(`Applied JWT policy to all endpoints`);
    }

    if (apiKey && policies.includes(PolicyOption.ApiKey)) {
      router.use(policyMiddleware.apiKey(apiKey));
      logger.info(`Applied API key policy to all endpoints`);
    }

    if (rateLimit && policies.includes(PolicyOption.RateLimit)) {
      router.use(policyMiddleware.rateLimit(rateLimit));
      logger.info(`Applied rate limit policy to all endpoints`);
    }
  }
};
