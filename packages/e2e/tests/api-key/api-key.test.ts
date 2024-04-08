import path from "path";
import { Server } from "http";
import request from "supertest";
import { startServer } from "@gateweaver/server";
import { checkResponseHeaders } from "../../utils/check-response-headers";

const MOCK_PATH = "/api-key/mock";
const RATE_LIMITED_PATH = "/api-key/rate-limited";
const TEST_API_KEY = "test-api-key";

describe("e2e - API Key Protected Endpoint", () => {
  let gateway: Server;

  beforeAll(async () => {
    const configPath = path.join(__dirname, "gateweaver.yml");
    gateway = await startServer(configPath, false);
  });

  afterAll(() => {
    gateway?.close();
  });

  it("should return a 200 status, correct body and headers when accessing an API Key protected endpoint with a correct API Key", async () => {
    const response = await request(gateway)
      .get(MOCK_PATH)
      .set("x-api-key", TEST_API_KEY);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Message from gateway query" });

    checkResponseHeaders(response);
  });

  it("should return a 401 status when an API Key protected endpoint is accessed without an API Key", async () => {
    const response = await request(gateway).get(MOCK_PATH);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "API Key Required" });
  });

  it("should return a 401 status when an API Key protected endpoint is accessed with an invalid API Key", async () => {
    const response = await request(gateway)
      .get(MOCK_PATH)
      .set("x-api-key", "invalid-api-key");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid API Key" });
  });

  it("should return a 429 status when an API Key protected endpoint is rate limited", async () => {
    await request(gateway)
      .get(RATE_LIMITED_PATH)
      .set("x-api-key", TEST_API_KEY);
    await request(gateway)
      .get(RATE_LIMITED_PATH)
      .set("x-api-key", TEST_API_KEY);
    const rateLimitedResponse = await request(gateway)
      .get(RATE_LIMITED_PATH)
      .set("x-api-key", TEST_API_KEY);

    expect(rateLimitedResponse.status).toBe(429);
    expect(rateLimitedResponse.text).toBe(
      "Too many requests, please try again later.",
    );
  });
});
