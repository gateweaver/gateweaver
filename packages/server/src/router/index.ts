import fs from "fs";
import { Router } from "express";
import { Config } from "../config/config.types";
import { setupGlobalConfig } from "./setup/global";
import { setupEndpoints } from "./setup/endpoints";

const removeBuildFolder = (): void => {
  fs.rmSync(".gateweaver", { recursive: true, force: true });
};

export const createRouter = async (config: Config): Promise<Router> => {
  removeBuildFolder();

  const router = Router();

  await setupGlobalConfig(router, config);

  await setupEndpoints(router, config);

  return router;
};
