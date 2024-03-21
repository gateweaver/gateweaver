import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { logger, startServer } from ".";

try {
  startServer();
} catch (error) {
  logger.error(error);
}
