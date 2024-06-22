import { Router } from "express";
import {
  ApiKeyPolicy,
  CorsPolicy,
  JwtPolicy,
  RateLimitPolicy,
  PolicyDefinitions,
  PolicyOption,
  policyMiddleware,
} from "@gateweaver/policies";
import { Endpoint } from "../../../config/config.types";
import { setupPolicies } from "./setup-policies";

jest.mock("express", () => ({
  Router: () => ({
    use: jest.fn(),
  }),
}));

jest.mock("@gateweaver/policies", () => {
  const actual = jest.requireActual("@gateweaver/policies");
  return {
    ...actual,
    policyMiddleware: {
      cors: jest.fn(),
      jwt: jest.fn(),
      apiKey: jest.fn(),
      rateLimit: jest.fn(),
    },
  };
});

describe("setupPolicies", () => {
  let router: Router;

  beforeEach(() => {
    router = Router();
    jest.resetAllMocks();
  });

  const policyDefinitions: PolicyDefinitions = {
    cors: {
      origin: "*",
    } as CorsPolicy,
    jwt: {
      secret: "test-secret",
    } as JwtPolicy,
    apiKey: {
      hashes: ["hash1", "hash2"],
    } as ApiKeyPolicy,
    rateLimit: {
      windowMs: 60000,
    } as RateLimitPolicy,
  };

  it("should setup the policies if they are defined and are enabled for the endpoint", () => {
    const endpoint: Endpoint = {
      path: "/test",
      target: {
        url: "https://example.com",
      },
      policies: [
        PolicyOption.Cors,
        PolicyOption.Jwt,
        PolicyOption.ApiKey,
        PolicyOption.RateLimit,
      ],
    };

    setupPolicies(router, endpoint, policyDefinitions);

    expect(policyMiddleware.cors).toHaveBeenCalledWith(policyDefinitions.cors);
    expect(policyMiddleware.jwt).toHaveBeenCalledWith(policyDefinitions.jwt);
    expect(policyMiddleware.apiKey).toHaveBeenCalledWith(
      policyDefinitions.apiKey,
    );
    expect(policyMiddleware.rateLimit).toHaveBeenCalledWith(
      policyDefinitions.rateLimit,
    );
  });

  it("should not setup the policies if they are not enabled for the endpoint", () => {
    const endpoint: Endpoint = {
      path: "/test",
      target: {
        url: "https://example.com",
      },
      policies: [],
    };

    setupPolicies(router, endpoint, policyDefinitions);

    expect(policyMiddleware.cors).not.toHaveBeenCalled();
    expect(policyMiddleware.jwt).not.toHaveBeenCalled();
    expect(policyMiddleware.apiKey).not.toHaveBeenCalled();
    expect(policyMiddleware.rateLimit).not.toHaveBeenCalled();
  });

  it("should not setup the policies if they are not defined", () => {
    const endpoint: Endpoint = {
      path: "/test",
      target: {
        url: "https://example.com",
      },
      policies: [
        PolicyOption.Cors,
        PolicyOption.Jwt,
        PolicyOption.ApiKey,
        PolicyOption.RateLimit,
      ],
    };

    setupPolicies(router, endpoint, {});

    expect(policyMiddleware.cors).not.toHaveBeenCalled();
    expect(policyMiddleware.jwt).not.toHaveBeenCalled();
    expect(policyMiddleware.apiKey).not.toHaveBeenCalled();
    expect(policyMiddleware.rateLimit).not.toHaveBeenCalled();
  });
});
