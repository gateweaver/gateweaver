import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ApiKeyPolicy } from "./schema";

export const apiKeyMiddleware = (policy: ApiKeyPolicy) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      res.status(401).send({
        error: "API Key Required",
      });
      return;
    }

    const apiKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

    if (!policy.hashes.includes(apiKeyHash)) {
      res.status(403).send({
        error: "Invalid API Key",
      });
      return;
    }

    next();
  };
};
