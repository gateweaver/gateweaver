import { mockServer } from "./mocks/server";

beforeAll(async () => {
  mockServer.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
