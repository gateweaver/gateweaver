export interface Destination {
  url: string;
  headers?: {
    key: string;
    value: string;
  }[];
}

export interface Endpoint {
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  destination: Destination;
}
