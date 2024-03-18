import { Request, Response, NextFunction } from "express";
import { logger } from "../utils";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.originalUrl} - ${res.statusCode}`);
  next();
};
