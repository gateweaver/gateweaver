import { JSONSchemaType } from "ajv";

export interface ApiKeyPolicy {
  apiKeyHashes: string[];
}

export const apiKeySchema: JSONSchemaType<ApiKeyPolicy> = {
  type: "object",
  properties: {
    apiKeyHashes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["apiKeyHashes"],
};
