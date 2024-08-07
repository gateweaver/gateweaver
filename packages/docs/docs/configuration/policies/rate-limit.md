---
sidebar_position: 2
---

# Rate Limit

The Rate limit policy allows you to control the rate at which requests to your Server can be made, preventing abuse and ensuring fair use of resources.

## Options

### rateLimitBy

Determines what method to use for rate limiting.

- `"ip"`: rate limit based on the client's IP address.
- `"jwt"`: rate limit based on the provided JWT token. It uses the `sub` claim as the identifier.
- `"apiKey"`: rate limit based on the provided API key in the `x-api-key` header.

**Default**: `"ip"`.

**Important:** When selecting either the jwt or apiKey options, ensure that you have also set up the corresponding [jwt](/docs/configuration/policies/jwt) or [apiKey](/docs/configuration/policies/api-key) policies, respectively, to prevent any unexpected issues.

### windowMs

Time frame for which requests are checked/remembered in milliseconds.

- `Number`: time in milliseconds.

**Default**: `60000` (1 minute).

### limit

The maximum number of requests allowed during the `windowMs` before rate limiting the client.

- `Number`: the limit value.

**Default**: `5`.

### message

The response message sent back when a client is rate limited.

- `String`: the message content.

**Default**: `"Too many requests, please try again later."`.

### statusCode

The HTTP status code sent back when a client is rate limited.

- `Number`: the status code.

**Default**: `429`.

### legacyHeaders

Whether to send legacy rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) on all responses. If set to `true`, the `Retry-After` header will also be sent on all blocked requests.

- `Boolean`: `true` to enable, `false` to disable.

**Default**: `false`.

### standardHeaders

Whether to enable support for headers conforming to the [RateLimit header fields for HTTP standardization draft](https://github.com/ietf-wg-httpapi/ratelimit-headers) adopted by the IETF.

- `"draft-6"`: enable support for [draft-6](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers-06) headers. (i.e. `RateLimit-Policy`, `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`).

- `"draft-7"`: enable support for [draft-7](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers-07) headers. (i.e. a single `RateLimit` header containing limit, remaining, and reset values).

- `true`: enable support for draft-6 headers.

If set to any truthy value, the `Retry-After` header will also be sent on all blocked requests.

**Default**: `"draft-6"`.

### skipFailedRequests

When set to true, failed requests won’t be counted.

- `Boolean`: `true` to skip counting, `false` to count.

**Default**: `false`.

### skipSuccessfulRequests

When set to true, successful requests won’t be counted.

- `Boolean`: `true` to skip counting, `false` to count.

**Default**: `false`.

## Usage

```yaml title="gateweaver.yml"
policyDefinitions:
  rateLimit:
    windowMs: 300000
    limit: 100
    message: "You have exceeded the 100 requests in 5 minutes limit!"

endpoints:
  - path: "/todos"
    target:
      url: "https://jsonplaceholder.typicode.com/todos"
    policies:
      - rateLimit
```

Powered by [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
