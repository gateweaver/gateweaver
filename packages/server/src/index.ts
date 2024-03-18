import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { startServer, logger, InvalidConfigError } from "./utils";

try {
  startServer();
} catch (error) {
  if (error instanceof InvalidConfigError) {
    const validationErrors = error.message.split("\n");

    logger.error("Invalid config file");
    logger.error(validationErrors);
  } else {
    logger.error(error);
  }
}
