import { Router } from "express";
import { Config } from "../config/config.types";
import { setupEndpoints } from "./setup/setup-endpoints";

export const createRouter = (config: Config): Router => {
  const router = Router();

  if (process.env.NODE_ENV === "development") {
    router.get("/config", (_, res) => {
      res.send(config);
    });
  }

  setupEndpoints(router, config);

  return router;
};
