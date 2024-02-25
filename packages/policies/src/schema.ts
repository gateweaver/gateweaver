import { JSONSchemaType } from "ajv";
import { CorsPolicy, corsSchema } from "./cors";
import { JwtPolicy, jwtSchema } from "./jwt";
import { ApiKeyPolicy, apiKeySchema } from "./api-key";
import { RateLimitPolicy, rateLimitSchema } from "./rate-limit";

export interface Policies {
  cors?: CorsPolicy;
  jwt?: JwtPolicy;
  apiKey?: ApiKeyPolicy;
  rateLimit?: RateLimitPolicy;
}

export const policiesSchema: JSONSchemaType<Policies> = {
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
