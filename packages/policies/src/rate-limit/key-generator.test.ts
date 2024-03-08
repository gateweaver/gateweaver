import { Request } from "express";
import { UnauthorizedAccessError } from "@endpointly/utils";
import { keyGenerator } from "./key-generator";
import { RateLimitBy } from "./schema";

describe("keyGenerator", () => {
  let req: Request;

  beforeEach(() => {
    req = {
      headers: {},
    } as Request;
  });

  it("should throw an error if rateLimitBy is invalid", () => {
    expect(() => keyGenerator("invalid" as RateLimitBy)(req)).toThrow(
      "Invalid rateLimitBy: invalid",
    );
  });

  it("should return API key if rateLimitBy is apiKey", () => {
    req.headers["x-api-key"] = "test-api-key";
    expect(keyGenerator(RateLimitBy.API_KEY)(req)).toBe("test-api-key");
  });

  it("should throw an error if API key is missing and rate limiting by API key", () => {
    expect(() => keyGenerator(RateLimitBy.API_KEY)(req)).toThrow(
      new UnauthorizedAccessError("API Key Required"),
    );
  });

  it("should return decoded JWT sub if rateLimitBy is jwt", () => {
    const header = Buffer.from('{"alg":"HS256","typ":"JWT"}').toString(
      "base64",
    );
    const payload = Buffer.from('{"sub":"test-sub"}').toString("base64");
    const signature = "signature";
    const token = `${header}.${payload}.${signature}`;
    req.headers.authorization = `Bearer ${token}`;
    expect(keyGenerator(RateLimitBy.JWT)(req)).toBe("test-sub");
  });

  it("should throw an error if JWT is missing and rate limiting by JWT", () => {
    expect(() => keyGenerator(RateLimitBy.JWT)(req)).toThrow(
      new UnauthorizedAccessError("No authorization token was found"),
    );
  });

  it("should return IP if rateLimitBy is ip", () => {
    req.ip = "127.0.0.1";
    expect(keyGenerator(RateLimitBy.IP)(req)).toBe("127.0.0.1");
  });

  it("should throw an error if IP is missing and rate limiting by IP", () => {
    expect(() => keyGenerator(RateLimitBy.IP)(req)).toThrow(
      new Error("IP address is missing"),
    );
  });
});
