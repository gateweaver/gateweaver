import { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiKeyPolicy } from "./api-key.schema";
import { isValidApiKey } from "./utils";

export const apiKeyMiddleware = (policy: ApiKeyPolicy): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];

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
