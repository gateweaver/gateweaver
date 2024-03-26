import { JSONSchemaType } from "ajv";

export interface ApiKeyPolicy {
  hashes: string[];
}

export const apiKeySchema: JSONSchemaType<ApiKeyPolicy> = {
  type: "object",
  properties: {
    hashes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["hashes"],
};
