// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: ".env.gateweaver" });
import { logger } from "@gateweaver/utils";
import { startServer } from "./start-server";

try {
  startServer();
} catch (error) {
  logger.error(error);
  process.exit(1);
}
