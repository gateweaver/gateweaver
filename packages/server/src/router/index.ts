import { Router } from "express";
import { Config } from "../config/config.types";
import { setupEndpoints } from "./setup/setup-endpoints";

export const createRouter = async (config: Config): Promise<Router> => {
  const router = Router();

  await setupEndpoints(router, config);

  return router;
};
