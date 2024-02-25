import { Destination } from "../config/types";

interface Headers {
  [key: string]: string;
}

export const createHeaders = (headers: Destination["headers"]): Headers => {
  if (!headers) {
    return {};
  }

  const result: Headers = {};

  headers.forEach((header) => {
    result[header.key] = header.value;
  });

  return result;
};
