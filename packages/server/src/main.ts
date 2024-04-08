import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { getConfigPath } from "./config/get-config-path";
import { logger, startServer } from ".";

try {
  const filePath = getConfigPath();

  if (!filePath) {
    throw new Error("Gateweaver config file not found.");
  }

  startServer(filePath);
} catch (error) {
  logger.error(error);
}
