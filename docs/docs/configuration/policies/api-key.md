---
sidebar_position: 4
---

# API Key

The API Key Policy enables you to secure your endpoints by requiring a valid API key with each request. Gateweaver will verify the API key provided in the `x-api-key` header against a list of hashed API keys defined in the configuration file.

## Configuration Options

### apiKeyHashes

Defines a list of SHA-256 hashed API keys that are considered valid for accessing the API. These hashes are used to verify the API key provided in the `x-api-key` header.

- `Array`: An array of SHA-256 hashed API key strings.

## Generating API Keys and Hashes

You can generate an API Key and it's corresponding SHA-256 hash using the `@gateweaver/cli` package:

```bash
npx @gateweaver/cli generate-api-key
```

Output:

```
API Key: 4b13e4565e6b4f63b6f9cbb30138009a

Hashed API Key: b0fdc387a13a5ddd925214aac77a157ed5cf1cf8ebaca3cb056703b1af2b5891
```

You can then store the API key securely and use the hash in your configuration file.

## Usage

```yaml title="gateweaver.yml"
policyDefinitions:
  apiKey:
    apiKeyHashes:
      - "20ccb72ebb7ef6911958d8b22ab97821a15ae30fb9dd31c548a3184c06fc80c8"
      - "b0fdc387a13a5ddd925214aac77a157ed5cf1cf8ebaca3cb056703b1af2b5891"

endpoints:
  - path: "/todos"
    target:
      url: "https://example.com/todos"
    policies:
      - apiKey
```
