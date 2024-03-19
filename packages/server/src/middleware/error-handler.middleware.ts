import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "express-jwt";
import { RateLimitUnauthorizedError } from "@gateweaver/policies";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
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
