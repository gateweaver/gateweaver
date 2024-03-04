import { RateLimitPolicy } from "@endpointly/policies";
import { Config, HttpMethod } from "./types";
import { validateConfig } from "./validate";

describe("validateConfig", () => {
  it("should not throw an error if config is valid", () => {
    const validConfig: Config = {
      endpoints: [
        {
          method: HttpMethod.GET,
          path: "/path1",
          destination: {
            url: "http://example.com",
          },
        },
        {
          method: HttpMethod.POST,
          path: "/path2",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(validConfig)).not.toThrow();
  });

  it("should throw an error if endpoint path/method combination is duplicated", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
          method: HttpMethod.GET,
          path: "/duplicate",
          destination: {
            url: "http://example.com",
          },
        },
        {
          method: HttpMethod.GET,
          path: "/duplicate",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow(
      'Error: Duplicate endpoint path/method combination: "GET /duplicate"',
    );
  });

  it("should throw an error if endpoint path is invalid", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
          method: HttpMethod.GET,
          path: "invalid path",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow(
      'Error: Invalid path "invalid path". Must start with / and only contain alphanumeric characters, hyphens, and underscores.',
    );
  });

  it("should throw an error if rate limiting by api key and api key policy is not provided", () => {
    const invalidPolicyConfig: Config = {
      endpoints: [],
      policyDefinitions: {
        rateLimit: {
          rateLimitBy: "api-key",
        } as RateLimitPolicy,
      },
    };

    expect(() => validateConfig(invalidPolicyConfig)).toThrow(
      "Error: Rate limiting by api key requires an api key policy",
    );
  });

  it("should throw an error if rate limiting by jwt and jwt policy is not provided", () => {
    const invalidJwtPolicyConfig: Config = {
      endpoints: [],
      policyDefinitions: {
        rateLimit: {
          rateLimitBy: "jwt",
        } as RateLimitPolicy,
      },
    };

    expect(() => validateConfig(invalidJwtPolicyConfig)).toThrow(
      "Error: Rate limiting by jwt requires a jwt policy",
    );
  });
});
