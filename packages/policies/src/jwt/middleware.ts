import { expressjwt, GetVerificationKey } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";
import { JwtPolicy } from "./schema";

export const jwtMiddleware = (policy: JwtPolicy) => {
  const { secretOrPublicKey, jwksUri, audience, issuer, algorithms } = policy;

  if (!jwksUri && !secretOrPublicKey) {
    throw new Error('Either "jwksUri" or "secretOrPublicKey" must be provided');
  }

  const secret =
    secretOrPublicKey ||
    (expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: jwksUri!,
    }) as GetVerificationKey);

  return expressjwt({
    secret,
    audience,
    issuer,
    algorithms,
  });
};
