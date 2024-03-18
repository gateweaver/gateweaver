#! /usr/bin/env node
import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { program } from "commander";
import {
  startServer,
  parseConfig,
  InvalidConfigError,
} from "@gateweaver/server/utils";
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
    .argument("[configPath]", "Path to the config file", "gateweaver")
    .action((configPath) => {
      try {
        startServer(configPath);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });

  program
    .command("validate")
    .description("Validate a gateweaver config file")
    .argument("[configPath]", "Path to the config file", "gateweaver")
    .action((configPath) => {
      try {
        parseConfig(configPath);
        console.log("✅ Config file is valid");
      } catch (error) {
        if (error instanceof InvalidConfigError) {
          const validationErrors = error.message.split("\n");

          console.error("❌ Config file validation errors:");
          validationErrors.map((error) => console.error(`- ${error}`));
        } else {
          console.error((error as Error).message);
        }
      }
    });

  program.parse();
};

setupCLI().catch(console.error);
