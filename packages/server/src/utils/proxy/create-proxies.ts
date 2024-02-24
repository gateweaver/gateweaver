import { Router, Request } from "express";
import { createProxyMiddleware, type Options } from "http-proxy-middleware";
import { Endpoint } from "../../types/endpoints";
import { createHeaders } from "./create-headers";
import { createQueryParams } from "./create-query-params";

export const createProxies = (router: Router, endpoints: Endpoint[]) => {
  endpoints.forEach((endpoint) => {
    const proxyFilter = (req: Request) => req.method === endpoint.method;

    const destinationUrl =
      endpoint.destination.url + createQueryParams(endpoint.destination.params);

    const proxyOptions: Options = {
      target: destinationUrl,
      changeOrigin: true,
      pathRewrite: { [`^${endpoint.path}`]: "" },
      headers: createHeaders(endpoint.destination.headers),
    };

    router.use(
      endpoint.path,
      createProxyMiddleware((_, req) => proxyFilter(req), proxyOptions),
    );
  });
};
