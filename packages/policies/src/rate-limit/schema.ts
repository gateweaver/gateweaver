import { JSONSchemaType } from "ajv";

export interface RateLimitPolicy {
  windowMs?: number;
  limit?: number;
  message?: string;
  statusCode?: number;
  legacyHeaders?: boolean;
  standardHeaders?: boolean | "draft-6" | "draft-7";
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

export const rateLimitSchema: JSONSchemaType<RateLimitPolicy> = {
  type: "object",
  properties: {
    windowMs: {
      type: "number",
      nullable: true,
    },
    limit: {
      type: "number",
      nullable: true,
    },
    message: {
      type: "string",
      nullable: true,
    },
    statusCode: {
      type: "number",
      nullable: true,
    },
    legacyHeaders: {
      type: "boolean",
      nullable: true,
    },
    standardHeaders: {
      type: ["boolean", "string"],
      enum: [true, false, "draft-6", "draft-7"],
      nullable: true,
    },
    skipFailedRequests: {
      type: "boolean",
      nullable: true,
    },
    skipSuccessfulRequests: {
      type: "boolean",
      nullable: true,
    },
  },
};
