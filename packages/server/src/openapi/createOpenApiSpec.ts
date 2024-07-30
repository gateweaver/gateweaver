import swaggerJsdoc from "swagger-jsdoc";
import { Config } from "../config/config.types";

export const createOpenApiSpec = async (config: Config) => {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Hello World",
      version: "1.0.0",
      description: "A sample API",
    },
    basePath: "/",
  };

  const customHandlerPaths = config.endpoints
    .filter((endpoint) => typeof endpoint.target.handler?.path === "string")
    .map((endpoint) => endpoint.target.handler?.path as string);

  const options = {
    swaggerDefinition,
    apis: [...customHandlerPaths],
  };

  const swaggerSpec = swaggerJsdoc(options);
  return swaggerSpec;
};
