---
sidebar_position: 1
---

# CORS

The CORS (Cross-Origin Resource Sharing) policy allows you to tailor how endpoints on your gateway respond to cross-origin requests.

## Configuration Options

### origin

Configures the **Access-Control-Allow-Origin** CORS header.

- `Boolean`: set origin to true to reflect the request origin, as defined by `req.header('Origin')`, or set it to false to disable CORS.

- `String`: set origin to a specific origin. For example if you set it to "http://example.com" only requests from "http://example.com" will be allowed.

- `RegExp`: set origin to a regular expression pattern which will be used to test request origin. If it's a match, the request origin will be reflected. For example the pattern `/example\\.com$/` will reflect any request that is coming from an origin ending with "example.com".

- `Array`: set origin to an array of valid origins. Each origin can be a String or a RegExp. For example `["http://example1.com", /\\.example2\\.com$/]` will accept any request from "http://example1.com" or from a subdomain of "example2.com".

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

### optionsSuccessStatus (Optional)

Configures the status code to be sent in response to a preflight request.

- `Number`: set to a status code.

**Default**: `204`.

## Default Configuration

To enable CORS with the default configuration, you can define the policy as:

```yaml title="gateweaver.yml"
policyDefinitions:
  cors: {}
```

Which is equivalent to:

```yaml title="gateweaver.yml"
policyDefinitions:
  cors:
    origin: "*"
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
    optionsSuccessStatus: 204
```

Powered by [expressjs/cors](https://github.com/expressjs/cors)
