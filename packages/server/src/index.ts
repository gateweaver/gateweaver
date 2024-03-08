import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { errorHandler, logger } from "@endpointly/utils";
import { parseConfigYaml } from "./config/parse";
import { setupRouter } from "./router";

const app = express();

app.use(helmet());

app.use(express.json());

const startServer = () => {
  try {
    const config = parseConfigYaml("gateway");

    const PORT = config.port || process.env.PORT || 6060;

    const router = setupRouter(config);
    app.use(router);

    app.use(errorHandler);

    app.listen(PORT, () => {
      logger.info(`Endpointly server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();
