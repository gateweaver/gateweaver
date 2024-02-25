import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ApiKeyPolicy } from "./schema";

const isValidApiKey = (apiKey: string, hashes: string[]) => {
  try {
    const apiKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
    return hashes.includes(apiKeyHash);
  } catch (error) {
    console.error("Error validating API key", error);
    return false;
  }
};

export const apiKeyMiddleware = (policy: ApiKeyPolicy) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"] as string | undefined;

    if (!apiKey) {
      res.status(401).send({
        error: "API Key Required",
      });
      return;
    }

    if (!isValidApiKey(apiKey, policy.hashes)) {
      res.status(401).send({
        error: "Invalid API Key",
      });
      return;
    }

    next();
  };
};
