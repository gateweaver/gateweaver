import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Policies } from "@endpointly/policies";
import { configSchema } from "./schema";
import { Endpoint, Config } from "./types";

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

const validatePolicies = (policies: Policies) => {
  const errors: string[] = [];

  const { rateLimit } = policies;

  if (rateLimit) {
    const { rateLimitBy } = rateLimit;

    if (rateLimitBy === "api-key" && !policies.apiKey) {
      errors.push(
        "Config Error: Rate limiting by api key requires an api key policy",
      );
    }

    if (rateLimitBy === "jwt" && !policies.jwt) {
      errors.push("Config Error: Rate limiting by jwt requires a jwt policy");
    }
  }

  return errors;
};

export const validateConfig = (config: Config) => {
  const ajv = new Ajv({ useDefaults: true });
  addFormats(ajv, ["url"]);

  const validate = ajv.compile(configSchema);
  const validationErrors: string[] = [];

  if (!validate(config)) {
    validationErrors.push(JSON.stringify(validate.errors, null, 2));
  }

  const { endpoints, policies } = config;

  if (policies) {
    const policyErrors = validatePolicies(policies);
    if (policyErrors.length > 0) {
      validationErrors.push(...policyErrors);
    }
  }

  const uniquenessErrors = validateEndpointUniqueness(endpoints);
  if (uniquenessErrors.length > 0) {
    validationErrors.push(...uniquenessErrors);
  }

  if (validationErrors.length > 0) {
    throw new Error(`Invalid config: \n${validationErrors.join("\n")}`);
  }
};