import fs from "fs";

export const getDefaultConfigPath = (): string => {
  const defaultPathOptions = ["./gateweaver.yml", "./gateweaver.yaml"];

  const defaultPath = defaultPathOptions.find(fs.existsSync);

  if (!defaultPath) {
    throw new Error("Gateweaver config file not found in current directory");
  }

  return defaultPath;
};
