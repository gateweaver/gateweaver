import { JSONSchemaType } from "ajv";
import { PolicyOption, policyDefinitionsSchema } from "@gateweaver/policies";
import {
  Target,
  Endpoint,
  Config,
  CustomRequest,
  CustomResponse,
} from "./config.types";

const targetSchema: JSONSchemaType<Target> = {
  type: "object",
  properties: {
    url: { type: "string" },
  },
  required: ["url"],
};

const keyValueSchema: JSONSchemaType<Record<string, string>> = {
  type: "object",
  patternProperties: {
    "^.*$": { type: "string" },
  },
  additionalProperties: false,
  required: [],
};

const requestSchema: JSONSchemaType<CustomRequest> = {
  type: "object",
  properties: {
    headers: { ...keyValueSchema, nullable: true },
    query: { ...keyValueSchema, nullable: true },
  },
};

const responseSchema: JSONSchemaType<CustomResponse> = {
  type: "object",
  properties: {
    headers: { ...keyValueSchema, nullable: true },
  },
};

const endpointSchema: JSONSchemaType<Endpoint> = {
  type: "object",
  properties: {
    path: { type: "string" },
    target: targetSchema,
    request: { ...requestSchema, nullable: true },
    response: { ...responseSchema, nullable: true },
    policies: {
      type: "array",
      items: { type: "string", enum: Object.values(PolicyOption) },
      nullable: true,
    },
  },
  required: ["path", "target"],
};

export const configSchema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    policyDefinitions: {
      ...policyDefinitionsSchema,
      nullable: true,
    },
    endpoints: {
      type: "array",
      items: endpointSchema,
    },
  },
  required: ["endpoints"],
};
