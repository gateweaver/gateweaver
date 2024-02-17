import { JSONSchemaType } from "ajv";

export interface CorsPolicy {
  origin?: boolean | string | string[];
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
  optionsSuccessStatus?: number;
}

export const corsSchema: JSONSchemaType<CorsPolicy> = {
  type: "object",
  properties: {
    origin: {
      type: ["boolean", "string", "array"],
      oneOf: [
        { type: "boolean" },
        { type: "string" },
        { type: "array", items: { type: "string" } },
      ],
      default: "*",
      nullable: true,
    },
    methods: {
      type: ["string", "array"],
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      default: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      nullable: true,
    },
    allowedHeaders: {
      type: ["string", "array"],
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      nullable: true,
    },
    exposedHeaders: {
      type: ["string", "array"],
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      nullable: true,
    },
    credentials: { type: "boolean", nullable: true },
    maxAge: { type: "number", nullable: true },
    optionsSuccessStatus: { type: "number", default: 204, nullable: true },
  },
};
