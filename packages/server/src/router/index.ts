import { Router } from "express";
import { Config } from "../config/types";
import { setupEndpoints } from "./setup-endpoints";

export const setupRouter = (config: Config) => {
  const router = Router();

  if (process.env.NODE_ENV === "development") {
    router.get("/config", (_, res) => {
      res.send(config);
    });
  }

  setupEndpoints(router, config);

  return router;
};
