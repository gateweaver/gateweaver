import { Policies } from "@endpointly/policies";
import { Endpoint } from "./endpoints";

export interface Config {
  endpoints: Endpoint[];
  policies?: Policies;
}
