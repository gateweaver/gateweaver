import { PolicyDefinitions, PolicyOption } from "@gateweaver/policies";

export interface CustomRequest {
  headers?: Record<string, string>;
  query?: Record<string, string>;
}

export interface CustomResponse {
  headers?: Record<string, string>;
}

export interface PathFunction {
  path: string;
  function: string;
}

export interface Target {
  url?: string;
  handler?: PathFunction;
}

export interface Endpoint {
  path: string;
  target: Target;
  request?: CustomRequest;
  response?: CustomResponse;
  policies?: PolicyOption[];
  middleware?: PathFunction[];
}

export interface GlobalConfig {
  policies?: PolicyOption[];
  middleware?: PathFunction[];
}

export interface Config {
  policyDefinitions?: PolicyDefinitions;
  global?: GlobalConfig;
  endpoints: Endpoint[];
}
