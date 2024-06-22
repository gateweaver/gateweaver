import path from "path";
import { Router } from "express";
import { Endpoint } from "../../../config/config.types";
import { logger } from "../../../utils/logger";
import { bundleFile } from "../../../utils/bundle-file";

export const setupEndpointMiddleware = async (
  router: Router,
  endpoint: Endpoint,
): Promise<void> => {
  if (endpoint.middleware) {
    for (const middlewareConfig of endpoint.middleware) {
      try {
        const middlewarePath = path.resolve(middlewareConfig.path);
        const bundledMiddlewarePath = await bundleFile(
          middlewarePath,
          ".gateweaver/middleware",
        );
        const middlewareModule = await import(bundledMiddlewarePath);
        const middlewareFunction = middlewareModule[middlewareConfig.function];

        if (typeof middlewareFunction === "function") {
          router.use(endpoint.path, middlewareFunction);
          logger.info(
            `Applied custom middleware ${middlewareConfig.function} from ${middlewareConfig.path} to ${endpoint.path}`,
          );
        } else {
          logger.error(
            `Function ${middlewareConfig.function} not found in ${middlewareConfig.path}`,
          );
        }
      } catch (error) {
        logger.error(
          `Failed to load custom middleware from ${middlewareConfig.path}: ${error}`,
        );
      }
    }
  }
};
