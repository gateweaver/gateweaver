import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const { statusCode } = res;
    const duration = Date.now() - start;

    logger.info(`${method} ${originalUrl} ${statusCode} ${duration}ms`);
  });
  next();
};
