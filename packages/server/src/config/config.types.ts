import { PolicyDefinitions, PolicyOption } from "@gateweaver/policies";

export interface Target {
  url: string;
}

export interface CustomRequest {
  headers?: Record<string, string>;
  query?: Record<string, string>;
}

export interface CustomResponse {
  headers?: Record<string, string>;
}

export interface CustomMiddleware {
  path: string;
  function: string;
}

export interface Endpoint {
  path: string;
  target: Target;
  request?: CustomRequest;
  response?: CustomResponse;
  policies?: PolicyOption[];
  middleware?: CustomMiddleware[];
}

export interface Config {
  endpoints: Endpoint[];
  policyDefinitions?: PolicyDefinitions;
}
