// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: ".env.endpointly" });
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
