import { rateLimit } from "express-rate-limit";
import { RateLimitPolicy } from "./rate-limit.schema";
import { keyGenerator } from "./key-generator";

export const rateLimitMiddleware = (policy: RateLimitPolicy) => {
  const {
    rateLimitBy,
    windowMs,
    limit,
    message,
    statusCode,
    skipFailedRequests,
    skipSuccessfulRequests,
  } = policy;

  return rateLimit({
    windowMs,
    limit,
    message,
    statusCode,
    skipFailedRequests,
    skipSuccessfulRequests,
    keyGenerator: keyGenerator(rateLimitBy),
  });
};
