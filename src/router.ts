import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { parseConfig } from "./utils/parse-config";

const config = parseConfig("config.yml");

const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.get("/config", (_, res) => {
    res.send(config);
  });
}

config.endpoints.forEach((endpoint) => {
  router.use(
    endpoint.path,
    createProxyMiddleware({
      target: endpoint.destination.url,
      changeOrigin: true,
      pathRewrite: {
        [`^${endpoint.path}`]: "",
      },
    }),
  );
});

export { router };
