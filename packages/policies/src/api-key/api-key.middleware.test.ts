import { Request, Response } from "express";
import { hashApiKey } from "@endpointly/utils";
import { apiKeyMiddleware, isValidApiKey } from "./api-key.middleware";

describe("isValidApiKey", () => {
  it("returns true for a valid API key", () => {
    const apiKey = "test-api-key";
    const hashedKey = hashApiKey(apiKey);
    const apiKeyHashes = [hashedKey];

    expect(isValidApiKey(apiKey, apiKeyHashes)).toBe(true);
  });

  it("returns false for an invalid API key", () => {
    const apiKey = "invalid-api-key";
    const validHashedKey = hashApiKey("valid-api-key");
    const apiKeyHashes = [validHashedKey];

    expect(isValidApiKey(apiKey, apiKeyHashes)).toBe(false);
  });
});

describe("apiKeyMiddleware", () => {
  const setup = () => {
    const req: Partial<Request> = {
      headers: {},
    };

    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    const next = jest.fn();

    const validApiKey = "valid-api-key";

    const policy = {
      apiKeyHashes: [hashApiKey(validApiKey)],
    };

    return { req, res, next, policy };
  };

  it("calls next() for a valid API key", () => {
    const { req, res, next, policy } = setup();

    (req as Request).headers["x-api-key"] = "valid-api-key";

    apiKeyMiddleware(policy)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("responds with 401 if API key is missing", () => {
    const { req, res, next, policy } = setup();

    apiKeyMiddleware(policy)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: "API Key Required" });
  });

  it("responds with 401 for an invalid API key", () => {
    const { req, res, next, policy } = setup();
    (req as Request).headers["x-api-key"] = "invalid-api-key";

    apiKeyMiddleware(policy)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: "Invalid API Key" });
  });
});
