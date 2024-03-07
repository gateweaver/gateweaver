import { JSONSchemaType } from "ajv";
import { PolicyOption, policyDefinitionsSchema } from "@endpointly/policies";
import {
  Destination,
  Endpoint,
  Config,
  HttpMethod,
  TransformedRequest,
  TransformedResponse,
} from "./types";

const destinationSchema: JSONSchemaType<Destination> = {
  type: "object",
  properties: {
    url: { type: "string", format: "url" },
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

const transformedRequestSchema: JSONSchemaType<TransformedRequest> = {
  type: "object",
  properties: {
    headers: { ...keyValueSchema, nullable: true },
    query: { ...keyValueSchema, nullable: true },
  },
};

const transformedResponseSchema: JSONSchemaType<TransformedResponse> = {
  type: "object",
  properties: {
    headers: { ...keyValueSchema, nullable: true },
  },
};

const endpointSchema: JSONSchemaType<Endpoint> = {
  type: "object",
  properties: {
    path: { type: "string" },
    method: { type: "string", enum: Object.values(HttpMethod) },
    destination: destinationSchema,
    transformedRequest: { ...transformedRequestSchema, nullable: true },
    transformedResponse: { ...transformedResponseSchema, nullable: true },
    policies: {
      type: "array",
      items: { type: "string", enum: Object.values(PolicyOption) },
      nullable: true,
    },
  },
  required: ["path", "method", "destination"],
};

export const configSchema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    port: { type: "number", nullable: true, default: 6060 },
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
