#! /usr/bin/env node

import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { program } from "commander";
import { startServer } from "@gateweaver/server/start";
import { generateApiKeyAction } from "./generate-api-key";

const setupCLI = async () => {
  const packageJson = await import("../package.json", {
    assert: { type: "json" },
  });

  program
    .name("gateweaver")
    .description("A CLI tool for managing gateweaver gateways")
    .version(packageJson.default.version);

  program
    .command("generate-api-key")
    .description("Generate a new API key and hash")
    .action(generateApiKeyAction);

  program
    .command("start")
    .description("Start the gateweaver server")
    .action(() => {
      try {
        startServer();
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });

  program.parse();
};

setupCLI().catch(console.error);
