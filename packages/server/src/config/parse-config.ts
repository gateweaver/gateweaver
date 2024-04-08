import fs from "fs";
import YAML from "yaml";
import { InvalidConfigError, MissingConfigError } from "../errors";
import { validateConfig } from "./validate-config";
import { Config } from "./config.types";

export const parseEnv = (value: string): string => {
  if (!process.env[value]) {
    throw new InvalidConfigError(`Environment variable "${value}" not found.`);
  }

  return process.env[value]!;
};

export const parseConfig = (filePath: string): Config => {
  if (!fs.existsSync(filePath)) {
    throw new MissingConfigError(
      `Gateweaver config file not found at path: ${filePath}`,
    );
  }

  const file = fs
    .readFileSync(filePath, "utf8")
    .replace(/\$\{(.+?)\}/g, (_, value) => parseEnv(value));

  const config = YAML.parse(file);

  return validateConfig(config);
};
