import { Router } from "express";
import {
  ApiKeyPolicy,
  CorsPolicy,
  JwtPolicy,
  PolicyDefinitions,
  PolicyOption,
  RateLimitPolicy,
  policyMiddleware,
} from "@gateweaver/policies";
import { setupGlobalPolicies } from "./policies";

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

describe("setupGlobalPolicies", () => {
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

  it("should setup the policies if they are defined and are enabled globally", () => {
    const policies: PolicyOption[] = [
      PolicyOption.Cors,
      PolicyOption.Jwt,
      PolicyOption.ApiKey,
      PolicyOption.RateLimit,
    ];

    setupGlobalPolicies({ router, policyDefinitions, policies });

    expect(policyMiddleware.cors).toHaveBeenCalledWith(policyDefinitions.cors);
    expect(policyMiddleware.jwt).toHaveBeenCalledWith(policyDefinitions.jwt);
    expect(policyMiddleware.apiKey).toHaveBeenCalledWith(
      policyDefinitions.apiKey,
    );
    expect(policyMiddleware.rateLimit).toHaveBeenCalledWith(
      policyDefinitions.rateLimit,
    );
  });

  it("should not setup the policies if they are not enabled globally", () => {
    const policies: PolicyOption[] = [];

    setupGlobalPolicies({ router, policyDefinitions, policies });

    expect(policyMiddleware.cors).not.toHaveBeenCalled();
    expect(policyMiddleware.jwt).not.toHaveBeenCalled();
    expect(policyMiddleware.apiKey).not.toHaveBeenCalled();
    expect(policyMiddleware.rateLimit).not.toHaveBeenCalled();
  });

  it("should not setup the policies if they are not defined", () => {
    const policies: PolicyOption[] = [
      PolicyOption.Cors,
      PolicyOption.Jwt,
      PolicyOption.ApiKey,
      PolicyOption.RateLimit,
    ];

    setupGlobalPolicies({ router, policyDefinitions: {}, policies });

    expect(policyMiddleware.cors).not.toHaveBeenCalled();
    expect(policyMiddleware.jwt).not.toHaveBeenCalled();
    expect(policyMiddleware.apiKey).not.toHaveBeenCalled();
    expect(policyMiddleware.rateLimit).not.toHaveBeenCalled();
  });
});
