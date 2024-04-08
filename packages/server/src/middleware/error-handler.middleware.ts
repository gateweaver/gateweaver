import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "express-jwt";
import { RateLimitPolicyError } from "@gateweaver/policies";
import { logger } from "../logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof UnauthorizedError) {
    logger.error(err.message);
    res.status(401).send({
      error: "Invalid Authorization Token",
    });
    return;
  }

  if (err instanceof RateLimitPolicyError) {
    res.status(401).send({
      error: err.message,
    });
    return;
  }

  logger.error(err);

  return res.status(500).send({
    error: "Internal Server Error",
  });
};
