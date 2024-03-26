---
sidebar_position: 4
---

# API Key

The API Key Policy enables you to secure your endpoints by requiring a valid API key with each request. Gateweaver will verify the API key provided in the `x-api-key` header against a list of hashed API keys defined in the configuration file.

## Configuration Options

### hashes

Defines a list of SHA-256 hashed API keys that are considered valid for accessing the API. These hashes are used to verify the API key provided in the `x-api-key` header.

- `Array`: An array of SHA-256 hashed API key strings.

## Generating API Keys and Hashes

You can generate an API Key and it's corresponding hash using the `@gateweaver/cli` package:

```bash
npx @gateweaver/cli generate-api-key
```

Output:

```
API Key: 4b13e4565e6b4f63b6f9cbb30138009a

Hashed API Key: b0fdc387a13a5ddd925214aac77a157ed5cf1cf8ebaca3cb056703b1af2b5891
```

### How It Works

1. **API Key Generation**: An API Key is created using a universally unique identifier (UUID v4), with all hyphens removed. This ensures that each key is globally unique.
2. **Hashing**: The API Key is then hashed using the SHA-256 algorithm. This hash represents the original key but cannot be reversed to reveal the key itself.

### Security Practices

- **API Key**: Must be kept securely and not widely shared. While it serves as a private credential for accessing the API, there are use cases, such as in client-side applications, where the API Key may be exposed. In such scenarios, it's essential to understand the risks involved. Exposing an API Key can lead to unauthorized use of your API. It's recommended to implement additional security measures, such as rate limiting, to mitigate potential abuse.
- **Hashed API Key**: Can be safely stored in the API gateway's configuration file. The hash is used to verify the authenticity of the API Key without exposing the key itself. Storing the hash instead of the actual key mitigates risk, as the hash cannot be used to derive the original API Key.

## Usage

```yaml title="gateweaver.yml"
policyDefinitions:
  apiKey:
    hashes:
      - "20ccb72ebb7ef6911958d8b22ab97821a15ae30fb9dd31c548a3184c06fc80c8"
      - "b0fdc387a13a5ddd925214aac77a157ed5cf1cf8ebaca3cb056703b1af2b5891"

endpoints:
  - path: "/todos"
    target:
      url: "https://example.com/todos"
    policies:
      - apiKey
```
