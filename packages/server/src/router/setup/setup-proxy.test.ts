import { IncomingMessage } from "http";
import { Router, Request, Response } from "express";
import { setupProxy, buildTargetUrl, onProxyRes } from "./setup-proxy";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { Endpoint } from "../../config/config.types";
import { PolicyOption } from "@gateweaver/policies";

jest.mock("express", () => ({
  Router: () => ({
    use: jest.fn(),
  }),
}));

jest.mock("http-proxy-middleware", () => ({
  createProxyMiddleware: jest.fn(),
  fixRequestBody: jest.fn(),
}));

describe("buildTargetUrl", () => {
  it("should build target URL with query parameters", () => {
    const endpoint: Endpoint = {
      path: "/api",
      target: {
        url: "https://example.com",
      },
      request: {
        query: {
          param1: "value1",
          param2: "value2",
        },
      },
    };

    const url = buildTargetUrl(endpoint);

    expect(url).toEqual("https://example.com?param1=value1&param2=value2");
  });
});

describe("onProxyRes", () => {
  const req = {} as Request;
  const res = {} as Response;

  const createMockProxyRes = (headers: Record<string, string>) => {
    const proxyRes = {
      headers,
    } as IncomingMessage;

    return proxyRes;
  };

  it("should remove rate limit headers if RateLimit policy is applied", () => {
    const proxyRes = createMockProxyRes({
      "x-ratelimit-limit": "1000",
      "x-ratelimit-remaining": "500",
      "x-ratelimit-reset": "158300000",
    });

    const endpoint: Endpoint = {
      path: "/api",
      target: {
        url: "https://example.com",
      },
      policies: [PolicyOption.RateLimit],
    };

    onProxyRes(proxyRes, req, res, endpoint);

    expect(proxyRes.headers["x-ratelimit-limit"]).toBeUndefined();
    expect(proxyRes.headers["x-ratelimit-remaining"]).toBeUndefined();
    expect(proxyRes.headers["x-ratelimit-reset"]).toBeUndefined();
  });

  it("should remove CORS headers if Cors policy is applied", () => {
    const proxyRes = createMockProxyRes({
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true",
    });

    const endpoint: Endpoint = {
      path: "/api",
      target: {
        url: "https://example.com",
      },
      policies: [PolicyOption.Cors],
    };

    onProxyRes(proxyRes, req, res, endpoint);

    expect(proxyRes.headers["access-control-allow-origin"]).toBeUndefined();
    expect(
      proxyRes.headers["access-control-allow-credentials"],
    ).toBeUndefined();
  });

  it("should add response headers defined in the endpoint", () => {
    const proxyRes = createMockProxyRes({});
    const endpoint: Endpoint = {
      path: "/api",
      target: {
        url: "https://example.com",
      },
      response: {
        headers: {
          "x-custom-header": "value",
        },
      },
    };

    onProxyRes(proxyRes, req, res, endpoint);

    expect(proxyRes.headers["x-custom-header"]).toEqual("value");
  });

  it("should remove headers with empty values", () => {
    const proxyRes = createMockProxyRes({
      "x-empty-header": "",
    });

    const endpoint: Endpoint = {
      path: "/api",
      target: {
        url: "https://example.com",
      },
    };

    onProxyRes(proxyRes, req, res, endpoint);

    expect(proxyRes.headers["x-empty-header"]).toBeUndefined();
  });
});

describe("setupProxy", () => {
  const router = Router();

  it("should setup proxy middleware", () => {
    const endpoint = {
      path: "/api",
      target: {
        url: "https://example.com",
      },
    };

    setupProxy(router, endpoint);

    expect(createProxyMiddleware).toHaveBeenCalledWith(
      expect.objectContaining({
        target: "https://example.com",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
        xfwd: true,
        onProxyReq: fixRequestBody,
        onProxyRes: expect.any(Function),
      }),
    );
  });
});
