import path from "path";
import { build } from "tsup";
import { Router } from "express";
import { Endpoint } from "../../config/config.types";
import { logger } from "../../logger";

const bundleMiddleware = async (middlewarePath: string): Promise<string> => {
  const outDir = path.resolve(".gateweaver/middleware");
  const entry = path.resolve(middlewarePath);
  await build({
    entry: [entry],
    outDir,
    format: ["cjs"],
    target: "node20",
    clean: true,
    outExtension() {
      return {
        js: `.cjs`,
      };
    },
  });

  const bundlePath = path.join(
    outDir,
    path.basename(middlewarePath).replace(/\.[jt]s?$/, ".cjs"),
  );
  return bundlePath;
};

export const loadCustomMiddleware = async (
  router: Router,
  endpoint: Endpoint,
): Promise<void> => {
  if (endpoint.middleware) {
    for (const middlewareConfig of endpoint.middleware) {
      try {
        const middlewarePath = path.resolve(middlewareConfig.path);
        const bundledMiddlewarePath = await bundleMiddleware(middlewarePath);
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
