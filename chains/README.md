# Blockchains supported by Nexus

- [EVM chains list](evm.json)
- [Non-EVM chains list](non-evm.json)

## Schema

Chain list is a JSON file containing an array of [Chains](#chainschema).

### ChainSchema

An `object` that represents a chain.

| Key            | Type     | Required | Description                                                                                                                        |
| -------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `value`        | `string` | yes      | An Id of the chain, following [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md) schema e.g. `eip155:1`. |
| `label`        | `string` | yes      | User-friendly chain name, e.g. `Ethereum`.                                                                                         |
| `icon`         | `string` | yes      | Base64 encoded image string. Recommended icon size 40x40px. Allowed formats: PNG or SVG. Must be on transparent background.        |
| `token`        | `string` | no       | Default chain token symbol, e.g. `ETH`.                                                                                            |
| `tokenAddress` | `string` | no       | Default chain token contract address.                                                                                              |

## API

Production API URL: `https://cds.grindery.org`

Staging API URL: `https://cds-staging.grindery.org`

### List all chains

```
GET /chains/_index.json
```

### List EVM chains

```
GET /chains/evm.json
```

### List Non-EVM chains

```
GET /chains/non-evm.json
```
