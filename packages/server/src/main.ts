import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { getConfigDefaultPath } from "./config/get-config-default-path";
import { startServer } from "./server";
import { logger } from "./logger";

try {
  const filePath = getConfigDefaultPath();

  startServer(filePath);
} catch (error) {
  logger.error(error);
}
