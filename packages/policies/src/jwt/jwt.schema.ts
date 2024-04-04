import { JSONSchemaType } from "ajv";

type Algorithm =
  | "HS256"
  | "HS384"
  | "HS512"
  | "RS256"
  | "RS384"
  | "RS512"
  | "ES256"
  | "ES384"
  | "ES512"
  | "PS256"
  | "PS384"
  | "PS512"
  | "none";

export interface JwtPolicy {
  secret?: string;
  jwksUri?: string;
  audience?: string;
  issuer?: string;
  algorithms: Algorithm[];
}

export const jwtSchema: JSONSchemaType<JwtPolicy> = {
  type: "object",
  properties: {
    secret: { type: "string", nullable: true },
    jwksUri: { type: "string", nullable: true, format: "uri" },
    audience: { type: "string", nullable: true },
    issuer: { type: "string", nullable: true },
    algorithms: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "HS256",
          "HS384",
          "HS512",
          "RS256",
          "RS384",
          "RS512",
          "ES256",
          "ES384",
          "ES512",
          "PS256",
          "PS384",
          "PS512",
          "none",
        ],
      },
    },
  },
  required: ["algorithms"],
  oneOf: [{ required: ["secret"] }, { required: ["jwksUri"] }],
};
