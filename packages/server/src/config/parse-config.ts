import fs from "fs";
import YAML from "yaml";
import { InvalidConfigError, validateConfig } from "./validate-config";
import { Config } from "./config.types";

export const parseEnv = (value: string): string => {
  if (!process.env[value]) {
    throw new InvalidConfigError(`Environment variable "${value}" not found.`);
  }

  return process.env[value]!;
};

export const parseConfig = (filePath: string): Config => {
  const file = fs
    .readFileSync(filePath, "utf8")
    .replace(/\$\{(.+?)\}/g, (_, value) => parseEnv(value));

  const config = YAML.parse(file);

  return validateConfig(config);
};
