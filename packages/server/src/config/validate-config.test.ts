import { PolicyOption, RateLimitPolicy } from "@gateweaver/policies";
import { Config } from "./config.types";
import { validateConfig } from "./validate-config";

describe("validateConfig", () => {
  it("should not throw an error if config is valid", () => {
    const validConfig: Config = {
      endpoints: [
        {
          path: "/path1",
          target: {
            url: "http://example.com",
          },
        },
        {
          path: "/path2",
          target: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(validConfig)).not.toThrow();
  });

  it("should throw an error if endpoint path is duplicated", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
          path: "/duplicate",
          target: {
            url: "http://example.com",
          },
        },
        {
          path: "/duplicate",
          target: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow(
      "Duplicate endpoint path: /duplicate",
    );
  });

  it("should throw an error if endpoint path is invalid", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
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
