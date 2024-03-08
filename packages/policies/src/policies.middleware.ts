import { NextFunction, Request, Response } from "express";
import { CorsPolicy, corsMiddleware } from "./cors";
import { JwtPolicy, jwtMiddleware } from "./jwt";
import { ApiKeyPolicy, apiKeyMiddleware } from "./api-key";
import { RateLimitPolicy, rateLimitMiddleware } from "./rate-limit";

type MiddlewareFunction<T> = (
  policy: T,
) => (req: Request, res: Response, next: NextFunction) => void;

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
