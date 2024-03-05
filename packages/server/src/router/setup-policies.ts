import {
  PolicyDefinitions,
  PolicyOption,
  policyMiddleware,
} from "@endpointly/policies";
import { Router } from "express";
import { Endpoint } from "../config/types";

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
      router.use(endpoint.path, policyMiddleware.rateLimit(rateLimit));
    }
  }
};
