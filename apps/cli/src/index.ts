#! /usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: ".env.gateway" });
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { program } from "commander";
import { startServer } from "@endpointly/server";
import { logger } from "@endpointly/utils";
import { generateApiKeyAction } from "./generate-api-key";

const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf8"),
);

program
  .name("endpointly")
  .description("A CLI tool for managing endpointly gateways")
  .version(packageJson.version);

program
  .command("generate-api-key")
  .description("Generate a new API key and hash")
  .action(generateApiKeyAction);

program
  .command("start")
  .description("Start the endpointly server")
  .action(() => {
    try {
      startServer();
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  });

program.parse();
