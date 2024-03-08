import { expressjwt } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";
import { jwtMiddleware } from "./middleware";
import { JwtPolicy } from "./schema";

jest.mock("express-jwt", () => ({
  expressjwt: jest.fn(),
}));

jest.mock("jwks-rsa", () => ({
  expressJwtSecret: jest.fn(),
}));

describe("jwtMiddleware", () => {
  beforeEach(() => {
    (expressjwt as jest.Mock).mockClear();
    (expressJwtSecret as jest.Mock).mockClear();
  });

  it("throws an error if neither jwksUri nor secretOrPublicKey is provided", () => {
    const policy = {
      audience: "test-audience",
      issuer: "test-issuer",
      algorithms: ["RS256"],
    } as JwtPolicy;

    expect(() => jwtMiddleware(policy)).toThrow(
      'Either "jwksUri" or "secretOrPublicKey" must be provided',
    );
  });

  it("uses secretOrPublicKey if provided", () => {
    const policy = {
      secretOrPublicKey: "secret",
      audience: "test-audience",
      issuer: "test-issuer",
      algorithms: ["RS256"],
    } as JwtPolicy;

    jwtMiddleware(policy);

    expect(expressjwt).toHaveBeenCalledWith({
      secret: "secret",
      audience: "test-audience",
      issuer: "test-issuer",
      algorithms: ["RS256"],
    });
  });

  it("uses expressJwtSecret with jwksUri if provided", () => {
    const jwksUri = "https://example.com/.well-known/jwks.json";

    const policy = {
      jwksUri,
      audience: "test-audience",
      issuer: "test-issuer",
      algorithms: ["RS256"],
    } as JwtPolicy;

    const mockExpressJwtSecret = jest.fn();
    (expressJwtSecret as jest.Mock).mockImplementation(
      () => mockExpressJwtSecret,
    );

    jwtMiddleware(policy);

    expect(expressJwtSecret).toHaveBeenCalledWith({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri,
    });

    expect(expressjwt).toHaveBeenCalledWith({
      secret: mockExpressJwtSecret,
      audience: "test-audience",
      issuer: "test-issuer",
      algorithms: ["RS256"],
    });
  });
});
