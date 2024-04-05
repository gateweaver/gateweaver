import { Response } from "supertest";

export const checkResponseHeaders = (response: Response) => {
  const EXPECTED_HEADERS = {
    "remove-header": undefined,
    "replace-header": "New value",
    "access-control-allow-origin": "example.com",
  };

  Object.entries(EXPECTED_HEADERS).forEach(([key, value]) => {
    expect(response.headers[key]).toBe(value);
  });
};
