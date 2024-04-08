import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { getConfigPath } from "./config/get-config-path";
import { startServer } from "./server";
import { logger } from "./logger";

try {
  const filePath = getConfigPath();

  startServer(filePath);
} catch (error) {
  logger.error(error);
}
