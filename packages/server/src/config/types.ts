import { PolicyDefinitions, PolicyOption } from "@endpointly/policies";

export interface KeyValue {
  key: string;
  value: string;
}

export interface Destination {
  url: string;
  headers?: KeyValue[];
  params?: KeyValue[];
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface Endpoint {
  name: string;
  path: string;
  method: HttpMethod;
  destination: Destination;
  policies?: PolicyOption[];
}

export interface Config {
  endpoints: Endpoint[];
  policyDefinitions?: PolicyDefinitions;
}
