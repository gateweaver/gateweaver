import { Router } from "express";
import { Policies, corsMiddleware, jwtMiddleware } from "@endpointly/policies";

export const addGlobalPolicies = (router: Router, policies: Policies) => {
  const { cors, jwt } = policies;

  if (cors) {
    router.use(corsMiddleware(cors));
  }

  if (jwt) {
    const { secretOrPublicKey, audience, issuer, algorithms } = jwt;

    if (secretOrPublicKey) {
      router.use(
        jwtMiddleware({
          secret: secretOrPublicKey,
          audience,
          issuer,
          algorithms,
        }),
      );
    }
  }
};
