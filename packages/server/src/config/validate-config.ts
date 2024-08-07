import Ajv from "ajv";
import addFormats from "ajv-formats";
import { PolicyDefinitions, PolicyOption } from "@gateweaver/policies";
import { InvalidConfigError } from "../utils/errors";
import { configSchema } from "./config.schema";
import { Endpoint, Config } from "./config.types";

const checkPathUniqueness = (
  endpoint: Endpoint,
  endpointPaths: Set<string>,
): string | null => {
  const pathKey = endpoint.path;

  if (endpointPaths.has(pathKey)) {
    return `Duplicate endpoint path: ${pathKey}`;
  } else {
    endpointPaths.add(pathKey);
    return null;
  }
};

const validatePathFormat = (endpoint: Endpoint): string | null => {
  const pathPattern =
    /^\/(?:[a-zA-Z0-9\-_]+|:(?!:)[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+|:(?!:)[a-zA-Z0-9\-_]+))*\/?$/;
  if (!pathPattern.test(endpoint.path)) {
    return `Invalid path: '${endpoint.path}'. Must start with / and only contain alphanumeric characters, hyphens, underscores, or path parameters (e.g., :userId)`;
  }
  return null;
};

const validateTarget = (
  target: Endpoint["target"],
  path: string,
): string | null => {
  if (!target.url && !target.handler) {
    return `Endpoint ${path} must have a target url or handler`;
  }

  if (target.url && target.handler) {
    return `Endpoint ${path} cannot have both a target url and handler`;
  }

  return null;
};

const validateEndpoints = (endpoints: Endpoint[]): string[] => {
  const errors: string[] = [];

  const endpointPaths = new Set<string>();

  endpoints.forEach((endpoint) => {
    const uniquenessError = checkPathUniqueness(endpoint, endpointPaths);
    if (uniquenessError) {
      errors.push(uniquenessError);
    }

    const pathError = validatePathFormat(endpoint);
    if (pathError) {
      errors.push(pathError);
    }

    const targetError = validateTarget(endpoint.target, endpoint.path);
    if (targetError) {
      errors.push(targetError);
    }
  });

  return errors;
};

const validatePolicyDefinitions = (
  policyDefinitions: PolicyDefinitions,
): string[] => {
  const errors: string[] = [];

  const { rateLimit } = policyDefinitions;

  if (rateLimit) {
    const { rateLimitBy } = rateLimit;

    if (rateLimitBy === "apiKey" && !policyDefinitions.apiKey) {
      errors.push("Rate limiting by api key requires an api key policy");
    }

    if (rateLimitBy === "jwt" && !policyDefinitions.jwt) {
      errors.push("Rate limiting by jwt requires a jwt policy");
    }
  }

  return errors;
};

const validateEndpointPolicies = (
  endpoints: Endpoint[],
  policyDefinitions?: PolicyDefinitions,
): string[] => {
  const errors: string[] = [];

  const validPolicies = Object.values(PolicyOption);

  const endpointPolicies = new Set(
    endpoints.flatMap((endpoint) => endpoint.policies ?? []),
  );

  endpointPolicies.forEach((policy) => {
    if (validPolicies.includes(policy) && !policyDefinitions?.[policy]) {
      errors.push(`Policy "${policy}" is not defined in policyDefinitions`);
    }
  });

  return errors;
};

export const validateConfig = (config: Config): Config => {
  const ajv = new Ajv({ useDefaults: true, allowUnionTypes: true });
  addFormats(ajv, ["uri"]);

  const validate = ajv.compile(configSchema);
  const validationErrors: string[] = [];

  if (!validate(config)) {
    const errorMessages = validate.errors?.map((error) => {
      const instancePath = error.instancePath
        .replace(/^\//, "")
        .replace(/\//g, ".");

      const allowedValues = error.params?.allowedValues?.join(", ");

      return `${instancePath} ${error.message}${allowedValues ? ` (${allowedValues})` : ""}`;
    });

    if (errorMessages) validationErrors.push(...errorMessages);
  }

  const { policyDefinitions, endpoints } = config || {};

  if (!endpoints || endpoints.length === 0) {
    throw new InvalidConfigError("No endpoints defined in configuration file.");
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
    throw new InvalidConfigError(validationErrors.join("\n"));
  }

  return config;
};
