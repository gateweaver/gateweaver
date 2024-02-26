import { JSONSchemaType } from "ajv";

export interface RateLimitPolicy {
  identifier?: "ip" | "api-key" | "jwt";
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
    identifier: {
      type: "string",
      enum: ["ip", "api-key", "jwt"],
      nullable: true,
      default: "ip",
    },
    windowMs: {
      type: "number",
      nullable: true,
      default: 60000,
    },
    limit: {
      type: "number",
      nullable: true,
      default: 5,
    },
    message: {
      type: "string",
      nullable: true,
      default: "Too many requests, please try again later.",
    },
    statusCode: {
      type: "number",
      nullable: true,
      default: 429,
    },
    legacyHeaders: {
      type: "boolean",
      nullable: true,
      default: false,
    },
    standardHeaders: {
      type: ["boolean", "string"],
      enum: [true, false, "draft-6", "draft-7"],
      nullable: true,
      default: "draft-7",
    },
    skipFailedRequests: {
      type: "boolean",
      nullable: true,
      default: false,
    },
    skipSuccessfulRequests: {
      type: "boolean",
      nullable: true,
      default: false,
    },
  },
};
