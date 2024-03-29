import { JSONSchemaType } from "ajv";

export enum RateLimitBy {
  IP = "ip",
  API_KEY = "apiKey",
  JWT = "jwt",
}

export interface RateLimitPolicy {
  rateLimitBy: RateLimitBy;
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
      enum: Object.values(RateLimitBy),
      default: RateLimitBy.IP,
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
      oneOf: [
        { type: "boolean" },
        { type: "string", enum: ["draft-6", "draft-7"] },
      ],
      default: "draft-6",
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
