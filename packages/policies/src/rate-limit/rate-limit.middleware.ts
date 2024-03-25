import { RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import { RateLimitPolicy } from "./rate-limit.schema";
import { keyGenerator } from "./key-generator";

export const rateLimitMiddleware = (
  policy: RateLimitPolicy,
): RequestHandler => {
  const {
    rateLimitBy,
    windowMs,
    limit,
    message,
    statusCode,
    legacyHeaders,
    standardHeaders,
    skipFailedRequests,
    skipSuccessfulRequests,
  } = policy;

  return rateLimit({
    windowMs,
    limit,
    message,
    statusCode,
    legacyHeaders,
    standardHeaders,
    skipFailedRequests,
    skipSuccessfulRequests,
    keyGenerator: keyGenerator(rateLimitBy),
  });
};
