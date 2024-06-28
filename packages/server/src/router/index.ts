import fs from "fs";
import { Router } from "express";
import { Config } from "../config/config.types";
import { setupGlobalConfig } from "./setup/global";
import { setupEndpoints } from "./setup/endpoints";
import { logger } from "../utils/logger";

const removeBuildFolder = (): void => {
  fs.rmSync(".gateweaver", { recursive: true, force: true });
};

export const createRouter = async (config: Config): Promise<Router> => {
  removeBuildFolder();

  const router = Router();

  logger.info("Creating endpoints...");

  await setupGlobalConfig(router, config);

  await setupEndpoints(router, config);

  return router;
};
