import { OpenAPIV3 } from "openapi-types";
import swaggerJsdoc from "swagger-jsdoc";
import SwaggerParser from "@apidevtools/swagger-parser";
import { Config, Endpoint } from "../config/config.types";
import { logger } from "../utils/logger";

export const createBaseSpec = async (
  config: Config,
): Promise<OpenAPIV3.Document> => {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Gateweaver API",
      version: "1.0.0",
      description: "API Gateway powered by Gateweaver",
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
  return swaggerSpec as OpenAPIV3.Document;
};

const prefixPaths = (
  paths: OpenAPIV3.PathsObject,
  prefix: string,
): OpenAPIV3.PathsObject => {
  const prefixedPaths: OpenAPIV3.PathsObject = {};
  for (const [path, pathItem] of Object.entries(paths)) {
    prefixedPaths[`${prefix}${path}`] = pathItem;
  }
  return prefixedPaths;
};

const mergeComponents = (
  baseComponents: OpenAPIV3.ComponentsObject = {},
  upstreamComponents: OpenAPIV3.ComponentsObject,
): OpenAPIV3.ComponentsObject => {
  return {
    schemas: { ...baseComponents.schemas, ...upstreamComponents.schemas },
    responses: { ...baseComponents.responses, ...upstreamComponents.responses },
    parameters: {
      ...baseComponents.parameters,
      ...upstreamComponents.parameters,
    },
    examples: { ...baseComponents.examples, ...upstreamComponents.examples },
    requestBodies: {
      ...baseComponents.requestBodies,
      ...upstreamComponents.requestBodies,
    },
    headers: { ...baseComponents.headers, ...upstreamComponents.headers },
    securitySchemes: {
      ...baseComponents.securitySchemes,
      ...upstreamComponents.securitySchemes,
    },
    links: { ...baseComponents.links, ...upstreamComponents.links },
    callbacks: { ...baseComponents.callbacks, ...upstreamComponents.callbacks },
  };
};

const filterPaths = (
  paths: OpenAPIV3.PathsObject,
  includePaths: string[] | undefined,
): OpenAPIV3.PathsObject => {
  if (!includePaths) {
    return paths;
  }

  const filteredPaths: OpenAPIV3.PathsObject = {};
  for (const path of includePaths) {
    if (paths[path]) {
      filteredPaths[path] = paths[path];
    } else {
      logger.warn(
        `Path "${path}" specified in includePaths does not exist in the upstream OpenAPI spec.`,
      );
    }
  }
  return filteredPaths;
};

const mergeProxySpec = async (
  baseSpec: OpenAPIV3.Document,
  endpoint: Endpoint,
): Promise<OpenAPIV3.Document> => {
  if (!endpoint.target.openapi) {
    return baseSpec;
  }

  const { source, includePaths } = endpoint.target.openapi;

  const upstreamSpec = (await SwaggerParser.parse(
    source,
  )) as OpenAPIV3.Document;

  const filteredPaths = filterPaths(upstreamSpec.paths, includePaths);
  const prefixedPaths = prefixPaths(filteredPaths, endpoint.path);

  return {
    ...baseSpec,
    paths: { ...baseSpec.paths, ...prefixedPaths },
    components: upstreamSpec.components
      ? mergeComponents(baseSpec.components, upstreamSpec.components)
      : baseSpec.components,
  };
};

export const createOpenApiSpec = async (
  config: Config,
): Promise<OpenAPIV3.Document> => {
  const baseSpec = await createBaseSpec(config);

  let openApiSpec: OpenAPIV3.Document = { ...baseSpec };

  for (const endpoint of config.endpoints) {
    if (endpoint.target.url && endpoint.target.openapi) {
      openApiSpec = await mergeProxySpec(openApiSpec, endpoint);
    }
  }

  logger.info("Created OpenAPI spec");

  return openApiSpec;
};
