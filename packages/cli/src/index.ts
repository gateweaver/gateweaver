#! /usr/bin/env node
import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { program } from "commander";
import { startAction, validateAction, generateApiKeyAction } from "./actions";

const setupCLI = async () => {
  const packageJson = await import("../package.json", {
    assert: { type: "json" },
  });

  program
    .name("gateweaver")
    .description("A CLI tool for managing gateweaver gateways")
    .version(packageJson.default.version);

  program
    .command("start")
    .description("Start the gateweaver server")
    .argument("[configPath]", "Path to the config file", "gateweaver")
    .action(startAction);

  program
    .command("validate")
    .description("Validate a gateweaver config file")
    .argument("[configPath]", "Path to the config file", "gateweaver")
    .action(validateAction);

  program
    .command("generate-api-key")
    .description("Generate a new API key and hash")
    .action(generateApiKeyAction);

  program.parse();
};

setupCLI().catch(console.error);
