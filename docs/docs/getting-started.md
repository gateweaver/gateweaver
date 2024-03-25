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
PORT=8080
API_URL=https://example.com
```

## Usage

Run the following command where your `gateweaver.yml` file is located to start the Gateweaver server in watch mode. This will automatically reload the server when the configuration file changes:

```bash
npx gateweaver start -w
```

If you would like to use a configuration file with a different name or path, you can specify it using the `--config` or `-c` option:

```bash
npx gateweaver start -w -c path/to/config.yml
```

Visit the [CLI Commands](/docs/cli-commands) reference page to learn more about the available commands.

## Usage with Docker

You can also run the Gateweaver server using Docker:

```bash
docker run \
--env-file ./env.gateweaver \
-v $(pwd)/gateweaver.yml:/prod/server/gateweaver.yml \
-p 8080:8080 \
ghcr.io/gateweaver/server:0.0.18
```

This command mounts the `gateweaver.yml` configuration file and uses the environment variables defined in the `.env.gateweaver` file.

## Next Steps

Now that you have Gateweaver set up, you can start defining your policies and endpoints in the configuration file. Visit the [Configuration](/docs/configuration) page to learn more about the available options.
