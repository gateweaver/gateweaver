---
sidebar_position: 1
---

# Policy Definitions

Policies are reusable configurations that can be applied to multiple endpoints. You can define policy definitions in the `policyDefinitions` section of the configuration file.

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "http://example.com"
    methods:
      - "GET"
      - "POST"
  rateLimit: {}
```

:::tip
You can use the default configuration of a policy by setting it to an empty object `{}`. For example, `rateLimit: {}`.
:::

## Available Policies

Gateweaver provides a set of built-in policies that you can use to secure and manage your APIs.

- [cors](/docs/configuration/policies/cors)
- [rateLimit](/docs/configuration/policies/rate-limit)
- [apiKey](/docs/configuration/policies/api-key)
- [jwt](/docs/configuration/policies/jwt)
