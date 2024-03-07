import "dotenv/config";
import express from "express";
import { parseConfigYaml } from "./config/parse";
import { setupRouter } from "./router";
import { errorHandler } from "@endpointly/utils";

const app = express();

app.use(express.json());

const loadConfiguration = async () => {
  try {
    const config = parseConfigYaml("gateway");
    return config;
  } catch (error) {
    console.error(`Failed to load configuration:\n${error}`);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    const config = await loadConfiguration();

    const PORT = config.port || process.env.PORT || 6060;

    const router = setupRouter(config);
    app.use(router);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Endpointly server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server:\n${error}`);
    process.exit(1);
  }
};

startServer();
