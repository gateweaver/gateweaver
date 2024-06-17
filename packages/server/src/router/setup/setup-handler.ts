import path from "path";
import { Router } from "express";
import { logger } from "../../logger";
import { bundleFile } from "./bundle-file";
import { PathFunction } from "../../config/config.types";

export const setupHandler = async (
  router: Router,
  endpointPath: string,
  handlerConfig: PathFunction,
): Promise<void> => {
  try {
    const handlerPath = path.resolve(handlerConfig.path);
    const bundledHandlerPath = await bundleFile(
      handlerPath,
      ".gateweaver/handlers",
    );
    const handlerModule = await import(bundledHandlerPath);
    const handlerFunction = handlerModule[handlerConfig.function];

    if (typeof handlerFunction === "function") {
      router.use(endpointPath, handlerFunction);
      logger.info(
        `Applied custom handler ${handlerConfig.function} from ${handlerConfig.path} to ${endpointPath}`,
      );
    } else {
      logger.error(
        `Function ${handlerConfig.function} not found in ${handlerConfig.path}`,
      );
    }
  } catch (error) {
    logger.error(
      `Failed to load custom handler from ${handlerConfig.path}: ${error}`,
    );
  }
};
