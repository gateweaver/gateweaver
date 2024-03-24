---
sidebar_position: 2
---

# Configuration

Gateweaver uses a configuration file to define policies and endpoints. Policies are reusable configurations that can be applied to multiple endpoints. Endpoints are the routes that you want to proxy to a target URL.

## Configuration File

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

You can define policies and endpoints in the configuration file. Visit the [Policies](/docs/policies) page to learn more about policies.

## Environment Variables

To use environment variables in your configuration file, you can use the `${VAR_NAME}` syntax:

```yaml title="gateweaver.yml"
endpoints:
  - path: "/todos"
    target:
      url: "${API_URL}/todos"
```

You can use environment variables in the configuration file to make it more dynamic and reusable across different environments, or to keep sensitive information out of the configuration file.

## Configuration Options

The configuration file supports the following options:

### policyDefinitions

The `policyDefinitions` object allows you to define reusable policies that can be applied to multiple endpoints. Each policy definition should have a unique key and a set of configuration options.

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "*"
```
