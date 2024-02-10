import Ajv, { JSONSchemaType } from "ajv";
import { Destination, Endpoint } from "../types/endpoints";
import { Config } from "../types/config";

const ajv = new Ajv();

const destinationSchema: JSONSchemaType<Destination> = {
  type: "object",
  properties: {
    url: { type: "string" },
    headers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          value: { type: "string" },
        },
        required: ["key", "value"],
      },
      nullable: true,
    },
  },
  required: ["url"],
};

const endpointSchema: JSONSchemaType<Endpoint> = {
  type: "object",
  properties: {
    name: { type: "string" }, // make unique
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

export const validateConfig = ajv.compile(configSchema);
