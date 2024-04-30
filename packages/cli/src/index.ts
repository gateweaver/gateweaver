#! /usr/bin/env node
import { config } from "dotenv";
config({ path: ".env.gateweaver" });
import { program } from "commander";
import {
  startServerCommand,
  validateConfigCommand,
  generateApiKeyCommand,
} from "./commands";

const setupCLI = async () => {
  const packageJson = await import("../package.json", {
    assert: { type: "json" },
  });

  program
    .name("gateweaver")
    .description("A CLI tool for managing gateweaver")
    .version(packageJson.default.version);

  startServerCommand(program);

  validateConfigCommand(program);

  generateApiKeyCommand(program);

  program.parse();
};

setupCLI().catch(console.error);
