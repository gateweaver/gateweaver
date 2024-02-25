import fs from "fs";
import YAML from "yaml";
import { validateConfig } from "./validate";
import { Config } from "./types";

export const parseConfig = (filePath: string): Config => {
  const file = fs
    .readFileSync(filePath, "utf8")
    .replace(/\$\{(.+?)\}/g, (match, name) => process.env[name] || match);

  const config = YAML.parse(file);

  validateConfig(config);

  return config;
};
