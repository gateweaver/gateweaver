import { Config } from "./types";
import { validateConfig } from "./validate";

describe("validateConfig", () => {
  it("should not throw an error if config is valid", () => {
    const validConfig: Config = {
      endpoints: [
        {
          name: "endpoint1",
          method: "GET",
          path: "/path1",
          destination: {
            url: "http://example.com",
          },
        },
        {
          name: "endpoint2",
          method: "POST",
          path: "/path2",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(validConfig)).not.toThrow();
  });

  it("should throw an error if endpoint names are duplicated", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
          name: "duplicate",
          method: "GET",
          path: "/path1",
          destination: {
            url: "http://example.com",
          },
        },
        {
          name: "duplicate",
          method: "GET",
          path: "/path2",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow();
  });

  it("should throw an error if endpoint path/method combination is duplicated", () => {
    const invalidConfig: Config = {
      endpoints: [
        {
          name: "endpoint1",
          method: "GET",
          path: "/duplicate",
          destination: {
            url: "http://example.com",
          },
        },
        {
          name: "endpoint2",
          method: "GET",
          path: "/duplicate",
          destination: {
            url: "http://example.com",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidConfig)).toThrow();
  });

  it("should throw an error if destination URL is invalid", () => {
    const invalidUrlConfig: Config = {
      endpoints: [
        {
          name: "endpoint",
          method: "GET",
          path: "/path",
          destination: {
            url: "invalid_url",
          },
        },
      ],
    };

    expect(() => validateConfig(invalidUrlConfig)).toThrow();
  });
});
