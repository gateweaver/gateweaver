---
sidebar_position: 4
---

# Environment Variables

Gateweaver supports using environment variables in your configuration file. This allows you to define dynamic values that can be set at runtime. You can use the `${VAR_NAME}` syntax to reference environment variables in your configuration file.

## Usage

Here is an example of using environment variables in a configuration file:

```yaml title="gateweaver.yml"
endpoints:
  - path: "/todos"
    target:
      url: "${API_URL}/todos"
    request:
      headers:
        Authorization: "Bearer ${API_TOKEN}"
```

To use environment variables in your local development environment, you can create a `.env.gateweaver` file. This must be created where you run the Gateweaver CLI start command.

```bash title=".env.gateweaver"
NODE_ENV=development
API_URL=https://example.com
API_TOKEN=your-api-token
```

Remember to add the `.env.gateweaver` file to your `.gitignore` file to prevent it from being committed to your repository.

In production, you can set environment variables using your hosting provider's dashboard or CLI.
