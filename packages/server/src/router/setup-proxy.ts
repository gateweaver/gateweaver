import { Router, Request } from "express";
import { createProxyMiddleware, type Options } from "http-proxy-middleware";
import { Endpoint } from "../config/types";
import { Destination } from "../config/types";

interface Headers {
  [key: string]: string;
}

const createHeaders = (headers: Destination["headers"]): Headers => {
  if (!headers) {
    return {};
  }

  const result: Headers = {};

  headers.forEach((header) => {
    result[header.key] = header.value;
  });

  return result;
};

const createQueryParams = (params: Endpoint["destination"]["params"]) => {
  if (!params) {
    return "";
  }

  return "?" + params.map((param) => `${param.key}=${param.value}`).join("&");
};

export const setupProxy = (router: Router, endpoint: Endpoint) => {
  const proxyFilter = (req: Request) => req.method === endpoint.method;

  const destinationUrl =
    endpoint.destination.url + createQueryParams(endpoint.destination.params);

  const proxyOptions: Options = {
    target: destinationUrl,
    changeOrigin: true,
    pathRewrite: { [`^${endpoint.path}`]: "" },
    headers: createHeaders(endpoint.destination.headers),
    onProxyRes: (proxyRes) => {
      proxyRes.headers = {};
    },
  };

  router.use(
    endpoint.path,
    createProxyMiddleware((_, req) => proxyFilter(req), proxyOptions),
  );
};
