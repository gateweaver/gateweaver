import { JSONSchemaType } from "ajv";
import { CorsPolicy, corsSchema } from "./cors";

export interface Policies {
  cors?: CorsPolicy;
}

export const policiesSchema: JSONSchemaType<Policies> = {
  type: "object",
  properties: {
    cors: {
      ...corsSchema,
      nullable: true,
    },
  },
};
