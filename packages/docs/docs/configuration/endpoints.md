---
sidebar_position: 2
---

# Endpoints

An endpoint is a specific URL within your Server that accepts requests. Each endpoint is defined by a path, a target, and optional request and response modifications. You can also apply policies and middleware to an endpoint to enforce security, rate limiting, and other requirements.

## Configuration

Below is the structure for defining an endpoint in your configuration file:

```yaml title="gateweaver.yml"
endpoints:
  - path: "/example"
    target:
      url: "https://example.com/target"
    request:
      headers:
        add-header: "value"
        remove-header: ""
        replace-header: "new value"
      query:
        key: "value"
    response:
      headers:
        add-header: "value"
        remove-header: ""
        replace-header: "new value"
    policies:
      - cors
      - rateLimit
      - jwt
    middleware:
      path: "./middleware/example-middleware.ts"
      function: "exampleMiddleware"
```

### path

Defines the path of the endpoint.

- `String`: The path of the endpoint. For example, `"/todos"`.

**Note:** The path must start with a `/` and then only contain alphanumeric characters, hyphens, and underscores.

### target

Defines where the request should be forwarded to. You can specify a URL to proxy the request to, or you can specify an express.js handler function to process the request.

- `url`: The URL to which the request will be sent. Must be a valid URL.
- `handler`:
  - `path`: The path to the handler file. For example, `"./handlers/example-handler.ts"`.
  - `function`: The function name of the handler. For example, `"exampleHandler"`.

```typescript title="example-handler.ts"
import { Request, Response } from "express";

export const exampleHandler = (req: Request, res: Response) => {
  res.send("Hello, world!");
};
```

:::note
To use express.js types in your handler, you need to install the `@types/express` package. You can install it by running `npm install --save-dev @types/express`.
:::

### request (Optional)

Modifies the request before it is sent to the target.

- `headers`: Key-value pairs representing headers to add, remove or replace in the request. Each key represents the header name, and its value represents the header value. (Optional)

**Note:** If you want to remove a header, set its value to an empty string (`""`). If you want to replace a header, set its value to the new header value.

- `query`: Key-value pairs representing query parameters to add to the request. Each key represents the query parameter name, and its value represents the query parameter value. (Optional)

### response (Optional)

Modifies the response before it is sent back to the client.

- `headers`: Key-value pairs representing headers to add, remove or replace in the response. Each key represents the header name, and its value represents the header value. (Optional)

**Note:** If you want to remove a header, set its value to an empty string (`""`). If you want to replace a header, set its value to the new header value.

### policies (Optional)

An array of built-in policies to apply to the request. The available policies are:

- [cors](/docs/configuration/policies/cors)
- [rateLimit](/docs/configuration/policies/rate-limit)
- [apiKey](/docs/configuration/policies/api-key)
- [jwt](/docs/configuration/policies/jwt)

### middleware (Optional)

An array of express.js middleware to apply to the request. These middleware are executed before the request is proxied to the target server.

Each middleware is defined by the following properties:

- `path`: The path to the middleware file. For example, `"./middleware/example-middleware.ts"`.
- `function`: The function name of the middleware. For example, `"exampleMiddleware"`.

```typescript title="example-middleware.ts"
import { Request, Response, NextFunction } from "express";

export const exampleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Middleware executed!");
  next();
};
```

:::note
To use express.js types in your middleware, you need to install the `@types/express` package. You can install it by running `npm install --save-dev @types/express`.
:::

Powered by [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware/tree/v2.0.4#readme)
