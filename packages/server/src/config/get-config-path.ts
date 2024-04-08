import fs from "fs";

export const getConfigPath = (filePath?: string): string => {
  if (!filePath) {
    const defaultPathOptions = ["./gateweaver.yml", "./gateweaver.yaml"];

    const defaultPath = defaultPathOptions.find(fs.existsSync);

    if (!defaultPath) {
      throw new Error("Gateweaver config file not found in current directory");
    }

    return defaultPath;
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Gateweaver config file not found at path: ${filePath}`);
  }

  return filePath;
};
