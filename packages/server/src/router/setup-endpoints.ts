import { Router } from "express";
import { Config } from "../config/types";
import { setupProxy } from "./setup-proxy";
import { setupPolicies } from "./setup-policies";

export const setupEndpoints = (router: Router, config: Config) => {
  const { endpoints, policyDefinitions } = config;

  endpoints.forEach((endpoint) => {
    if (policyDefinitions) {
      setupPolicies(router, endpoint, policyDefinitions);
    }
    setupProxy(router, endpoint);
  });
};
