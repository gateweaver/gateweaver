import path from "path";
import { Router } from "express";
import { logger } from "../../../utils/logger";
import { bundleFile } from "../../../utils/bundle-file";
import { PathFunction } from "../../../config/config.types";

export const setupGlobalMiddleware = async (
  router: Router,
  middleware: PathFunction[],
): Promise<void> => {
  for (const middlewareConfig of middleware) {
    try {
      const middlewarePath = path.resolve(middlewareConfig.path);
      const bundledMiddlewarePath = await bundleFile(
        middlewarePath,
        ".gateweaver/middleware",
      );
      const middlewareModule = await import(bundledMiddlewarePath);
      const middlewareFunction = middlewareModule[middlewareConfig.function];

      if (typeof middlewareFunction === "function") {
        router.use(middlewareFunction);
        logger.info(
          `Applied middleware ${middlewareConfig.function} from ${middlewareConfig.path} to all endpoints`,
        );
      } else {
        logger.error(
          `Function ${middlewareConfig.function} not found in ${middlewareConfig.path}`,
        );
      }
    } catch (error) {
      logger.error(
        `Failed to load middleware from ${middlewareConfig.path}: ${error}`,
      );
    }
  }
};
