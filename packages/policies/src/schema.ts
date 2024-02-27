import { JSONSchemaType } from "ajv";
import { CorsPolicy, corsSchema } from "./cors";
import { JwtPolicy, jwtSchema } from "./jwt";
import { ApiKeyPolicy, apiKeySchema } from "./api-key";
import { RateLimitPolicy, rateLimitSchema } from "./rate-limit";

export enum PolicyOption {
  Cors = "cors",
  Jwt = "jwt",
  ApiKey = "apiKey",
  RateLimit = "rateLimit",
}

export interface PolicyDefinitions {
  cors?: CorsPolicy;
  jwt?: JwtPolicy;
  apiKey?: ApiKeyPolicy;
  rateLimit?: RateLimitPolicy;
}

export const policyDefinitionsSchema: JSONSchemaType<PolicyDefinitions> = {
  type: "object",
  properties: {
    cors: {
      ...corsSchema,
      nullable: true,
    },
    jwt: {
      ...jwtSchema,
      nullable: true,
    },
    apiKey: {
      ...apiKeySchema,
      nullable: true,
    },
    rateLimit: {
      ...rateLimitSchema,
      nullable: true,
    },
  },
};
