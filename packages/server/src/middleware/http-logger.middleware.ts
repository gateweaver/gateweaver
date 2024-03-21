import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const query = Object.keys(req.query).length ? req.query : undefined;
  const body = Object.keys(req.body).length ? req.body : undefined;

  logger.info({
    message: "Incoming request",
    method: req.method,
    path: req.path,
    query,
    body,
  });
  next();
};
