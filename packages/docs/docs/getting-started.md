---
sidebar_position: 1
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Getting Started

Welcome to Gateweaver, the open-source API gateway that seamlessly secures your frontend applications' integration with external APIs. Designed with simplicity and protection in mind, Gateweaver enables developers to utilize APIs requiring sensitive keys and tokens without risking exposure on the frontend. Through a straightforward YAML configuration file, users can define endpoints and apply essential policies like CORS, rate limiting, API key management, and JWT authentication, ensuring robust security measures are in place. Start quickly with the Gateweaver CLI or Docker image to streamline your API usage while safeguarding your application.

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

Create a `gateweaver.yml` file in the root of your project:

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "*"

endpoints:
  - path: "/todos"
    target:
      url: "https://example.com/todos"
    policies:
      - cors
```

You can define policies and endpoints in the configuration file. Policies are reusable configurations that can be applied to multiple endpoints. Visit the [Configuration](/docs/category/configuration) page to learn more.

## Environment Variables

To use environment variables in your configuration file, you can use the `${VAR_NAME}` syntax:

```yaml title="gateweaver.yml"
endpoints:
  - path: "/todos"
    target:
      url: "https://example.com/todos"
    transformedRequest:
      headers:
        Authorization: "Bearer ${API_TOKEN}"
    policies:
      - cors
```

You can set environment variables locally in a `.env.gateweaver` file in the root of your project:

```bash title=".env.gateweaver"
NODE_ENV=development
API_TOKEN=your-api-token
```

Remember to add the `.env.gateweaver` file to your `.gitignore` file to prevent it from being committed to your repository.

## Usage

Run the following command where your `gateweaver.yml` file is located to start the Gateweaver server in watch mode. This will automatically reload the server when the configuration file changes:

```bash
npx gateweaver start -w
```

This command will start the Gateweaver server on port 8080 by default. You can specify a different port by setting the `PORT` environment variable in the `.env.gateweaver` file.

Visit the [CLI Commands](/docs/cli) reference page to learn more about the available commands.

## Usage with Docker

You can also run the Gateweaver server using the docker hub image ([gateweaver/server](https://hub.docker.com/r/gateweaver/server/tags)) or github container registry image ([ghcr.io/gateweaver/server](https://github.com/gateweaver/gateweaver/pkgs/container/server)).

The following command mounts the `gateweaver.yml` configuration file and uses the environment variables defined in `.env.gateweaver` to start the Gateweaver server on port 8080.

```bash
docker run \
--env-file $(pwd)/.env.gateweaver \
-v $(pwd)/gateweaver.yml:/app/gateweaver.yml \
-p 8080:8080 \
gateweaver/server:0.1.0
```
