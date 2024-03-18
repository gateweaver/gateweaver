import crypto from "crypto";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiKeyPolicy } from "./api-key.schema";

export const hashApiKey = (apiKey: string): string => {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
};

export const isValidApiKey = (
  apiKey: string | string[],
  apiKeyHashes: string[],
) => {
  if (typeof apiKey !== "string") return false;

  const apiKeyHash = hashApiKey(apiKey);
  return apiKeyHashes.includes(apiKeyHash);
};

export const apiKeyMiddleware = (policy: ApiKeyPolicy): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      res.status(401).send({
        error: "API Key Required",
      });
      return;
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
