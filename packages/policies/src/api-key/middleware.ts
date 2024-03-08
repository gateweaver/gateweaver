import { Request, Response, NextFunction } from "express";
import { hashApiKey } from "@endpointly/utils";
import { ApiKeyPolicy } from "./schema";

export const isValidApiKey = (apiKey: string, apiKeyHashes: string[]) => {
  const apiKeyHash = hashApiKey(apiKey);
  return apiKeyHashes.includes(apiKeyHash);
};

export const apiKeyMiddleware = (policy: ApiKeyPolicy) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      res.status(401).send({
        error: "API Key Required",
      });
      return;
    }

    if (typeof apiKey !== "string") {
      throw new Error("API key is not a string");
    }

    if (!isValidApiKey(apiKey, policy.apiKeyHashes)) {
      res.status(401).send({
        error: "Invalid API Key",
      });
      return;
    }

    next();
  };
};
