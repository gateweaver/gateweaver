---
sidebar_position: 1
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Getting Started

Welcome to the beginning of your journey with Gateweaver!

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

You can define policies and endpoints in the configuration file. Policies are reusable configurations that can be applied to multiple endpoints. Visit the [Configuration](/docs/configuration) page to learn more.

## Environment Variables

To use environment variables in your configuration file, you can use the `${VAR_NAME}` syntax:

```yaml title="gateweaver.yml"
endpoints:
  - path: "/todos"
    target:
      url: "${API_URL}/todos"
    policies:
      - cors
```

You can set environment variables in a `.env.gateweaver` file in the root of your project:

```bash title=".env.gateweaver"
NODE_ENV=development
PORT=3000
API_URL=https://example.com
```

Visit the [Environment Variables](/docs/environment-variables) page to learn more.

## Usage

Run the following command where your `gateweaver.yml` file is located to start the Gateweaver server:

```bash
npx gateweaver start
```

If you would like to use a configuration file with a different name or path, you can specify it using the `--config` or `-c` option:

```bash
npx gateweaver start --config path/to/config.yml
```

Visit the [CLI Commands](/docs/cli-commands) page to learn more about the available commands.

## Usage with Docker

You can also run Gateweaver using Docker:

```bash
docker run \
-v ./gateweaver.yml:/prod/server/gateweaver.yml \
-p 8080:8080 \
ghcr.io/gateweaver/server:0.0.18
```

This command mounts the `gateweaver.yml` file into the Docker container and exposes the server on port 8080. You can replace `0.0.18` with the version of the Gateweaver server image you would like to use.
