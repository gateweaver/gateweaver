#! /usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { program } from "commander";
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

program.parse();
