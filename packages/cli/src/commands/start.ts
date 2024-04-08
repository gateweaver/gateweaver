import { Command } from "commander";
import { getConfigDefaultPath, startServer } from "@gateweaver/server";

export const startServerCommand = (program: Command) => {
  program
    .command("start")
    .description("Start the gateweaver server")
    .option("-c, --config <configPath>", "Path to the config file")
    .option(
      "-w, --watch",
      "Watch the config file for changes and restart the server",
    )
    .action((options) => {
      const { config, watch } = options;

      try {
        const filePath = config || getConfigDefaultPath();

        startServer(filePath, watch);
      } catch (error) {
        console.error(error);
      }
    });
};
