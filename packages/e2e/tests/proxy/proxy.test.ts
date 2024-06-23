import path from "path";
import { Server } from "http";
import request from "supertest";
import { startServer } from "@gateweaver/server";
import { checkResponseHeaders } from "../../utils/check-response-headers";

const MOCK_PATH = "/proxy/mock";
const RATE_LIMITED_PATH = "/proxy/rate-limited";
const HANDLER_PATH = "/proxy/handler";

describe("e2e - Proxy Endpoint", () => {
  let gateweaver: Server;

  beforeAll(async () => {
    const configPath = path.join(__dirname, "gateweaver.yml");
    gateweaver = await startServer(configPath, false);
  });

  afterAll(() => {
    gateweaver?.close();
  });

  it("should return a 200 status, correct body and headers when accessing a GET endpoint", async () => {
    const response = await request(gateweaver).get(MOCK_PATH);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Message from gateweaver query" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a POST endpoint", async () => {
    const response = await request(gateweaver)
      .post(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a PUT endpoint", async () => {
    const response = await request(gateweaver)
      .put(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a PATCH endpoint", async () => {
    const response = await request(gateweaver)
      .patch(MOCK_PATH)
      .send({ name: "Gateweaver" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello, Gateweaver!" });

    checkResponseHeaders(response);
  });

  it("should return a 200 status, correct body and headers when accessing a DELETE endpoint", async () => {
    const response = await request(gateweaver).delete(MOCK_PATH);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Delete message from mock server",
    });

    checkResponseHeaders(response);
  });

  it("should return a 429 status when an endpoint is rate limited", async () => {
    await request(gateweaver).get(RATE_LIMITED_PATH);
    await request(gateweaver).get(RATE_LIMITED_PATH);
    const rateLimitedResponse =
      await request(gateweaver).get(RATE_LIMITED_PATH);

    expect(rateLimitedResponse.status).toBe(429);
    expect(rateLimitedResponse.text).toBe(
      "Too many requests, please try again later.",
    );
  });

  it("should return a 200 status and correct response when accessing an endpoint with a custom handler and middleware", async () => {
    const response = await request(gateweaver)
      .get(HANDLER_PATH)
      .set("x-test", "test");

    expect(response.status).toBe(200);
    expect(response.text).toBe("This is a custom handler response");
  });

  it("should return a 403 status when accessing an endpoint with the custom test middleware without the required header", async () => {
    const response = await request(gateweaver).get(HANDLER_PATH);

    expect(response.status).toBe(403);
    expect(response.text).toBe("Forbidden");
  });
});
