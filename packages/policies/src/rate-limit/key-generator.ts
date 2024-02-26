import { Request } from "express";
import { RateLimitPolicy } from "./schema";

const ensureString = (value: unknown, errorMessage: string) => {
  if (typeof value !== "string") {
    throw new Error(errorMessage);
  }

  return value;
};

const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    throw new Error("Invalid JWT");
  }
};

export const keyGenerator = (rateLimitBy: RateLimitPolicy["rateLimitBy"]) => {
  return (req: Request) => {
    switch (rateLimitBy) {
      case "api-key": {
        const apiKey = ensureString(
          req.headers["x-api-key"],
          "API key is not a string",
        );
        return apiKey;
      }
      case "jwt": {
        const authHeader = ensureString(
          req.headers.authorization,
          "Authorization header is not a string",
        );
        const token = authHeader.split(" ")[1];
        const decoded = decodeJwt(token);
        return decoded.sub;
      }
      case "ip": {
        const ip = ensureString(req.ip, "IP address is not a string");
        return ip;
      }
      default:
        throw new Error(`Unknown rate limit rateLimitBy: ${rateLimitBy}`);
    }
  };
};
