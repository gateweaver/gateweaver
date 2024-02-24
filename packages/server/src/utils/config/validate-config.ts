import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Endpoint } from "../../types/endpoints";
import { Config } from "../../types/config";
import { configSchema } from "./config-schema";

const validateEndpointUniqueness = (endpoints: Endpoint[]): string[] => {
  const endpointNames = new Set<string>();
  const endpointPaths = new Set<string>();
  const errors: string[] = [];

  endpoints.forEach((endpoint) => {
    const nameKey = endpoint.name;
    const pathKey = `${endpoint.method} ${endpoint.path}`;

    if (endpointNames.has(nameKey)) {
      errors.push(`Config Error: Duplicate endpoint name "${nameKey}"`);
    } else {
      endpointNames.add(nameKey);
    }

    if (endpointPaths.has(pathKey)) {
      errors.push(`Config Error: Duplicate endpoint path "${pathKey}"`);
    } else {
      endpointPaths.add(pathKey);
    }
  });

  return errors;
};

const validateDestinationUrl = (url: string): string | null => {
  try {
    new URL(url);
    return null;
  } catch (error) {
    return `Config Error: Invalid URL "${url}"`;
  }
};

export const validateConfig = (config: Config) => {
  const ajv = new Ajv({ useDefaults: true });
  addFormats(ajv, ["uri", "url"]);

  const validate = ajv.compile(configSchema);
  const validationErrors: string[] = [];

  if (!validate(config)) {
    validationErrors.push(JSON.stringify(validate.errors, null, 2));
  }

  const { endpoints } = config;

  const uniquenessErrors = validateEndpointUniqueness(endpoints);
  if (uniquenessErrors.length > 0) {
    validationErrors.push(...uniquenessErrors);
  }

  endpoints.forEach((endpoint) => {
    const destinationUrlError = validateDestinationUrl(
      endpoint.destination.url,
    );
    if (destinationUrlError) {
      validationErrors.push(destinationUrlError);
    }
  });

  if (validationErrors.length > 0) {
    throw new Error(`Invalid config: \n${validationErrors.join("\n")}`);
  }
};
