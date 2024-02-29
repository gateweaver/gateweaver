import Ajv from "ajv";
import addFormats from "ajv-formats";
import { PolicyDefinitions } from "@endpointly/policies";
import { configSchema } from "./schema";
import { Endpoint, Config } from "./types";

const validateEndpointUniqueness = (endpoints: Endpoint[]): string[] => {
  const endpointPaths = new Set<string>();
  const errors: string[] = [];

  endpoints.forEach((endpoint) => {
    const pathKey = `${endpoint.method} ${endpoint.path}`;

    if (endpointPaths.has(pathKey)) {
      errors.push(`Config Error: Duplicate endpoint path "${pathKey}"`);
    } else {
      endpointPaths.add(pathKey);
    }
  });

  return errors;
};

const validateEndpointPaths = (endpoints: Endpoint[]): string[] => {
  const pathPattern = /^\/[a-zA-Z0-9\-_/]*\/?$/;

  const errors: string[] = [];

  endpoints.forEach((endpoint) => {
    if (!pathPattern.test(endpoint.path)) {
      errors.push(
        `Config Error: Invalid path "${endpoint.path}". Must match start with / and only contain alphanumeric characters, hyphens, and underscores.`,
      );
    }
  });

  return errors;
};

const validatePolicyDefinitions = (policyDefinitions: PolicyDefinitions) => {
  const errors: string[] = [];

  const { rateLimit } = policyDefinitions;

  if (rateLimit) {
    const { rateLimitBy } = rateLimit;

    if (rateLimitBy === "api-key" && !policyDefinitions.apiKey) {
      errors.push(
        "Config Error: Rate limiting by api key requires an api key policy",
      );
    }

    if (rateLimitBy === "jwt" && !policyDefinitions.jwt) {
      errors.push("Config Error: Rate limiting by jwt requires a jwt policy");
    }
  }

  return errors;
};

export const validateConfig = (config: Config) => {
  const ajv = new Ajv({ useDefaults: true, allowUnionTypes: true });
  addFormats(ajv, ["url"]);

  const validate = ajv.compile(configSchema);
  const validationErrors: string[] = [];

  if (!validate(config)) {
    validationErrors.push(JSON.stringify(validate.errors, null, 2));
  }

  const { endpoints, policyDefinitions } = config;

  if (policyDefinitions) {
    const policyErrors = validatePolicyDefinitions(policyDefinitions);
    if (policyErrors.length > 0) {
      validationErrors.push(...policyErrors);
    }
  }

  const uniquenessErrors = validateEndpointUniqueness(endpoints);
  if (uniquenessErrors.length > 0) {
    validationErrors.push(...uniquenessErrors);
  }

  const pathErrors = validateEndpointPaths(endpoints);
  if (pathErrors.length > 0) {
    validationErrors.push(...pathErrors);
  }

  if (validationErrors.length > 0) {
    throw new Error(`Invalid config:\n${validationErrors.join("\n")}`);
  }
};
