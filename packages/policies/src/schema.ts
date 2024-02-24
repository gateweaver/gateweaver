import { JSONSchemaType } from "ajv";
import { CorsPolicy, corsSchema } from "./cors";
import { JwtPolicy, jwtSchema } from "./jwt";

export interface Policies {
  cors?: CorsPolicy;
  jwt?: JwtPolicy;
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
  },
};
