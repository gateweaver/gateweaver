import express from "express";
import helmet from "helmet";
import { errorHandler, logger } from "@endpointly/utils";
import { parseConfigYaml } from "./config/parse-config";
import { createRouter } from "./router";

export const startServer = () => {
  const config = parseConfigYaml("gateway");

  const PORT = config.port || process.env.PORT || 8080;

  const app = express();

  app.use(helmet());

  app.use(express.json());

  const router = createRouter(config);
  app.use(router);

  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Endpointly server is running on port ${PORT}`);
  });
};
