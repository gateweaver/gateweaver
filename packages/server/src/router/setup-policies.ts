import {
  PolicyDefinitions,
  PolicyOption,
  policyMiddleware,
  PolicyMiddleware,
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

    Object.entries(policyDefinitions).forEach(([policyKey, policyValue]) => {
      if (policies.includes(policyKey as PolicyOption)) {
        const middleware =
          policyMiddleware[policyKey as keyof PolicyMiddleware];
        if (middleware) {
          router.use(endpoint.path, middleware(policyValue));
        }
      }
    });
  }
};
