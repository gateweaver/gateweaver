import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { getDefaultConfigPath } from "./config/get-default-config-path";
import { startServer } from "./server";
import { logger } from "./logger";

try {
  const filePath = getDefaultConfigPath();

  startServer(filePath);
} catch (error) {
  logger.error(error);
}
