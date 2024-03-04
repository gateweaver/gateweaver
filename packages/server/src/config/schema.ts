import { JSONSchemaType } from "ajv";
import { PolicyOption, policyDefinitionsSchema } from "@endpointly/policies";
import { KeyValue, Destination, Endpoint, Config, HttpMethod } from "./types";

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
    url: { type: "string", format: "url" },
    headers: { type: "array", items: keyValueSchema, nullable: true },
    params: { type: "array", items: keyValueSchema, nullable: true },
  },
  required: ["url"],
};

const endpointSchema: JSONSchemaType<Endpoint> = {
  type: "object",
  properties: {
    path: { type: "string" },
    method: { type: "string", enum: Object.values(HttpMethod) },
    destination: destinationSchema,
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
