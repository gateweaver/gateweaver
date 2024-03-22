import { Router } from "express";
import { Config } from "../config/config.types";
import { setupEndpoints } from "./setup/setup-endpoints";

export const createRouter = (config: Config): Router => {
  const router = Router();

  setupEndpoints(router, config);

  return router;
};
