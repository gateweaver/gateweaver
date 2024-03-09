// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: ".env.gateway" });
import { logger } from "@endpointly/utils";
import { startServer } from "./start-server";

try {
  startServer();
} catch (error) {
  logger.error(error);
  process.exit(1);
}
