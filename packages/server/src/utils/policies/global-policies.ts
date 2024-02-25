import { Router } from "express";
import {
  Policies,
  apiKeyMiddleware,
  corsMiddleware,
  jwtMiddleware,
  rateLimitMiddleware,
} from "@endpointly/policies";

export const addGlobalPolicies = (router: Router, policies: Policies) => {
  const { cors, jwt, apiKey, rateLimit } = policies;

  if (cors) {
    router.use(corsMiddleware(cors));
  }

  if (jwt) {
    router.use(jwtMiddleware(jwt));
  }

  if (apiKey) {
    router.use(apiKeyMiddleware(apiKey));
  }

  if (rateLimit) {
    router.use(rateLimitMiddleware(rateLimit));
  }
};
