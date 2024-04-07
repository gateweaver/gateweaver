import { createServer, Server } from "http";
import express, { Express } from "express";
import chokidar from "chokidar";
import helmet from "helmet";
import { parseConfig } from "./config/parse-config";
import { InvalidConfigError } from "./config/validate-config";
import { createRouter } from "./router";
import { errorHandler, httpLogger } from "./middleware";
import { logger } from "./logger";

export const startServer = (
  filePath = "gateweaver",
  watch = false,
): Promise<Server> => {
  let server: Server | null = null;

  const runServer = (app: Express, PORT: number | string): Server => {
    const newServer = createServer(app);
    newServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
    return newServer;
  };

  const setupServer = (): Promise<Server> => {
    return new Promise((resolve, reject) => {
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
            resolve(server);
          });
        } else {
          server = runServer(app, PORT);
          resolve(server);
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

        reject(error);
      }
    });
  };

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

  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: closing server");
    if (server) {
      server.close(() => {
        logger.info("Server closed!");
      });
    }
  });

  // The server promise is returned so that the server can be closed in tests
  const serverPromise = setupServer();
  return serverPromise;
};
