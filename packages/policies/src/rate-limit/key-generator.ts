import { Request } from "express";
import { RateLimitPolicy } from "./schema";
import { UnauthorizedAccessError } from "@endpointly/utils";

const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    throw new UnauthorizedAccessError("Invalid Token");
  }
};

export const keyGenerator = (rateLimitBy: RateLimitPolicy["rateLimitBy"]) => {
  return (req: Request) => {
    switch (rateLimitBy) {
      case "apiKey": {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
          throw new UnauthorizedAccessError("API Key Required");
        }

        return apiKey;
      }
      case "jwt": {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          throw new UnauthorizedAccessError("No authorization token was found");
        }

        const token = authHeader.split(" ")[1];
        const decoded = decodeJwt(token);
        return decoded.sub;
      }
      case "ip": {
        const ip = req.ip;

        if (!ip) {
          throw new Error("IP address is missing");
        }

        return ip;
      }
      default:
        throw new Error(`Invalid rateLimitBy: ${rateLimitBy}`);
    }
  };
};
