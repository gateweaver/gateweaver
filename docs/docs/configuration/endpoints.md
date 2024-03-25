---
sidebar_position: 2
---

# Endpoints

Endpoints are the core of Gateweaver. They define the path and target URL of your API, along with the policies that should be applied to the requests.

## Configuration

Below is the structure for defining an endpoint in `gateweaver.yml`:

```yaml title="gateweaver.yml"
endpoints:
  - path: "/example_path"
    target:
      url: "https://example.com/target_path"
    transformedRequest:
      headers:
        Custom-Header: "value"
      query:
        key: "value"
    transformedResponse:
      headers:
        Custom-Response-Header: "value"
    policies:
      - cors
      - rateLimit
      - jwt
```

### Target

Defines the target URL where the request will be forwarded.

- `url`: The URL to which the request will be sent. Must be a valid URL.

### TransformedRequest (Optional)

Modifies the request before it is sent to the target.

- `headers`: An object representing headers to add, remove or replace in the request. Each key represents the header name, and its value represents the header value. (Optional)

- `query`: An object representing query parameters to add to the request. Each key represents the parameter name, and its value represents the parameter value. (Optional)

### TransformedResponse (Optional)

Modifies the response before it is sent back to the client.

- `headers`: An object representing headers to add, remove or replace in the response. Each key represents the header name, and its value represents the header value. (Optional)

### Policies (Optional)

An array of policies to apply to the request. The available policies include:

- [cors](/docs/policies/cors)
- [rateLimit](/docs/policies/rate-limiting)
- [apiKey](/docs/policies/api-key)
- [jwt](/docs/policies/jwt)

You must define the policy in the `policyDefinitions` section of the configuration file before you can reference it in the endpoint.

Powered by [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware/tree/v2.0.4#readme)
