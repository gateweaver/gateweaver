import { Command } from "commander";
import {
  getDefaultConfigPath,
  startServer,
  handleServerError,
} from "@gateweaver/server";

export const startServerCommand = (program: Command) => {
  program
    .command("start")
    .description("Start the gateweaver server")
    .option("-c, --config <configPath>", "Path to the config file")
    .option(
      "-w, --watch",
      "Watch the config file for changes and restart the server",
    )
    .action(async (options) => {
      const { config, watch } = options;

      try {
        const filePath = config || getDefaultConfigPath();

        await startServer(filePath, watch);
      } catch (error) {
        handleServerError(error);
      }
    });
};
