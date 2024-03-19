import { PolicyDefinitions, PolicyOption } from "@gateweaver/policies";

export interface Target {
  url: string;
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
  target: Target;
  transformedRequest?: TransformedRequest;
  transformedResponse?: TransformedResponse;
  policies?: PolicyOption[];
}

export interface Config {
  endpoints: Endpoint[];
  policyDefinitions?: PolicyDefinitions;
}
