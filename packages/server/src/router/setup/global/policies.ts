import { Router } from "express";
import {
  PolicyDefinitions,
  PolicyOption,
  policyMiddleware,
} from "@gateweaver/policies";

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
    }

    if (jwt && policies.includes(PolicyOption.Jwt)) {
      router.use(policyMiddleware.jwt(jwt));
    }

    if (apiKey && policies.includes(PolicyOption.ApiKey)) {
      router.use(policyMiddleware.apiKey(apiKey));
    }

    if (rateLimit && policies.includes(PolicyOption.RateLimit)) {
      router.use(policyMiddleware.rateLimit(rateLimit));
    }
  }
};
