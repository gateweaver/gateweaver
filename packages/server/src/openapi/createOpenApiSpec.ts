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

function collectReferencedComponents(
  pathItem: OpenAPIV3.PathItemObject,
): Set<string> {
  const references = new Set<string>();

  const operations = [
    pathItem.get,
    pathItem.put,
    pathItem.post,
    pathItem.delete,
    pathItem.options,
    pathItem.head,
    pathItem.patch,
    pathItem.trace,
  ];

  for (const operation of operations) {
    if (operation) {
      if (operation.parameters) {
        for (const param of operation.parameters) {
          if ("$ref" in param) {
            references.add(param.$ref);
          }
        }
      }

      if (operation.requestBody && "$ref" in operation.requestBody) {
        references.add(operation.requestBody.$ref);
      }

      if (operation.responses) {
        for (const [_, response] of Object.entries(operation.responses)) {
          if (response && "$ref" in response) {
            references.add(response.$ref);
          }
        }
      }

      const checkContent = (content?: OpenAPIV3.MediaTypeObject) => {
        if (content) {
          for (const [_, mediaType] of Object.entries(content)) {
            if (mediaType.schema && "$ref" in mediaType.schema) {
              references.add(mediaType.schema.$ref);
            }
          }
        }
      };

      if (operation.requestBody && "content" in operation.requestBody) {
        checkContent(operation.requestBody.content);
      }

      if (operation.responses) {
        for (const [_, response] of Object.entries(operation.responses)) {
          if (response && "content" in response) {
            checkContent(response.content);
          }
        }
      }
    }
  }

  return references;
}

const mergeComponents = (
  baseComponents: OpenAPIV3.ComponentsObject = {},
  upstreamComponents: OpenAPIV3.ComponentsObject,
  referencedComponents: Set<string>,
): OpenAPIV3.ComponentsObject => {
  const mergedComponents: OpenAPIV3.ComponentsObject = { ...baseComponents };

  const mergeComponentType = <T>(
    componentType: keyof OpenAPIV3.ComponentsObject,
    upstream: { [key: string]: T } | undefined,
    base: { [key: string]: T } | undefined,
  ): { [key: string]: T } => {
    const merged: { [key: string]: T } = { ...base };
    if (upstream) {
      for (const [key, value] of Object.entries(upstream)) {
        const refPath = `#/components/${componentType}/${key}`;
        if (referencedComponents.has(refPath)) {
          merged[key] = value;
        }
      }
    }
    return merged;
  };

  if (upstreamComponents.schemas) {
    mergedComponents.schemas = mergeComponentType(
      "schemas",
      upstreamComponents.schemas,
      baseComponents.schemas,
    );
  }
  if (upstreamComponents.responses) {
    mergedComponents.responses = mergeComponentType(
      "responses",
      upstreamComponents.responses,
      baseComponents.responses,
    );
  }
  if (upstreamComponents.parameters) {
    mergedComponents.parameters = mergeComponentType(
      "parameters",
      upstreamComponents.parameters,
      baseComponents.parameters,
    );
  }
  if (upstreamComponents.examples) {
    mergedComponents.examples = mergeComponentType(
      "examples",
      upstreamComponents.examples,
      baseComponents.examples,
    );
  }
  if (upstreamComponents.requestBodies) {
    mergedComponents.requestBodies = mergeComponentType(
      "requestBodies",
      upstreamComponents.requestBodies,
      baseComponents.requestBodies,
    );
  }
  if (upstreamComponents.headers) {
    mergedComponents.headers = mergeComponentType(
      "headers",
      upstreamComponents.headers,
      baseComponents.headers,
    );
  }
  if (upstreamComponents.securitySchemes) {
    mergedComponents.securitySchemes = mergeComponentType(
      "securitySchemes",
      upstreamComponents.securitySchemes,
      baseComponents.securitySchemes,
    );
  }
  if (upstreamComponents.links) {
    mergedComponents.links = mergeComponentType(
      "links",
      upstreamComponents.links,
      baseComponents.links,
    );
  }
  if (upstreamComponents.callbacks) {
    mergedComponents.callbacks = mergeComponentType(
      "callbacks",
      upstreamComponents.callbacks,
      baseComponents.callbacks,
    );
  }

  return mergedComponents;
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

  const referencedComponents = new Set<string>();
  for (const pathItem of Object.values(prefixedPaths)) {
    if (pathItem) {
      const references = collectReferencedComponents(pathItem);
      references.forEach((ref) => referencedComponents.add(ref));
    }
  }

  return {
    ...baseSpec,
    paths: { ...baseSpec.paths, ...prefixedPaths },
    components: upstreamSpec.components
      ? mergeComponents(
          baseSpec.components,
          upstreamSpec.components,
          referencedComponents,
        )
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
