import { Request, Response, NextFunction } from "express";
import { logger } from "../utils";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
};
