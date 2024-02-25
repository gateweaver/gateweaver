import { Router } from "express";
import {
  Policies,
  apiKeyMiddleware,
  corsMiddleware,
  jwtMiddleware,
} from "@endpointly/policies";

export const addGlobalPolicies = (router: Router, policies: Policies) => {
  const { cors, jwt, apiKey } = policies;

  if (cors) {
    router.use(corsMiddleware(cors));
  }

  if (jwt) {
    router.use(jwtMiddleware(jwt));
  }

  if (apiKey) {
    router.use(apiKeyMiddleware(apiKey));
  }
};
