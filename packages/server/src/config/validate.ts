import Ajv from "ajv";
import addFormats from "ajv-formats";
import { PolicyDefinitions, PolicyOption } from "@endpointly/policies";
import { configSchema } from "./schema";
import { Endpoint, Config } from "./types";

class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigValidationError";
  }
}

const checkEndpointUniqueness = (
  endpoint: Endpoint,
  endpointPaths: Set<string>,
): string | null => {
  const pathKey = `${endpoint.method} ${endpoint.path}`;

  if (endpointPaths.has(pathKey)) {
    return `Error: Duplicate endpoint path/method combination: "${pathKey}"`;
  } else {
    endpointPaths.add(pathKey);
    return null;
  }
};

const validateEndpointPath = (endpoint: Endpoint): string | null => {
  const pathPattern = /^\/[a-zA-Z0-9\-_/]*\/?$/;
  if (!pathPattern.test(endpoint.path)) {
    return `Error: Invalid path "${endpoint.path}". Must start with / and only contain alphanumeric characters, hyphens, and underscores.`;
  }
  return null;
};

const validateEndpoints = (endpoints: Endpoint[]): string[] => {
  const errors: string[] = [];

  const endpointPaths = new Set<string>();

  endpoints.forEach((endpoint) => {
    const uniquenessError = checkEndpointUniqueness(endpoint, endpointPaths);
    if (uniquenessError) {
      errors.push(uniquenessError);
    }

    const pathError = validateEndpointPath(endpoint);
    if (pathError) {
      errors.push(pathError);
    }
  });

  return errors;
};

const validatePolicyDefinitions = (policyDefinitions: PolicyDefinitions) => {
  const errors: string[] = [];

  const { rateLimit } = policyDefinitions;

  if (rateLimit) {
    const { rateLimitBy } = rateLimit;

    if (rateLimitBy === "apiKey" && !policyDefinitions.apiKey) {
      errors.push("Error: Rate limiting by api key requires an api key policy");
    }

    if (rateLimitBy === "jwt" && !policyDefinitions.jwt) {
      errors.push("Error: Rate limiting by jwt requires a jwt policy");
    }
  }

  return errors;
};

const validateEndpointPolicies = (
  endpoints: Endpoint[],
  policyDefinitions?: PolicyDefinitions,
) => {
  const errors: string[] = [];

  const validPolicies = Object.values(PolicyOption);

  const endpointPolicies = new Set(
    endpoints.flatMap((endpoint) => endpoint.policies ?? []),
  );

  endpointPolicies.forEach((policy) => {
    if (validPolicies.includes(policy) && !policyDefinitions?.[policy]) {
      errors.push(
        `Error: Policy "${policy}" is not defined in policyDefinitions`,
      );
    }
  });

  return errors;
};

export const validateConfig = (config: Config) => {
  const ajv = new Ajv({ useDefaults: true, allowUnionTypes: true });
  addFormats(ajv, ["url"]);

  const validate = ajv.compile(configSchema);
  const validationErrors: string[] = [];

  if (!validate(config)) {
    validationErrors.push("Error: ", JSON.stringify(validate.errors, null, 2));
  }

  const { policyDefinitions, endpoints } = config || {};

  if (!endpoints || endpoints.length === 0) {
    throw new ConfigValidationError("Error: No endpoints defined in config.");
  }

  if (policyDefinitions) {
    const policyErrors = validatePolicyDefinitions(policyDefinitions);
    if (policyErrors.length > 0) {
      validationErrors.push(...policyErrors);
    }
  }

  const endpointErrors = validateEndpoints(endpoints);
  if (endpointErrors.length > 0) {
    validationErrors.push(...endpointErrors);
  }

  const endpointPolicyErrors = validateEndpointPolicies(
    endpoints,
    policyDefinitions,
  );
  if (endpointPolicyErrors.length > 0) {
    validationErrors.push(...endpointPolicyErrors);
  }

  if (validationErrors.length > 0) {
    throw new ConfigValidationError(`\n${validationErrors.join("\n")}`);
  }

  return config;
};
