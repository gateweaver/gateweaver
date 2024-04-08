import { logger } from "./logger";

export class InvalidConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidConfigError";
  }
}

export class MissingConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingConfigError";
  }
}

export const handleServerError = (error: unknown) => {
  if (error instanceof InvalidConfigError) {
    logger.error({
      message: "Invalid config file",
      errors: error.message.split("\n"),
    });
    return;
  }

  if (error instanceof MissingConfigError) {
    logger.error(error.message);
    return;
  }

  logger.error(error);
};
