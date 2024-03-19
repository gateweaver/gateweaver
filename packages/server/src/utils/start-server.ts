import express from "express";
import helmet from "helmet";
import { parseConfig } from "../config/parse-config";
import { createRouter } from "../router";
import { errorHandler, httpLogger } from "../middleware";
import { logger } from "./logger";

export const startServer = (filePath: string = "gateweaver") => {
  const config = parseConfig(filePath);

  const PORT = process.env.PORT || 8080;

  const app = express();

  app.use(helmet());

  app.use(express.json());

  app.use(httpLogger);

  const router = createRouter(config);
  app.use(router);

  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Gateweaver is running on port ${PORT}`);
  });
};
