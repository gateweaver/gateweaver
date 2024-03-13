import { PolicyDefinitions, PolicyOption } from "@gateweaver/policies";

export interface Target {
  url: string;
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface TransformedRequest {
  headers?: Record<string, string>;
  query?: Record<string, string>;
}

export interface TransformedResponse {
  headers?: Record<string, string>;
}

export interface Endpoint {
  path: string;
  method: HttpMethod;
  target: Target;
  transformedRequest?: TransformedRequest;
  transformedResponse?: TransformedResponse;
  policies?: PolicyOption[];
}

export interface Config {
  endpoints: Endpoint[];
  policyDefinitions?: PolicyDefinitions;
}
