import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // express-jwt middleware error
  if (err.name === "UnauthorizedError") {
    res.status(401).send({
      error: "Invalid Token",
    });
    return;
  }

  // custom unauthorized access error
  if (err.name === "UnauthorizedAccessError") {
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
