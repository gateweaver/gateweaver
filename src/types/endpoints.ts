export interface KeyValue {
  key: string;
  value: string;
}

export interface Destination {
  url: string;
  headers?: KeyValue[];
  params?: KeyValue[];
}

export interface Endpoint {
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  destination: Destination;
}
