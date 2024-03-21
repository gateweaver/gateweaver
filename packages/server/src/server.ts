import { createServer, Server } from "http";
import express, { Express } from "express";
import chokidar from "chokidar";
import helmet from "helmet";
import { parseConfig } from "./config/parse-config";
import { InvalidConfigError } from "./config/validate-config";
import { createRouter } from "./router";
import { errorHandler, httpLogger } from "./middleware";
import { logger } from "./logger";

export const startServer = (filePath = "gateweaver", watch = false) => {
  let server: Server | null = null;

  const runServer = (app: Express, PORT: number | string) => {
    const newServer = createServer(app);
    newServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
    return newServer;
  };

  const setupServer = () => {
    try {
      const PORT = process.env.PORT || 8080;
      const config = parseConfig(filePath);
      const app = express();

      app.use(helmet());
      app.use(express.json());
      app.use(httpLogger);
      app.use(createRouter(config));
      app.use(errorHandler);

      if (server) {
        server.close(() => {
          server = runServer(app, PORT);
        });
      } else {
        server = runServer(app, PORT);
      }
    } catch (error) {
      logger.error("Failed to start server due to errors...");

      if (error instanceof InvalidConfigError) {
        const validationErrors = error.message.split("\n");
        logger.error({
          message: "Invalid config file",
          errors: validationErrors,
        });
      } else {
        logger.error(error);
      }
    }
  };

  setupServer();

  if (watch) {
    const watcher = chokidar.watch(filePath, { persistent: true });
    watcher.on("change", () => {
      logger.info(`Restarting server due to changes...`);
      if (server) {
        server.close(() => {
          setupServer();
        });
      } else {
        setupServer();
      }
    });
    logger.info(`Watching for file changes on ${filePath}`);
  }
};
