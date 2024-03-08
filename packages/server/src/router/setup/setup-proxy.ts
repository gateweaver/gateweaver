import { IncomingMessage } from "http";
import { Router } from "express";
import { createProxyMiddleware, type Options } from "http-proxy-middleware";
import { PolicyOption } from "@endpointly/policies";
import { logger } from "@endpointly/utils";
import { Endpoint } from "../../config/config.types";

const deleteHeaders = (res: IncomingMessage, headers: string[]) => {
  headers.forEach((header) => {
    delete res.headers[header];
    delete res.headers[header.toLowerCase()];
  });
};

export const setupProxy = (router: Router, endpoint: Endpoint) => {
  const buildDestinationUrl = () => {
    let url = endpoint.destination.url;

    if (endpoint.transformedRequest?.query) {
      const query = new URLSearchParams(endpoint.transformedRequest.query);
      url += `?${query}`;
    }

    return url;
  };

  const onProxyRes = (res: IncomingMessage) => {
    res.headers = {
      ...res.headers,
      ...endpoint.transformedResponse?.headers,
    };

    Object.keys(res.headers).forEach((key) => {
      if (!res.headers[key]) {
        delete res.headers[key];
      }
    });

    if (endpoint.policies?.includes(PolicyOption.RateLimit)) {
      deleteHeaders(res, [
        "X-Ratelimit-Limit",
        "X-Ratelimit-Remaining",
        "X-Ratelimit-Reset",
      ]);
    }

    if (endpoint.policies?.includes(PolicyOption.Cors)) {
      deleteHeaders(res, [
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Access-Control-Expose-Headers",
        "Access-Control-Max-Age",
      ]);
    }
  };

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
    target: buildDestinationUrl(),
    changeOrigin: true,
    pathRewrite: { [`^${endpoint.path}`]: "" },
    headers: endpoint.transformedRequest?.headers,
    xfwd: true,
    onProxyRes,
    logProvider,
    logLevel: "error",
  };

  router.use(
    endpoint.path,
    createProxyMiddleware(
      (_, req) => req.method === endpoint.method,
      proxyOptions,
    ),
  );
};
