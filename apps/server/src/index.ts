import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { errorHandler, logger } from "@endpointly/utils";
import { parseConfigYaml } from "./config/parse-config";
import { createRouter } from "./router";

const app = express();

app.use(helmet());

app.use(express.json());

const startServer = () => {
  const config = parseConfigYaml("gateway");

  const PORT = config.port || process.env.PORT || 8080;

  const router = createRouter(config);
  app.use(router);

  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Endpointly server is running on port ${PORT}`);
  });
};

try {
  startServer();
} catch (error) {
  logger.error(error);
  process.exit(1);
}
