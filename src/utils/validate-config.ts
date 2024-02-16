import Ajv, { JSONSchemaType } from "ajv";
import { Destination, Endpoint, KeyValue } from "../types/endpoints";
import { Config } from "../types/config";

const ajv = new Ajv();

const keyValueSchema: JSONSchemaType<KeyValue> = {
  type: "object",
  properties: {
    key: { type: "string" },
    value: { type: "string" },
  },
  required: ["key", "value"],
};

const destinationSchema: JSONSchemaType<Destination> = {
  type: "object",
  properties: {
    url: { type: "string" },
    headers: { type: "array", items: keyValueSchema, nullable: true },
    params: { type: "array", items: keyValueSchema, nullable: true },
  },
  required: ["url"],
};

const endpointSchema: JSONSchemaType<Endpoint> = {
  type: "object",
  properties: {
    name: { type: "string" },
    path: { type: "string" },
    method: { type: "string", enum: ["GET", "POST", "PUT", "DELETE"] },
    destination: destinationSchema,
  },
  required: ["name", "path", "method", "destination"],
};

const configSchema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    endpoints: {
      type: "array",
      items: endpointSchema,
    },
  },
  required: ["endpoints"],
};

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

const validateDestinationUrl = (url: string) => {
  try {
    new URL(url);
  } catch (error) {
    throw new Error(`Config Error: Invalid destination URL "${url}"`);
  }
};

export const validateConfig = (config: Config) => {
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
    try {
      validateDestinationUrl(endpoint.destination.url);
    } catch (error) {
      validationErrors.push((error as Error).message);
    }
  });

  if (validationErrors.length > 0) {
    throw new Error(`Invalid config: \n${validationErrors.join("\n")}`);
  }
};
