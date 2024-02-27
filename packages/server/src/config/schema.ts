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
    name: { type: "string" },
    path: { type: "string" },
    method: { type: "string", enum: Object.values(HttpMethod) },
    destination: destinationSchema,
    policies: {
      type: "array",
      items: { type: "string", enum: Object.values(PolicyOption) },
      nullable: true,
    },
  },
  required: ["name", "path", "method", "destination"],
};

export const configSchema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    endpoints: {
      type: "array",
      items: endpointSchema,
    },
    policyDefinitions: {
      ...policyDefinitionsSchema,
      nullable: true,
    },
  },
  required: ["endpoints"],
};
