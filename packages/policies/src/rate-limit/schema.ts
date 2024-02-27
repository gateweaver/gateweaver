import { JSONSchemaType } from "ajv";

export interface RateLimitPolicy {
  rateLimitBy: "ip" | "api-key" | "jwt";
  windowMs: number;
  limit: number;
  message: string;
  statusCode: number;
  legacyHeaders: boolean;
  standardHeaders: boolean | "draft-6" | "draft-7";
  skipFailedRequests: boolean;
  skipSuccessfulRequests: boolean;
}

export const rateLimitSchema: JSONSchemaType<RateLimitPolicy> = {
  type: "object",
  properties: {
    rateLimitBy: {
      type: "string",
      enum: ["ip", "api-key", "jwt"],
      default: "ip",
    },
    windowMs: {
      type: "number",
      default: 60000,
    },
    limit: {
      type: "number",
      default: 5,
    },
    message: {
      type: "string",
      default: "Too many requests, please try again later.",
    },
    statusCode: {
      type: "number",
      default: 429,
    },
    legacyHeaders: {
      type: "boolean",
      default: false,
    },
    standardHeaders: {
      type: ["boolean", "string"],
      enum: [true, false, "draft-6", "draft-7"],
      default: "draft-7",
    },
    skipFailedRequests: {
      type: "boolean",
      default: false,
    },
    skipSuccessfulRequests: {
      type: "boolean",
      default: false,
    },
  },
  required: ["rateLimitBy", "windowMs", "limit", "message", "statusCode"],
};
