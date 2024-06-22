import { IncomingMessage } from "http";
import { Request, Response, Router } from "express";
import {
  createProxyMiddleware,
  fixRequestBody,
  type Options,
} from "http-proxy-middleware";
import { PolicyOption } from "@gateweaver/policies";
import { Endpoint } from "../../../config/config.types";
import { logger } from "../../../utils/logger";

const RATE_LIMIT_HEADERS = [
  "X-Ratelimit-Limit",
  "X-Ratelimit-Remaining",
  "X-Ratelimit-Reset",
  "RateLimit-Policy",
  "RateLimit-Limit",
  "RateLimit-Remaining",
  "RateLimit-Reset",
  "RateLimit",
];

const CORS_HEADERS = [
  "Access-Control-Allow-Origin",
  "Access-Control-Allow-Credentials",
  "Access-Control-Allow-Methods",
  "Access-Control-Allow-Headers",
  "Access-Control-Expose-Headers",
  "Access-Control-Max-Age",
];

const deleteHeaders = (res: IncomingMessage, headers: string[]): void => {
  headers.forEach((header) => {
    delete res.headers[header];
    delete res.headers[header.toLowerCase()];
  });
};

export const buildTargetUrl = (endpoint: Endpoint) => {
  let url = endpoint.target.url;

  if (endpoint.request?.query) {
    const query = new URLSearchParams(endpoint.request.query);
    url += `?${query}`;
  }

  return url;
};

export const onProxyRes = (
  proxyRes: IncomingMessage,
  _req: Request,
  _res: Response,
  endpoint: Endpoint,
) => {
  proxyRes.headers = {
    ...proxyRes.headers,
    ...endpoint.response?.headers,
  };

  // Remove headers with empty values
  Object.keys(proxyRes.headers).forEach((key) => {
    if (!proxyRes.headers[key]) {
      delete proxyRes.headers[key];
    }
  });

  // Remove rate limit headers to avoid conflicts with rate limit middleware
  if (endpoint.policies?.includes(PolicyOption.RateLimit)) {
    deleteHeaders(proxyRes, RATE_LIMIT_HEADERS);
  }

  // Remove CORS headers to avoid conflicts with CORS middleware
  if (endpoint.policies?.includes(PolicyOption.Cors)) {
    deleteHeaders(proxyRes, CORS_HEADERS);
  }
};

export const setupProxy = (router: Router, endpoint: Endpoint): void => {
  const logProvider = () => {
    return {
      debug: logger.debug.bind(logger),
      log: logger.info.bind(logger),
      info: logger.info.bind(logger),
      warn: logger.warn.bind(logger),
      error: logger.error.bind(logger),
    };
  };

  const proxyOptions: Options = {
    target: buildTargetUrl(endpoint),
    changeOrigin: true,
    pathRewrite: { [`^${endpoint.path}`]: "" },
    headers: endpoint.request?.headers,
    xfwd: true,
    onProxyReq: fixRequestBody,
    onProxyRes: (proxyRes, req, res) =>
      onProxyRes(proxyRes, req, res, endpoint),
    logProvider,
    logLevel: "error",
  };

  router.use(endpoint.path, createProxyMiddleware(proxyOptions));
};
