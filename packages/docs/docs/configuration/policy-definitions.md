---
sidebar_position: 3
---

# Policy Definitions

Policies are reusable middleware that can be applied to multiple endpoints. You can configure policies in the `policyDefinitions` section of your configuration file.

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "https://example-origin.com"
    methods:
      - "GET"
      - "POST"
  rateLimit:
    windowMs: 300000
    limit: 100
    message: "You have exceeded the 100 requests in 5 minutes limit!"
```

## Available Policies

Gateweaver provides a set of built-in policies that you can use to secure and manage your APIs.

- [cors](/docs/configuration/policies/cors)
- [rateLimit](/docs/configuration/policies/rate-limit)
- [apiKey](/docs/configuration/policies/api-key)
- [jwt](/docs/configuration/policies/jwt)
