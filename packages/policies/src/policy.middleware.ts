import { RequestHandler } from "express";
import { CorsPolicy, corsMiddleware } from "./cors";
import { JwtPolicy, jwtMiddleware } from "./jwt";
import { ApiKeyPolicy, apiKeyMiddleware } from "./api-key";
import { RateLimitPolicy, rateLimitMiddleware } from "./rate-limit";

export type MiddlewareFunction<T> = (policy: T) => RequestHandler;

export interface PolicyMiddleware {
  cors: MiddlewareFunction<CorsPolicy>;
  jwt: MiddlewareFunction<JwtPolicy>;
  apiKey: MiddlewareFunction<ApiKeyPolicy>;
  rateLimit: MiddlewareFunction<RateLimitPolicy>;
}

export const policyMiddleware: PolicyMiddleware = {
  cors: corsMiddleware,
  jwt: jwtMiddleware,
  apiKey: apiKeyMiddleware,
  rateLimit: rateLimitMiddleware,
};
