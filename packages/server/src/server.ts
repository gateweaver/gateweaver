import { createServer, Server } from "http";
import express, { Express } from "express";
import chokidar from "chokidar";
import helmet from "helmet";
import fs from "fs";
import { parseConfig } from "./config/parse-config";
import { createRouter } from "./router";
import { errorHandler, httpLogger } from "./middleware";
import { logger } from "./logger";
import { handleServerError, MissingConfigError } from "./errors";

export const startServer = (
  filePath = "gateweaver.yml",
  watch = false,
): Promise<Server> => {
  if (!fs.existsSync(filePath)) {
    throw new MissingConfigError(
      `Gateweaver config file not found at path: ${filePath}`,
    );
  }

  let server: Server | null = null;

  const runServer = (app: Express, PORT: number | string): Server => {
    const newServer = createServer(app);
    newServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
    return newServer;
  };

  const setupServer = async (): Promise<Server> => {
    try {
      const PORT = process.env.PORT || 8080;
      const config = parseConfig(filePath);
      const app = express();

      app.use(helmet());
      app.use(express.json());
      app.use(httpLogger);
      const router = await createRouter(config);
      app.use(router);
      app.use(errorHandler);

      return new Promise((resolve, _) => {
        if (server) {
          server.close(() => {
            server = runServer(app, PORT);
            resolve(server);
          });
        } else {
          server = runServer(app, PORT);
          resolve(server);
        }
      });
    } catch (error) {
      logger.error("Failed to start server due to errors...");
      throw error;
    }
  };

  if (watch) {
    const watcher = chokidar.watch(filePath, { persistent: true });
    watcher.on("change", () => {
      logger.info(`Restarting server due to changes...`);
      if (server) {
        server.close(() => {
          setupServer().catch(handleServerError);
        });
      } else {
        setupServer().catch(handleServerError);
      }
    });
    logger.info(`Watching for file changes on ${filePath}`);
  }

  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: closing server");
    if (server) {
      server.close(() => {
        logger.info("Server closed");
      });
    }
  });

  const serverPromise = setupServer();
  return serverPromise;
};
