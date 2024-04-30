# Gateweaver

Gateweaver is an open-source API Proxy designed for front-end applications, enabling secure integration with APIs that require sensitive keys. Through a simple YAML configuration file, users can define endpoints and apply essential policies like CORS, rate limiting, API key management, and JWT authentication, ensuring robust security measures are in place.

Get started quickly with the CLI or Docker image, or take a look at some [examples](https://github.com/gateweaver/gateweaver/tree/main/examples) to see how you can leverage Gateweaver in your projects.

[Read the full documentation](https://gateweaver.io/docs/getting-started)

## Getting Started

### Installation

Install the Gateweaver CLI in your project using npm:

```bash
npm install @gateweaver/cli
```

or with Yarn:

```bash
yarn add @gateweaver/cli
```

or with pnpm:

```bash
pnpm add @gateweaver/cli
```

### Configuration

Create a `gateweaver.yml` file in your project:

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

Visit the [Configuration](https://gateweaver.io/docs/category/configuration) docs to learn more about the available options.

### Environment Variables

To use environment variables in your configuration file, you can use the `${VAR_NAME}` syntax:

```yaml title="gateweaver.yml"
endpoints:
  - path: "/todos"
    target:
      url: "https://example.com/todos"
    request:
      headers:
        Authorization: "Bearer ${API_KEY}"
    policies:
      - cors
```

To set environment variables locally during development, create a `.env.gateweaver` file:

```bash title=".env.gateweaver"
NODE_ENV=development
API_KEY=your-api-key
```

Remember to add the `.env.gateweaver` file to your `.gitignore` file to prevent it from being committed to your repository.

### Usage

Run the following command where your `gateweaver.yml` and `.env.gateweaver` files are located to start the Gateweaver server in watch mode. This will automatically reload the server when the configuration file changes:

```bash
npx gateweaver start -w
```

This command will start the Gateweaver server on port 8080 by default. You can specify a different port by setting the `PORT` environment variable in your `.env.gateweaver` file.

Visit the [CLI Commands](https://gateweaver.io/docs/cli) reference page to learn more about the available commands.

### Usage with Docker

You can also run the Gateweaver server using the docker hub image ([gateweaver/server](https://hub.docker.com/r/gateweaver/server)) or github container registry image ([ghcr.io/gateweaver/server](https://github.com/gateweaver/gateweaver/pkgs/container/server)).

The following command mounts the `gateweaver.yml` configuration file and uses the environment variables defined in `.env.gateweaver` to start the Gateweaver server on port 8080.

```bash
docker run \
--env-file $(pwd)/.env.gateweaver \
-v $(pwd)/gateweaver.yml:/app/gateweaver.yml \
-p 8080:8080 \
gateweaver/server:0.1.0
```
