import { JSONSchemaType } from "ajv";

export interface CorsPolicy {
  origin: boolean | string | string[];
  methods: string | string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  optionsSuccessStatus: number;
}

export const corsSchema: JSONSchemaType<CorsPolicy> = {
  type: "object",
  properties: {
    origin: {
      oneOf: [
        { type: "boolean" },
        { type: "string" },
        { type: "array", items: { type: "string" } },
      ],
      default: "*",
    },
    methods: {
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      default: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    },
    allowedHeaders: {
      type: "array",
      items: { type: "string" },
      nullable: true,
    },
    exposedHeaders: {
      type: "array",
      items: { type: "string" },
      nullable: true,
    },
    credentials: { type: "boolean", nullable: true },
    maxAge: { type: "number", nullable: true },
    optionsSuccessStatus: { type: "number", default: 204 },
  },
  required: ["origin", "methods", "optionsSuccessStatus"],
};
