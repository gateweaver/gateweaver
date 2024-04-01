import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "express-jwt";
import { RateLimitUnauthorizedError } from "@gateweaver/policies";
import { logger } from "../logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err);

  if (err instanceof UnauthorizedError) {
    res.status(401).send({
      error: "Invalid Authorization Token",
    });
    return;
  }

  if (err instanceof RateLimitUnauthorizedError) {
    res.status(401).send({
      error: err.message,
    });
    return;
  }

  return res.status(500).send({
    error: "Internal Server Error",
  });
};
