import { Command } from "commander";
import { parseConfig, InvalidConfigError } from "@gateweaver/server";

export const validateConfigCommand = (program: Command) => {
  program
    .command("validate")
    .description("Validate a gateweaver config file")
    .option(
      "-c, --config <configPath>",
      "Path to the config file",
      "gateweaver",
    )
    .action((options) => {
      try {
        parseConfig(options.config);
        console.log("✅ Config file is valid");
      } catch (error) {
        if (error instanceof InvalidConfigError) {
          const validationErrors = error.message.split("\n");

          console.log("❌ Config file validation errors:");
          validationErrors.forEach((error) => console.log(`- ${error}`));
        } else {
          console.log(error);
        }
      }
    });
};
