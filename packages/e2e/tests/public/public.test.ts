import path from "path";
import { Server } from "http";
import request from "supertest";
import { startServer } from "@gateweaver/server";
import { checkResponseHeaders } from "../../utils/check-response-headers";

const MOCK_PATH = "/public/mock";
const HANDLER_PATH = "/public/handler";
const RATE_LIMITED_PATH = "/public/rate-limited";

describe("e2e - Public Endpoint", () => {
  let gateweaver: Server;

  beforeAll(async () => {
    const configPath = path.join(__dirname, "gateweaver.yml");
    gateweaver = await startServer(configPath, false);
  });

  afterAll(() => {
    gateweaver?.close();
  });

  it("should return a 200 status, correct body and headers when accessing a public GET endpoint", async () => {
    const response = await request(gateweaver).get(MOCK_PATH);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Message from gateweaver query" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public POST endpoint", async () => {
    const response = await request(gateweaver)
      .post(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public PUT endpoint", async () => {
    const response = await request(gateweaver)
      .put(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public PATCH endpoint", async () => {
    const response = await request(gateweaver)
      .patch(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public DELETE endpoint", async () => {
    const response = await request(gateweaver).delete(MOCK_PATH);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Delete message from mock server",
    });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a public endpoint with a custom handler", async () => {
    const response = await request(gateweaver).get(HANDLER_PATH);

    expect(response.status).toBe(200);
    expect(response.text).toBe("This is a custom handler response");
  });

  it("should return a 429 status when a public endpoint is rate limited", async () => {
    await request(gateweaver).get(RATE_LIMITED_PATH);
    await request(gateweaver).get(RATE_LIMITED_PATH);
    const rateLimitedResponse =
      await request(gateweaver).get(RATE_LIMITED_PATH);

    expect(rateLimitedResponse.status).toBe(429);
    expect(rateLimitedResponse.text).toBe(
      "Too many requests, please try again later.",
    );
  });
});
