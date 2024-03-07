import { PolicyDefinitions, PolicyOption } from "@endpointly/policies";

export interface Destination {
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
  destination: Destination;
  transformedRequest?: TransformedRequest;
  transformedResponse?: TransformedResponse;
  policies?: PolicyOption[];
}

export interface Config {
  port?: number;
  endpoints: Endpoint[];
  policyDefinitions?: PolicyDefinitions;
}
