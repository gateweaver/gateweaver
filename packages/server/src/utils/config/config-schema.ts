import { JSONSchemaType } from "ajv";
import { policiesSchema } from "@endpointly/policies";
import { Config } from "../../types/config";
import { KeyValue, Destination, Endpoint } from "../../types/endpoints";

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

export const configSchema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    endpoints: {
      type: "array",
      items: endpointSchema,
    },
    policies: {
      ...policiesSchema,
      nullable: true,
    },
  },
  required: ["endpoints"],
};
