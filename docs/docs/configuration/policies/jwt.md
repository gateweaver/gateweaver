---
sidebar_position: 3
---

# JWT

The JWT (JSON Web Token) Authentication policy enables secure access to your API by validating JWT tokens provided in the requests.

## Configuration Options

### secret (Optional)

Use this option when using a symmetric algorithm.

- `String`: The secret key used to verify the JWT's signature.

### jwksUri (Optional)

Use this option when using an asymmetric algorithm.

- `String`: URL to the JSON Web Key Set (JWKS). This is used to retrieve the public key for verifying the JWT's signature.

### audience (Optional)

Set if you want to validate the audience claim (`aud`) of the JWT.

- `String`: The expected audience (`aud`) of the JWT.

### issuer (Optional)

Set if you want to validate the issuer claim (`iss`) of the JWT.

- `String`: The expected issuer (`iss`) of the JWT.

### algorithms

- `Array`: List of strings specifying the allowed algorithms for token verification. For example, `["RS256", "HS512"]`.

## Usage

### Secret Key

```yaml title="gateweaver.yml"
policyDefinitions:
  jwt:
    secret: "my_secret_key"
    audience: "my_audience"
    issuer: "my_issuer"
    algorithms:
      - "HS256"
```

### JWKS

```yaml title="gateweaver.yml"
policyDefinitions:
  jwt:
    jwksUri: "https://example.com/.well-known/jwks.json"
    audience: "my_audience"
    issuer: "my_issuer"
    algorithms:
      - "RS256"
```

Powered by [express-jwt](https://github.com/auth0/express-jwt)
