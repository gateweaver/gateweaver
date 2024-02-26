import { Config } from "./types";
import { validateConfig } from "./validate";

describe("validateConfig", () => {
  it("should not throw an error if config is valid", () => {
    const validConfig: Config = {
      endpoints: [
        {
          name: "endpoint1",
          method: "GET",
          path: "/path1",
          destination: {
            url: "http://example.com",
          },
        },
        {
          name: "endpoint2",
          method: "POST",
          path: "/path2",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(validConfig)).not.toThrow();
  });

  it("should throw an error if endpoint names are duplicated", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
          name: "duplicate",
          method: "GET",
          path: "/path1",
          destination: {
            url: "http://example.com",
          },
        },
        {
          name: "duplicate",
          method: "GET",
          path: "/path2",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow();
  });

  it("should throw an error if endpoint path/method combination is duplicated", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
          name: "endpoint1",
          method: "GET",
          path: "/duplicate",
          destination: {
            url: "http://example.com",
          },
        },
        {
          name: "endpoint2",
          method: "GET",
          path: "/duplicate",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow();
  });

  it("should throw an error if destination URL is invalid", () => {
    const invalidUrlConfig: Config = {
      endpoints: [
        {
          name: "endpoint",
          method: "GET",
          path: "/path",
          destination: {
            url: "invalid_url",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidUrlConfig)).toThrow();
  });

  it("should throw an error if rate limiting by api key and api key policy is not provided", () => {
    const invalidPolicyConfig: Config = {
      endpoints: [],
      policies: {
        rateLimit: {
          rateLimitBy: "api-key",
        },
      },
    };

    expect(() => validateConfig(invalidPolicyConfig)).toThrow(
      "Config Error: Rate limiting by api key requires an api key policy",
    );
  });

  it("should throw an error if rate limiting by jwt and jwt policy is not provided", () => {
    const invalidJwtPolicyConfig: Config = {
      endpoints: [],
      policies: {
        rateLimit: {
          rateLimitBy: "jwt",
        },
      },
    };

    expect(() => validateConfig(invalidJwtPolicyConfig)).toThrow(
      "Config Error: Rate limiting by jwt requires a jwt policy",
    );
  });
});
