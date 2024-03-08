import { Request } from "express";
import { UnauthorizedAccessError } from "@endpointly/utils";
import { RateLimitBy } from "./schema";

const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    throw new UnauthorizedAccessError("Invalid Token");
  }
};

export const keyGenerator = (option: RateLimitBy) => {
  return (req: Request) => {
    switch (option) {
      case RateLimitBy.API_KEY: {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
          throw new UnauthorizedAccessError("API Key Required");
        }

        return apiKey;
      }
      case RateLimitBy.JWT: {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          throw new UnauthorizedAccessError("No authorization token was found");
        }

        const token = authHeader.split(" ")[1];
        const decoded = decodeJwt(token);
        return decoded.sub;
      }
      case RateLimitBy.IP: {
        const ip = req.ip;

        if (!ip) {
          throw new Error("IP address is missing");
        }

        return ip;
      }
      default:
        throw new Error(`Invalid rateLimitBy: ${option}`);
    }
  };
};
