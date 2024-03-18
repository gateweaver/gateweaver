import { PolicyOption, RateLimitPolicy } from "@gateweaver/policies";
import { Config, HttpMethod } from "./config.types";
import { validateConfig } from "./validate-config";

describe("validateConfig", () => {
  it("should not throw an error if config is valid", () => {
    const validConfig: Config = {
      endpoints: [
        {
          method: HttpMethod.GET,
          path: "/path1",
          target: {
            url: "http://example.com",
          },
        },
        {
          method: HttpMethod.POST,
          path: "/path2",
          target: {
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
          target: {
            url: "http://example.com",
          },
        },
        {
          method: HttpMethod.GET,
          path: "/duplicate",
          target: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow(
      "Duplicate endpoint path/method combination: GET /duplicate",
    );
  });

  it("should throw an error if endpoint path is invalid", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
          method: HttpMethod.GET,
          path: "invalid path",
          target: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow(
      "Invalid path: 'invalid path'. Must start with / and only contain alphanumeric characters, hyphens, and underscores",
    );
  });

  it("should throw an error if rate limiting by api key and api key policy is not provided", () => {
    const invalidPolicyConfig: Config = {
      endpoints: [
        {
          method: HttpMethod.GET,
          path: "/path1",
          target: {
            url: "http://example.com",
          },
          policies: [PolicyOption.RateLimit],
        },
      ],
      policyDefinitions: {
        rateLimit: {
          rateLimitBy: "apiKey",
        } as RateLimitPolicy,
      },
    };

    expect(() => validateConfig(invalidPolicyConfig)).toThrow(
      "Rate limiting by api key requires an api key policy",
    );
  });

  it("should throw an error if rate limiting by jwt and jwt policy is not provided", () => {
    const invalidJwtPolicyConfig: Config = {
      endpoints: [
        {
          method: HttpMethod.GET,
          path: "/path1",
          target: {
            url: "http://example.com",
          },
          policies: [PolicyOption.RateLimit],
        },
      ],
      policyDefinitions: {
        rateLimit: {
          rateLimitBy: "jwt",
        } as RateLimitPolicy,
      },
    };

    expect(() => validateConfig(invalidJwtPolicyConfig)).toThrow(
      "Rate limiting by jwt requires a jwt policy",
    );
  });

  it("should throw an error if endpoint policies are defined but no policy definitions are provided", () => {
    const invalidPolicyConfig: Config = {
      endpoints: [
        {
          method: HttpMethod.GET,
          path: "/path1",
          target: {
            url: "http://example.com",
          },
          policies: [PolicyOption.RateLimit],
        },
      ],
    };

    expect(() => validateConfig(invalidPolicyConfig)).toThrow(
      'Policy "rateLimit" is not defined in policyDefinitions',
    );
  });
});
