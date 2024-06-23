---
sidebar_position: 1
---

# Global Configuration

The global configuration defines the settings that apply to all endpoints in your Proxy Server.

## Configuration

Below is the structure for defining the global configuration in your configuration file:

```yaml title="gateweaver.yml"
global:
  policies:
    - cors
    - rateLimit
  middleware:
    path: "./middleware/example-middleware.ts"
    function: "exampleMiddleware"
```

### policies (Optional)

An array of built-in policies to apply to all requests. The available policies are:

- [cors](/docs/configuration/policies/cors)
- [rateLimit](/docs/configuration/policies/rate-limit)
- [apiKey](/docs/configuration/policies/api-key)
- [jwt](/docs/configuration/policies/jwt)

### middleware (Optional)

An array of express.js middleware to apply to all requests. Each middleware is defined by the following properties:

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
