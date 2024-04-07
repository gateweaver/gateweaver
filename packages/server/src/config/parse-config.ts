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
  const extensions = [".yml", ".yaml"];

  let finalPath;

  for (const ext of extensions) {
    const pathWithExt = filePath.endsWith(ext) ? filePath : `${filePath}${ext}`;
    if (fs.existsSync(pathWithExt)) {
      finalPath = pathWithExt;
      break;
    }
  }

  if (!finalPath) {
    throw new Error(
      `Config file "${filePath}" not found with .yml or .yaml extension.`,
    );
  }

  const file = fs
    .readFileSync(finalPath, "utf8")
    .replace(/\$\{(.+?)\}/g, (_, value) => parseEnv(value));

  const config = YAML.parse(file);

  return validateConfig(config);
};
