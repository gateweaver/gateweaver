import { Router } from "express";
import {
  PolicyDefinitions,
  PolicyOption,
  policyMiddleware,
} from "@gateweaver/policies";
import { Endpoint } from "../../../config/config.types";
import { logger } from "../../../utils/logger";

interface SetupEndpointPoliciesParams {
  router: Router;
  endpoint: Endpoint;
  policyDefinitions: PolicyDefinitions;
}

export const setupEndpointPolicies = ({
  router,
  endpoint,
  policyDefinitions,
}: SetupEndpointPoliciesParams): void => {
  if (policyDefinitions && endpoint.policies) {
    const { policies } = endpoint;

    const { cors, jwt, apiKey, rateLimit } = policyDefinitions;

    if (cors && policies.includes(PolicyOption.Cors)) {
      router.use(endpoint.path, policyMiddleware.cors(cors));
      logger.info(`Applied CORS policy to endpoint ${endpoint.path}`);
    }

    if (jwt && policies.includes(PolicyOption.Jwt)) {
      router.use(endpoint.path, policyMiddleware.jwt(jwt));
      logger.info(`Applied JWT policy to endpoint ${endpoint.path}`);
    }

    if (apiKey && policies.includes(PolicyOption.ApiKey)) {
      router.use(endpoint.path, policyMiddleware.apiKey(apiKey));
      logger.info(`Applied API key policy to endpoint ${endpoint.path}`);
    }

    if (rateLimit && policies.includes(PolicyOption.RateLimit)) {
      router.use(endpoint.path, policyMiddleware.rateLimit(rateLimit));
      logger.info(`Applied rate limit policy to endpoint ${endpoint.path}`);
    }
  }
};
