import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import pino from "pino";

const options =
  process.env.NODE_ENV !== "production"
    ? {
        transport: {
          target: "pino-pretty",
        },
      }
    : {};

export const logger = pino(options);
