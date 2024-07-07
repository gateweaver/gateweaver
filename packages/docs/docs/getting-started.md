---
sidebar_position: 1
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Getting Started

Gateweaver is an open-source Backend for Frontend (BFF) framework built on Express.js, designed to streamline the connection between your frontend applications and backend services. It allows you to create a tailored API layer that simplifies frontend development while enhancing security and performance.

## Key Features

- **API Aggregation**: Easily proxy and combine multiple backend services into a single, frontend-friendly API.
- **Security Enhancement**: Hide API keys and sensitive data from the client-side.
- **Flexible Configuration**: Use a simple YAML file to define endpoints and apply policies.
- **Built-in Policies**: Includes ready-to-use policies for CORS, JWT validation, and rate limiting.
- **Customization**: Extend functionality with custom Express middleware and handlers.
- **Easy Development**: Get started quickly with the node CLI or Docker image.

## Why Gateweaver for BFF?

- **Simplify Frontend Development**: Tailor your API responses to exactly what your frontend needs.
- **Improve Security**: Keep sensitive backend logic and credentials away from the client.
- **Enhance Performance**: Optimize API calls and reduce frontend complexity.
- **Flexible and Lightweight**: Easy to set up and adapt to your specific use case.

## Installation

Install the Gateweaver CLI in your project:

<Tabs>
  <TabItem value="npm" label="npm">
    ```bash 
    npm install @gateweaver/cli
    ```
  </TabItem>
  <TabItem value="yarn" label="Yarn">
    ```bash 
    yarn add @gateweaver/cli
    ```
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
    ```bash 
    pnpm add @gateweaver/cli
    ```
  </TabItem>
</Tabs>

## Configuration

Create a `gateweaver.yml` file in your project:

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "http://localhost:3000"

global:
  policies:
    - cors

endpoints:
  - path: "/proxy"
    target:
      url: "https://jsonplaceholder.typicode.com"
```

This example configuration creates a BFF that proxies all requests to JSONPlaceholder. For example:

- https://jsonplaceholder.typicode.com/todos becomes http://localhost:8080/proxy/todos
- https://jsonplaceholder.typicode.com/posts becomes http://localhost:8080/proxy/posts
- ... and any other [JSONPlaceholder](https://jsonplaceholder.typicode.com) endpoint

Visit the [Configuration](/docs/category/configuration) docs to learn more about the available options.

## Environment Variables

To use environment variables in your configuration file, you can use the `${VAR_NAME}` syntax. Let's update our configuration to use environment variables for CORS origin and add a new endpoint that uses a bearer token:

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "${CORS_ORIGIN}"

global:
  policies:
    - cors

endpoints:
  - path: "/proxy"
    target:
      url: "https://jsonplaceholder.typicode.com"
  - path: "/secure"
    target:
      url: "https://httpbin.org/bearer"
    request:
      headers:
        Authorization: "Bearer ${API_KEY}"
```

This creates a new endpoint `/secure` that proxies requests to [httpbin.org/bearer](https://httpbin.org/#/Auth/get_bearer) with a bearer token in the request headers.

To set environment variables locally during development, create a `.env.gateweaver` file:

```bash title=".env.gateweaver"
CORS_ORIGIN=http://localhost:3000
API_KEY=your-api-key
```

Remember to add the `.env.gateweaver` file to your `.gitignore` file to prevent it from being committed to your repository.

## Custom Middleware and Handlers

Gateweaver allows you to extend its functionality with custom middleware and handlers. Here's how to use them:

1. Create a custom middleware file at `middleware/custom-middleware.ts`:

```typescript title="middleware/custom-middleware.ts"
import { Request, Response, NextFunction } from "express";

export function customMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.headers["x-test"] === "test") {
    return next();
  }

  return res.status(403).send("Forbidden");
}
```

This middleware checks for a custom header `x-test` with the value `test` and allows the request to continue if it matches. It will occur before the request reaches the target endpoint.

2. Create a custom handler file at `handlers/custom-handler.ts`:

```typescript title="handlers/custom-handler.ts"
import { Request, Response } from "express";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface TransformedPost {
  id: number;
  title: string;
  snippet: string;
}

export const customHandler = async (_: Request, res: Response) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch posts: ${response.status} ${response.statusText}`,
      );
    }
    const posts: Post[] = await response.json();

    const transformedPosts: TransformedPost[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      snippet: post.body.slice(0, 100) + (post.body.length > 100 ? "..." : ""),
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
```

3. Update your gateweaver.yml to include these custom components:

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "${CORS_ORIGIN}"

global:
  policies:
    - cors

endpoints:
  - path: "/proxy"
    target:
      url: "https://jsonplaceholder.typicode.com"
  - path: "/secure"
    target:
      url: "https://httpbin.org/bearer"
    request:
      headers:
        Authorization: "Bearer ${API_KEY}"
  - path: "/middleware"
    target:
      url: "https://httpbin.org/headers"
    middleware:
      - path: "./middleware/custom-middleware.ts"
        function: "customMiddleware"
  - path: "/handler"
    target:
      handler:
        path: "./handlers/custom-handler.ts"
        function: "customHandler"
```

This configuration now includes:

- A proxy endpoint for all JSONPlaceholder requests
- A secure endpoint using a bearer token
- An endpoint with custom middleware
- A custom handler endpoint

## Usage

Run the following command where your `gateweaver.yml` and `.env.gateweaver` files are located to start the Gateweaver server in watch mode. This will automatically reload the server when the configuration file changes:

```bash
npx gateweaver start -w
```

This command will start the Gateweaver server on port 8080 by default. You can specify a different port by setting the `PORT` environment variable in your `.env.gateweaver` file.

Your BFF is now running and you can access:

- http://localhost:8080/proxy/todos for todos data
- http://localhost:8080/proxy/posts for post data
- http://localhost:8080/secure for the secure endpoint (requires API_KEY)
- http://localhost:8080/middleware for the middleware-protected endpoint (requires x-test header)
- http://localhost:8080/handler for the custom handler endpoint

Visit the [CLI Commands](/docs/cli) reference page to learn more about the available commands.

## Usage with Docker

You can also run the Gateweaver server using the docker hub image ([gateweaver/server](https://hub.docker.com/r/gateweaver/server)) or github container registry image ([ghcr.io/gateweaver/server](https://github.com/gateweaver/gateweaver/pkgs/container/server)).

The following command mounts the `gateweaver.yml` configuration file and uses the environment variables defined in `.env.gateweaver` to start the Gateweaver server on port 8080.

```bash
docker run \
--env-file $(pwd)/.env.gateweaver \
-v $(pwd)/gateweaver.yml:/app/gateweaver.yml \
-p 8080:8080 \
gateweaver/server:0.1.0
```
