import { Router } from "express";
import { Policies, corsMiddleware } from "@endpointly/policies";

export const addGlobalPolicies = (router: Router, policies: Policies) => {
  const { cors } = policies;

  if (cors) {
    const {
      origin,
      methods,
      allowedHeaders,
      exposedHeaders,
      credentials,
      maxAge,
      optionsSuccessStatus,
    } = cors;

    router.use(
      corsMiddleware({
        origin,
        methods,
        allowedHeaders,
        exposedHeaders,
        credentials,
        maxAge,
        optionsSuccessStatus,
      }),
    );
  }
};
