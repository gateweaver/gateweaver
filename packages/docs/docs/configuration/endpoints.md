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
    request:
      headers:
        Add-Header: "value"
        Remove-Header: ""
        Replace-Header: "new value"
      query:
        key: "value"
    response:
      headers:
        Add-Header: "value"
        Remove-Header: ""
        Replace-Header: "new value"
    policies:
      - cors
      - rateLimit
      - jwt
```

### path

Defines the path of the endpoint. Requests to this path will be forwarded to the target URL.

- `String`: The path of the endpoint. For example, `"/todos"`.

**Note:** The path must start with a `/` and then only contain alphanumeric characters, hyphens, and underscores.

### target

Defines the target URL where the request will be forwarded.

- `url`: The URL to which the request will be sent. Must be a valid URL.

### request (Optional)

Modifies the request before it is sent to the target.

- `headers`: Key-value pairs representing headers to add, remove or replace in the request. Each key represents the header name, and its value represents the header value. (Optional)

**Note:** If you want to remove a header, set its value to an empty string (`""`). If you want to replace a header, set its value to the new header value.

- `query`: Key-value pairs representing query parameters to add to the request. Each key represents the query parameter name, and its value represents the query parameter value. (Optional)

### response (Optional)

Modifies the response before it is sent back to the client.

- `headers`: Key-value pairs representing headers to add, remove or replace in the response. Each key represents the header name, and its value represents the header value. (Optional)

**Note:** If you want to remove a header, set its value to an empty string (`""`). If you want to replace a header, set its value to the new header value.

### policies (Optional)

An array of policies to apply to the request. The available policies include:

- [cors](/docs/configuration/policies/cors)
- [rateLimit](/docs/configuration/policies/rate-limit)
- [apiKey](/docs/configuration/policies/api-key)
- [jwt](/docs/configuration/policies/jwt)

You must define the policy in the `policyDefinitions` section of the configuration file before you can reference it in an endpoint.

Powered by [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware/tree/v2.0.4#readme)
