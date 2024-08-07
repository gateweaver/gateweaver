---
sidebar_position: 1
---

# CORS

The CORS (Cross-Origin Resource Sharing) policy allows you to tailor how endpoints on your Server respond to cross-origin requests.

## Options

### origin

Configures the **Access-Control-Allow-Origin** CORS header.

- `Boolean`: set origin to true to reflect the request origin, as defined by `req.header('Origin')`, or set it to false to disable CORS.

- `String`: set origin to a specific origin. For example if you set it to "https://example.com/" only requests from "https://example.com/" will be allowed.

- `RegExp`: set origin to a regular expression pattern which will be used to test request origin. If it's a match, the request origin will be reflected. For example the pattern `/example\\.com$/` will reflect any request that is coming from an origin ending with "example.com".

- `Array`: set origin to an array of valid origins. Each origin can be a String or a RegExp. For example `["https://example1.com", /\\.example2\\.com$/]` will accept any request from "https://example1.com" or from a subdomain of "example2.com".

**Default**: `"*"` (Allows all origins).

### methods

Configures the **Access-Control-Allow-Methods** CORS header.

- `String`: a comma-delimited list of method names. For example, `"GET,POST,PUT"`.

- `Array`: an array of method names. For example, `["GET", "POST", "PUT"]`.

**Default**: `["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]`.

### allowedHeaders (Optional)

Configures the **Access-Control-Allow-Headers** CORS header.

- `String`: a comma-delimited list of header names. For example, `"Content-Type,Authorization"`.

- `Array`: an array of header names. For example, `["Content-Type", "Authorization"]`.

### exposedHeaders (Optional)

Configures the **Access-Control-Expose-Headers** CORS header.

- `String`: a comma-delimited list of header names. For example, `"Content-Range,X-Content-Range"`.

- `Array`: an array of header names. For example, `["Content-Range", "X-Content-Range"]`.

### credentials (Optional)

Configures the **Access-Control-Allow-Credentials** CORS header.

- `Boolean`: set to `true` to enable credentials.

### maxAge (Optional)

Configures the **Access-Control-Max-Age** CORS header.

- `Number`: set to a number of seconds to cache preflight requests.

### optionsSuccessStatus

Configures the status code to be sent in response to a preflight request.

- `Number`: set to a status code.

**Default**: `204`.

## Usage

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "https://example-origin.com"

endpoints:
  - path: "/todos"
    target:
      url: "https://jsonplaceholder.typicode.com/todos"
    policies:
      - cors
```

Powered by [expressjs/cors](https://github.com/expressjs/cors)
