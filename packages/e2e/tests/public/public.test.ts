import path from "path";
import { Server } from "http";
import request from "supertest";
import { startServer } from "@gateweaver/server";
import { checkResponseHeaders } from "../../utils/check-response-headers";

const MOCK_PATH = "/public/mock";
const RATE_LIMITED_PATH = "/public/rate-limited";

describe("e2e - Public Endpoint", () => {
  let gateway: Server;

  beforeAll(async () => {
    const configPath = path.join(__dirname, "gateweaver.yml");
    gateway = await startServer(configPath, false);
  });

  afterAll(() => {
    gateway?.close();
  });

  it("should return a 200 status, correct body and headers when accessing a public GET endpoint", async () => {
    const response = await request(gateway).get(MOCK_PATH);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Message from gateway query" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public POST endpoint", async () => {
    const response = await request(gateway)
      .post(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public PUT endpoint", async () => {
    const response = await request(gateway)
      .put(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public PATCH endpoint", async () => {
    const response = await request(gateway)
      .patch(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public DELETE endpoint", async () => {
    const response = await request(gateway).delete(MOCK_PATH);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Delete message from mock server",
    });

    checkResponseHeaders(response);
  });

  it("should return a 429 status when a public endpoint is rate limited", async () => {
    await request(gateway).get(RATE_LIMITED_PATH);
    await request(gateway).get(RATE_LIMITED_PATH);
    const rateLimitedResponse = await request(gateway).get(RATE_LIMITED_PATH);

    expect(rateLimitedResponse.status).toBe(429);
    expect(rateLimitedResponse.text).toBe(
      "Too many requests, please try again later.",
    );
  });
});
