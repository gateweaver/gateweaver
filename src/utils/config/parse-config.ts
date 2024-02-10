import fs from "fs";
import YAML from "yaml";
import { Config } from "../../types/config";
import { validateConfig } from "./validate-config";

export const parseConfig = (filePath: string): Config => {
  const file = fs.readFileSync(filePath, "utf8");
  const config = YAML.parse(file);

  const valid = validateConfig(config);

  if (!valid) {
    throw new Error(
      `Invalid config: ${JSON.stringify(validateConfig.errors, null, 2)}`,
    );
  }

  const endpointNames = new Set<string>();
  config.endpoints.forEach((endpoint) => {
    if (endpointNames.has(endpoint.name)) {
      throw new Error(
        `Invalid config: Duplicate endpoint name "${endpoint.name}"`,
      );
    }
    endpointNames.add(endpoint.name);
  });

  return config;
};
