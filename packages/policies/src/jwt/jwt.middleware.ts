import { RequestHandler } from "express";
import { expressjwt, GetVerificationKey } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";
import { JwtPolicy } from "./jwt.schema";

export const jwtMiddleware = (policy: JwtPolicy): RequestHandler => {
  const { secret, jwksUri, audience, issuer, algorithms } = policy;

  if (!jwksUri && !secret) {
    throw new Error('Either "jwksUri" or "secret" must be provided');
  }

  return expressjwt({
    secret:
      secret ||
      (expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwksUri!,
      }) as GetVerificationKey),
    audience,
    issuer,
    algorithms,
  });
};
