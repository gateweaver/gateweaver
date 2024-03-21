import { Command } from "commander";
import { startServer } from "@gateweaver/server";

export const startServerCommand = (program: Command) => {
  program
    .command("start")
    .description("Start the gateweaver server")
    .option(
      "-c, --config <configPath>",
      "Path to the config file",
      "gateweaver",
    )
    .option(
      "-w, --watch",
      "Watch the config file for changes and restart the server",
    )
    .action((options) => {
      try {
        startServer(options.config, options.watch);
      } catch (error) {
        console.error(error);
      }
    });
};
