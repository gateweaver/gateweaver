import fs from "fs";
import { MissingConfigError } from "../utils/errors";

export const getDefaultConfigPath = (): string => {
  const defaultPathOptions = ["./gateweaver.yml", "./gateweaver.yaml"];

  const defaultPath = defaultPathOptions.find(fs.existsSync);

  if (!defaultPath) {
    throw new MissingConfigError(
      "Gateweaver config file not found in current directory",
    );
  }

  return defaultPath;
};
