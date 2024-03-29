---
sidebar_position: 4
---

# CLI Reference

## Commands

### `gateweaver start`

Starts the Gateweaver server.

**Options:**

- `-c, --config <configPath>`: Path to the config file. Defaults to `./gateweaver.yml`.
- `-w, --watch`: Watch the config file for changes and automatically restart the server.

**Example:**

```bash
gateweaver start --config ./example/gateweaver.yml --watch
```

### `gateweaver validate`

Validates a Gateweaver config file.

**Options:**

- `-c, --config <configPath>`: Path to the config file. Defaults to `./gateweaver.yml`.

**Example:**

```bash
gateweaver validate --config ./example/gateweaver.yml
```

### `gateweaver generate-api-key`

Creates a new API key along with its corresponding hash. Both the API key and its hash will be shown in the console. You should safely store the API key and add the hashed version into your configuration file.

**Example:**

```bash
gateweaver generate-api-key
```
