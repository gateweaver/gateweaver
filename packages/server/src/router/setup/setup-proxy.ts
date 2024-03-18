import { IncomingMessage } from "http";
import { Router } from "express";
import { createProxyMiddleware, type Options } from "http-proxy-middleware";
import { PolicyOption } from "@gateweaver/policies";
import { Endpoint } from "../../config/config.types";
import { logger } from "../../utils";

const deleteHeaders = (res: IncomingMessage, headers: string[]) => {
  headers.forEach((header) => {
    delete res.headers[header];
    delete res.headers[header.toLowerCase()];
  });
};

export const setupProxy = (router: Router, endpoint: Endpoint) => {
  const buildTargetUrl = () => {
    let url = endpoint.target.url;

    if (endpoint.transformedRequest?.query) {
      const query = new URLSearchParams(endpoint.transformedRequest.query);
      url += `?${query}`;
    }

    return url;
  };

  const onProxyRes = (proxyRes: IncomingMessage) => {
    proxyRes.headers = {
      ...proxyRes.headers,
      ...endpoint.transformedResponse?.headers,
    };

    Object.keys(proxyRes.headers).forEach((key) => {
      if (!proxyRes.headers[key]) {
        delete proxyRes.headers[key];
      }
    });

    if (endpoint.policies?.includes(PolicyOption.RateLimit)) {
      deleteHeaders(proxyRes, [
        "X-Ratelimit-Limit",
        "X-Ratelimit-Remaining",
        "X-Ratelimit-Reset",
      ]);
    }

    if (endpoint.policies?.includes(PolicyOption.Cors)) {
      deleteHeaders(proxyRes, [
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
    target: buildTargetUrl(),
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
