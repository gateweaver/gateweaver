import path from "path";
import { Server } from "http";
import request from "supertest";
import jwt from "jsonwebtoken";
import { startServer } from "@gateweaver/server";
import { checkResponseHeaders } from "../../utils/check-response-headers";

const MOCK_PATH = "/jwt/mock";
const RATE_LIMITED_PATH = "/jwt/rate-limited";

describe("e2e - JWT Protected Endpoint", () => {
  const token = jwt.sign({}, "test-jwt-secret", {
    audience: "test-audience",
    issuer: "test-issuer",
  });

  let gateweaver: Server;

  beforeAll(async () => {
    const configPath = path.join(__dirname, "gateweaver.yml");
    gateweaver = await startServer(configPath, false);
  });

  afterAll(() => {
    gateweaver?.close();
  });

  it("should return a 200 status, correct body and headers when accessing a JWT protected endpoint with a correct Token", async () => {
    const response = await request(gateweaver)
      .get(MOCK_PATH)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Message from gateweaver query" });

    checkResponseHeaders(response);
  });

  it("should return a 401 status when a JWT protected endpoint is accessed without a Token", async () => {
    const response = await request(gateweaver).get(MOCK_PATH);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid Authorization Token" });
  });

  it("should return a 401 status when a JWT protected endpoint is accessed with an invalid Token", async () => {
    const response = await request(gateweaver)
      .get(MOCK_PATH)
      .set("Authorization", `Bearer invalid-token`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid Authorization Token" });
  });

  it("should return a 429 status when a JWT protected endpoint is rate limited", async () => {
    await request(gateweaver)
      .get(RATE_LIMITED_PATH)
      .set("Authorization", `Bearer ${token}`);
    await request(gateweaver)
      .get(RATE_LIMITED_PATH)
      .set("Authorization", `Bearer ${token}`);
    const rateLimitedResponse = await request(gateweaver)
      .get(RATE_LIMITED_PATH)
      .set("Authorization", `Bearer ${token}`);

    expect(rateLimitedResponse.status).toBe(429);
    expect(rateLimitedResponse.text).toBe(
      "Too many requests, please try again later.",
    );
  });
});
