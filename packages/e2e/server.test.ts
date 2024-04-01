import { getLocal } from "mockttp";
import superagent from "superagent";
import { startServer } from "@gateweaver/server";
import { Server } from "http";

describe("e2e server tests", () => {
  const mockServer = getLocal();
  let gatewayServer: Server | null = null;

  beforeAll(async () => {
    mockServer.start(5001);
    mockServer.forGet("/mock").thenReply(200, "A mocked response");

    gatewayServer = await startServer("gateweaver", false);
  });

  afterAll(() => {
    mockServer.stop();
    gatewayServer?.close();
  });

  it("lets you mock requests, and assert on the results", async () => {
    const response = await superagent.get("http://localhost:6001/test");

    expect(response.text).toEqual("A mocked response");
  });
});
