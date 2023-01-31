# Grindery Nexus Connector Schema Definitions

Connectors abstract web3 and web2 protocols into an interface of composable triggers and actions.

## Index

- [ConnectorSchema](#connectorschema)
- [Triggers](#triggers)
  - [TriggerSchema](#triggerschema)
    - [ChainEventOperationSchema](#chaineventoperationschema)
      - [ChainEventOperationFilterSchema](#chaineventoperationfilterschema)
    - [HookOperationSchema](#hookoperationschema)
    - [PollingOperationSchema](#pollingoperationschema)
- [Actions](#actions)
  - [ActionSchema](#actionschema)
    - [APICallOperationSchema](#apicalloperationschema)
    - [ChainCallOperationSchema](#chaincalloperationschema)
      - [ChainCallOperationArgsSchema](#chaincalloperationargsschema)
- [Authentication](#authentication)
  - [AuthenticationSchema](#authenticationschema)
    - [AuthenticationOAuth1ConfigSchema](#authenticationoauth1configschema)
    - [AuthenticationOAuth2ConfigSchema](#authenticationoauth2configschema)
    - [AuthenticationSessionConfigSchema](#authenticationsessionconfigschema)
- [Shared](#shared)
  - [Chains](#chains)
    - [ChainSchema](#chainschema)
    - [ChainAccountSchema](#chainaccountschema)
  - [DIDs](#dids)
    - [DIDSchema](#didschema)
  - [Display](#display)
    - [DisplaySchema](#displayschema)
  - [Fields](#fields)
    - [FieldSchema](#fieldschema)
      - [FieldChoiceSchema](#fieldchoiceschema)
    - [FieldProviderRequestSchema](#fieldproviderrequestschema)
    - [FieldProviderResponseSchema](#fieldproviderresponseschema)
  - [Requests](#requests)
    - [RequestSchema](#requestschema)

## ConnectorSchema

An `object` that represents a connector app.

| Key               | Type                                           | Required | Description                                                                                                                                    |
| ----------------- | ---------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`             | `string`                                       | yes      | A key to uniquely identify this connector.                                                                                                     |
| `name`            | `string`                                       | yes      | A short name to uniquely identify this connector app. Name for web3 connector must include blockchain name, for example: "Moloch on Ethereum". |
| `version`         | `string`                                       | yes      | version identifier for your code.                                                                                                              |
| `platformVersion` | `string`                                       | yes      | version identifier for the Grindery Nexus execution environment.                                                                               |
| `type`            | `string` in (`web2`, `web3`)                   | yes      | Connector type.                                                                                                                                |
| `description`     | `string`                                       | no       | Short user-friendly connector description.                                                                                                     |
| `triggers`        | array<[TriggerSchema](#triggerschema)>         | no       | All the triggers for your connector app.                                                                                                       |
| `actions`         | array<[ActionSchema](#actionschema)>           | no       | All the actions for your connector app.                                                                                                        |
| `authentication`  | [AuthenticationSchema](#authenticationschema)  | no       | Choose what scheme your API uses for authentication.                                                                                           |
| `icon`            | `string`                                       | no       | Base64 encoded image string. Recommended icon size 24x24px. Allowed formats: PNG or SVG. Must be on transparent background.                    |
| `pricing`         | `string`                                       | no       | URL of the pricing page. Required if connector is a paid service.                                                                              |
| `access`          | `string` in (`private`, `workspace`, `public`) | no       | Who can use this connector: only creator, all members of the creator's workspace or anyone. Default value is `public`.                         |
| `user`            | `string`                                       | no       | Creator's user ID.                                                                                                                             |
| `workspace`       | `string`                                       | no       | Creator's workspace ID.                                                                                                                        |

## Triggers

### TriggerSchema

An `object` that defines a trigger for a workflow.

| Key         | Type                                                                                                                                                           | Required | Description                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| `key`       | `string`                                                                                                                                                       | yes      | A key to uniquely identify this trigger.        |
| `name`      | `string`                                                                                                                                                       | yes      | A short name to uniquely identify this trigger. |
| `display`   | [DisplaySchema](#displayschema)                                                                                                                                | yes      | Defines UI representation this trigger.         |
| `operation` | anyOf([ChainEventOperationSchema](#chaineventoperationschema), [HookOperationSchema](#hookoperationschema), [PollingOperationSchema](#pollingoperationschema)) | yes      | Defines the functionality for this trigger.     |

#### ChainEventOperationSchema

An `object` that defines a blockchain event.

| Key                     | Type                               | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ---------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                  | `string` in (`blockchain:event`)   | yes      | Must be set to `blockchain:event`.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `chains`                | array<[ChainSchema](#chainschema)> | yes      | All the chains for which this event is supported.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `signature`             | oneOf(`string`, array<`string`>)   | yes      | Signature of the event. Format of this field depends on the chain that the CDS is created for. For EVM chains the signature is Solidity event declaration including parameter names (which are mapped to input fields by key) e.g `Transfer(address indexed from, address indexed to, uint256 value)` for ERC20 Transfer event. Multiple signatures may be specified for EVM chains, but indexed parameters must be exactly the same in all signatures.          |
| `inputFields`           | array<[FieldSchema](#fieldschema)> | no       | The data fields the user needs to configure for this trigger.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `inputFieldProviderUrl` | `string`                           | no       | A [JSON-RPC 2.0](https://www.jsonrpc.org/specification) endpoint for updating available input fields based on user input. If present, it is called after user changes a field (see `updateFieldDefinition` in [FieldSchema](#fieldschema) for details) to update available fields or choices. See also [FieldProviderRequestSchema](#fieldproviderrequestschema) and [FieldProviderResponseSchema](#fieldproviderresponseschema) for definition of the endpoint. |
| `outputFields`          | array<[FieldSchema](#fieldschema)> | no       | The data fields returned by this trigger.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `sample`                | `object`                           | yes      | Sample output data.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### HookOperationSchema

An `object` that defines the mechanics of an inbound hook.

| Key                     | Type                               | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ---------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                  | `string` in (`hook`)               | yes      | Must be set to `hook`.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `inputFields`           | array<[FieldSchema](#fieldschema)> | no       | The data fields the user needs to configure for this trigger.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `inputFieldProviderUrl` | `string`                           | no       | A [JSON-RPC 2.0](https://www.jsonrpc.org/specification) endpoint for updating available input fields based on user input. If present, it is called after user changes a field (see `updateFieldDefinition` in [FieldSchema](#fieldschema) for details) to update available fields or choices. See also [FieldProviderRequestSchema](#fieldproviderrequestschema) and [FieldProviderResponseSchema](#fieldproviderresponseschema) for definition of the endpoint. |
| `outputFields`          | array<[FieldSchema](#fieldschema)> | no       | The data fields returned by this trigger.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `sample`                | `object`                           | yes      | Sample output data.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### PollingOperationSchema

An `object` that defines the mechanics of a polling operation.

| Key                     | Type                                   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | -------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                  | `string` in (`polling`)                | yes      | Must be set to `polling`.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `operation`             | oneOf([RequestSchema](#requestschema)) | yes      | Defines how Nexus fetches data.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `inputFields`           | array<[FieldSchema](#fieldschema)>     | no       | The data fields the user needs to configure for this trigger.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `inputFieldProviderUrl` | `string`                               | no       | A [JSON-RPC 2.0](https://www.jsonrpc.org/specification) endpoint for updating available input fields based on user input. If present, it is called after user changes a field (see `updateFieldDefinition` in [FieldSchema](#fieldschema) for details) to update available fields or choices. See also [FieldProviderRequestSchema](#fieldproviderrequestschema) and [FieldProviderResponseSchema](#fieldproviderresponseschema) for definition of the endpoint. |
| `outputFields`          | array<[FieldSchema](#fieldschema)>     | no       | The data fields returned by this trigger.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `sample`                | `object`                               | yes      | Sample output data.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Actions

### ActionSchema

An `object` that defines an action for a workflow.

| Key         | Type                                                                                                            | Required | Description                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------- |
| `key`       | `string`                                                                                                        | yes      | A key to uniquely identify this action.        |
| `name`      | `string`                                                                                                        | yes      | A short name to uniquely identify this action. |
| `display`   | [DisplaySchema](#displayschema)                                                                                 | yes      | Defines UI representation this action.         |
| `operation` | anyOf([ChainCallOperationSchema](#chaincalloperationschema), [APICallOperationSchema](#apicalloperationschema)) | yes      | Defines the functionality for this action.     |

#### APICallOperationSchema

An `object` that defines the mechanics of an API call operation.

| Key                     | Type                                   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | -------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                  | `string` in (`api`)                    | yes      | Must be set to `api`.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `operation`             | oneOf([RequestSchema](#requestschema)) | yes      | Defines how Nexus makes the API call.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `inputFields`           | array<[FieldSchema](#fieldschema)>     | no       | The data fields the user needs to configure for this trigger.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `inputFieldProviderUrl` | `string`                               | no       | A [JSON-RPC 2.0](https://www.jsonrpc.org/specification) endpoint for updating available input fields based on user input. If present, it is called after user changes a field (see `updateFieldDefinition` in [FieldSchema](#fieldschema) for details) to update available fields or choices. See also [FieldProviderRequestSchema](#fieldproviderrequestschema) and [FieldProviderResponseSchema](#fieldproviderresponseschema) for definition of the endpoint. |
| `outputFields`          | array<[FieldSchema](#fieldschema)>     | no       | The data fields returned by this trigger.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `sample`                | `object`                               | yes      | Sample output data.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### ChainCallOperationSchema

An `object` that defines a blockchain contract function call.

| Key                     | Type                                             | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                  | `string` in (`blockchain:call`)                  | yes      | Must be set to `blockchain:call`.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `accounts`              | array<[ChainAccountSchema](#chainaccountschema)> | yes      | The blockchain accounts for which this function can be called.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `signature`             | `string`                                         | yes      | Signature of the function including parameter names (which are mapped to input fields by key) e.g `function transfer(address to, uint256 value)` for ERC20 transfer call.                                                                                                                                                                                                                                                                                        |
| `inputFields`           | array<[FieldSchema](#fieldschema)>               | no       | The data fields the user needs to configure for this action.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `inputFieldProviderUrl` | `string`                                         | no       | A [JSON-RPC 2.0](https://www.jsonrpc.org/specification) endpoint for updating available input fields based on user input. If present, it is called after user changes a field (see `updateFieldDefinition` in [FieldSchema](#fieldschema) for details) to update available fields or choices. See also [FieldProviderRequestSchema](#fieldproviderrequestschema) and [FieldProviderResponseSchema](#fieldproviderresponseschema) for definition of the endpoint. |
| `outputFields`          | array<[FieldSchema](#fieldschema)>               | no       | The data fields returned by this action.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `sample`                | `object`                                         | yes      | Sample output data.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Authentication

### AuthenticationSchema

An `object` that defines the authentication schemes.

| Key                            | Type                                                                     | Required | Description                                                                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                         | `string` in (`basic`, `custom`, `digest`, `oauth1`, `oauth2`, `session`) | yes      | Choose which scheme you want to use.                                                                                                                                                      |
| `test`                         | oneOf([RequestSchema](#requestschema))                                   | yes      | A request that confirms the authentication is working.                                                                                                                                    |
| `defaultDisplayName`           | `string`                                                                 | no       | Template for generating display name. Template can contain `{{ data.FIELD }}` to reference data returned from `test` request, and `{{ auth.FIELD }}` to reference data in token response. |
| `authenticatedRequestTemplate` | oneOf([RequestSchema](#requestschema))                                   | no       | Extra request options added to all requests sent via credential manager.                                                                                                                  |
| `allowedHosts`                 | array<`string`>                                                          | no       | When specified, credential manager is allowed to send requests to these hosts only.                                                                                                       |
| `fields`                       | array<[FieldSchema](#fieldschema)>                                       | no       | Fields you can request from the user before they connect your app to Nexus.                                                                                                               |
| `label`                        | anyOf(`string`, [RequestSchema](#requestschema))                         | no       | A string with variables or request that returns the connection label for the authenticated user.                                                                                          |
| `oauth1Config`                 | [AuthenticationOAuth1ConfigSchema](#authenticationoauth1configschema)    | no       | OAuth1 authentication configuration.                                                                                                                                                      |
| `oauth2Config`                 | [AuthenticationOAuth2ConfigSchema](#authenticationoauth2configschema)    | no       | OAuth2 authentication configuration.                                                                                                                                                      |
| `sessionConfig`                | [AuthenticationSessionConfigSchema](#authenticationsessionconfigschema)  | no       | session authentication configuration.                                                                                                                                                     |

#### AuthenticationOAuth1ConfigSchema

An `object` that defines OAuth1 authentication config.

| Key               | Type                                   | Required | Description                                                                                                                                         |
| ----------------- | -------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getRequestToken` | oneOf([RequestSchema](#requestschema)) | yes      | Define where Nexus will acquire a request token which is used for the rest of the three legged authentication process.                              |
| `authorizeUrl`    | oneOf([RequestSchema](#requestschema)) | yes      | Define where Nexus will redirect the user to authorize our app. Typically, you should append an `oauth_token` querystring parameter to the request. |
| `getAccessToken`  | oneOf([RequestSchema](#requestschema)) | yes      | Define how Nexus fetches an access token from the API                                                                                               |

#### AuthenticationOAuth2ConfigSchema

An `object` that defines OAuth2 authentication config.

| Key                  | Type                                   | Required | Description                                                                                                                                             |
| -------------------- | -------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authorizeUrl`       | `string`                               | yes      | Define where Nexus will redirect the user to authorize our app. Note: we append the redirect URL and state parameters to return value of this function. |
| `getAccessToken`     | oneOf([RequestSchema](#requestschema)) | yes      | Define how Nexus fetches an access token from the API                                                                                                   |
| `refreshAccessToken` | oneOf([RequestSchema](#requestschema)) | no       | Define how Nexus will refresh the access token from the API                                                                                             |
| `codeParam`          | `string`                               | no       | Define a non-standard code param Nexus should scrape instead. (The parameter is still named `code` when interpolating token requests)                   |
| `scope`              | `string`                               | no       | What scope should Nexus request? (This with override `scope` parameter in the authorize URL)                                                            |
| `autoRefresh`        | `boolean`                              | no       | Should Nexus invoke `refreshAccessToken` when we receive an error for a 401 response or the access token has expired?                                   |

#### AuthenticationSessionConfigSchema

An `object` that defines session authentication config.

| Key         | Type                                   | Required | Description                                                                 |
| ----------- | -------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `operation` | oneOf([RequestSchema](#requestschema)) | yes      | Defines how Nexus fetches the additional authData needed to make API calls. |

## Shared

### Chains

#### ChainSchema

A `string` that identifies a blockchain.

| Type     | Required | Description                                                                                                                                         |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `string` | yes      | The [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md) identifier for the blockchain e.g `eip155:1` for Ethereum Mainnet. |

#### ChainAccountSchema

A `string` that identifies a blockchain account.

| Type     | Required | Description                                                                                                                                                                                                         |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `string` | yes      | The [CAIP-10](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md) identifier for the blockchain account e.g `eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb` for an Ethereum Mainnet address. |

### DIDs

#### DIDSchema

A `string` that represents a [Decentralized Identifier (DID)](https://www.w3.org/TR/did-core/).

| Type     | Required | Description                                                                                                                                                                                                                                                                                             |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `string` | yes      | The [CIP-79](https://github.com/ceramicnetwork/CIP/blob/main/CIPs/CIP-79/CIP-79.md) identifier for the 3ID DID Account e.g `did:3:kjzl6cwe1jw149tlplc4bgnpn1v4uwk9rg9jkvijx0u0zmfa97t69dnqibqa2as` for Ceramic 3ID DID with streamID `kjzl6cwe1jw149tlplc4bgnpn1v4uwk9rg9jkvijx0u0zmfa97t69dnqibqa2as`. |

### Display

#### DisplaySchema

An `object` that defines UI information for a trigger or action.

| Key            | Type      | Required | Description                                                                                                                 |
| -------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `label`        | `string`  | yes      | A short label for this trigger or action e.g "New Record" or "Create Record".                                               |
| `description`  | `string`  | yes      | A short description for what this trigger or action does.                                                                   |
| `instructions` | `string`  | no       | Short instructions for how to use this trigger or action.                                                                   |
| `icon`         | `string`  | no       | Base64 encoded image string. Recommended icon size 24x24px. Allowed formats: PNG or SVG. Must be on transparent background. |
| `featured`     | `boolean` | no       | Featured triggers/actions will be listed higher in the workflow builder UI then the rest.                                   |
| `hidden`       | `boolean` | no       | Hidden triggers/actions will not be listed in the workflow builder UI.                                                      |

### Fields

#### FieldSchema

An `object` that defines an input or output field.

| Key                     | Type                                                                                                                                                                                          | Required | Description                                                                                                                                                                                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                   | `string`                                                                                                                                                                                      | yes      | A unique machine readable key for this value (e.g "name").                                                                                                                                                                                                                         |
| `label`                 | `string`                                                                                                                                                                                      | no       | A human readable label for this value (e.g "Name").                                                                                                                                                                                                                                |
| `helpText`              | `string`                                                                                                                                                                                      | no       | A human readable description of this value (e.g "Your full name.").                                                                                                                                                                                                                |
| `type`                  | `string` in (`string`, `text`, `integer`, `number`, `boolean`, `datetime`, `file`, `password`, `copy`, `code`, `address`, `email`, `luhn`, `mac`, `url`, `uuid`, `evmAddress`, `flowAddress`) | no       | The type of this value. Use `string` for basic text input, `text` for a large, `<textarea>` style box, and `code` for a `<textarea>` with a fixed-width (monospaced) font. Use `address`, `evmAddress` or `flowAddress` type to allow user to use Address Book to enter the value. |
| `required`              | `boolean`                                                                                                                                                                                     | no       | If this value is required or not.                                                                                                                                                                                                                                                  |
| `placeholder`           | `string`                                                                                                                                                                                      | no       | An example value that is not saved.                                                                                                                                                                                                                                                |
| `default`               | `string`                                                                                                                                                                                      | no       | A default value that is saved if no value is provided by the user.                                                                                                                                                                                                                 |
| `choices`               | array<[FieldChoiceSchema](#fieldchoiceschema)>                                                                                                                                                | no       | Defines the choices/options used to populate a dropdown.                                                                                                                                                                                                                           |
| `list`                  | `boolean`                                                                                                                                                                                     | no       | Defines whether a user can provide multiples on an input field or whether an output field returns an array of items of type `type`.                                                                                                                                                |
| `children`              | array<[FieldSchema](#fieldschema)>                                                                                                                                                            | no       | An array of child fields that define the structure of a sub-object for this field. Usually used for line items.                                                                                                                                                                    |
| `dict`                  | `boolean`                                                                                                                                                                                     | no       | Is this field a key/value input?                                                                                                                                                                                                                                                   |
| `computed`              | `boolean`                                                                                                                                                                                     | no       | Is this field automatically populated (and hidden from the user)?                                                                                                                                                                                                                  |
| `updateFieldDefinition` | `boolean`                                                                                                                                                                                     | no       | Only has effect when `inputFieldProviderUrl` is present. If not set or set to `true`, `inputFieldProviderUrl` is called to update field definition after this field is changed. If set to `false`, this field won't trigger field definition update.                               |
| `inputFormat`           | `string`                                                                                                                                                                                      | no       | Useful when you expect the input to be part of a longer string. Put "{{input}}" in place of the user's input (e.g "https://{{input}}.yourdomain.com").                                                                                                                             |
| `validation`            | [FieldValidationSchema](#fieldvalidationschema)                                                                                                                                               | no       | Additional validation rules for the field.                                                                                                                                                                                                                                         |
| `readonly`              | `boolean`                                                                                                                                                                                     | no       | Set this to `true` if the field should be read only.                                                                                                                                                                                                                               |

##### FieldChoiceSchema

Either a `string` or an `object` describing the choice in a dropdown.

In the case of an object, the properties should be defined as follows:

| Key      | Type     | Required | Description                                                                                 |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------- |
| `value`  | `string` | yes      | The actual value that is sent into the connector. Should match sample exactly.              |
| `label`  | `string` | yes      | A human readable label for this value.                                                      |
| `sample` | `string` | yes      | Displayed as light grey text in the editor. It's important that the value match the sample. |

##### FieldValidationSchema

An `object` describing additional validation rules for the field.

| Key          | Type      | Required | Description                                                                  |
| ------------ | --------- | -------- | ---------------------------------------------------------------------------- |
| `positive`   | `boolean` | no       | The value must be a `number` greater than zero.                              |
| `negative`   | `boolean` | no       | The value must be a `number` less than zero.                                 |
| `integer`    | `boolean` | no       | The value must be a non-decimal `number`.                                    |
| `min`        | `number`  | no       | Minimum value for the `number` type or minimum length for the `string` type. |
| `max`        | `number`  | no       | Maximum value for the `number` type or maximum length for the `string` type. |
| `values`     | `string`  | no       | Allowed values for the `enum` type.                                          |
| `equal`      | `number`  | no       | Fixed value for the `number` type.                                           |
| `notEqual`   | `number`  | no       | The `number` value can't be equal to this value.                             |
| `length`     | `number`  | no       | Fixed length for the `string` value.                                         |
| `pattern`    | `string`  | no       | Regex pattern for the `string` value.                                        |
| `contains`   | `string`  | no       | The `string` value must contain this text.                                   |
| `alpha`      | `boolean` | no       | The value must be an alphabetic `string`.                                    |
| `numeric`    | `boolean` | no       | The value must be a numeric `string`.                                        |
| `alphanum`   | `boolean` | no       | The value must be an alphanumeric `string`.                                  |
| `alphadash`  | `boolean` | no       | The value must be an alphabetic `string` that contains dashes.               |
| `hex`        | `boolean` | no       | The value must be a hex `string`.                                            |
| `singleLine` | `boolean` | no       | The value must be a single line `string`.                                    |
| `base64`     | `boolean` | no       | The value must be a base64 `string`.                                         |

#### FieldProviderRequestSchema

This is wrapped in JSON-RPC request. `method` field in the request should be `grinderyNexusConnectorUpdateFields`.

Parameters:

| Key           | Type     | Required | Description                                                                                                   |
| ------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `key`         | `string` | yes      | Unique key of the trigger or action.                                                                          |
| `credentials` | `object` | no       | Credentials configured by user on the UI. May not be present if the connector doesn't require authentication. |
| `fieldData`   | `object` | yes      | Fields already filled by user.                                                                                |

#### FieldProviderResponseSchema

This is wrapped in JSON-RPC response.

| Key           | Type                               | Required | Description                                 |
| ------------- | ---------------------------------- | -------- | ------------------------------------------- |
| `inputFields` | array<[FieldSchema](#fieldschema)> | yes      | Updated field definition to be shown in UI. |

### Requests

#### RequestSchema

An `object` that represents an HTTP request.

| Key       | Type                                                          | Required | Description                                                                                                                    |
| --------- | ------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `method`  | `string` in (`GET`, `PUT`, `POST`, `PATCH`, `DELETE`, `HEAD`) | no       | The HTTP method for the request.                                                                                               |
| `url`     | `string`                                                      | no       | A URL for the request (the querystring will be parsed and merged with params). Keys and values will not be re-encoded.         |
| `body`    | oneOf(`null`, `string`, `object`, `array`)                    | no       | Can be nothing, a raw string or JSON (object or array).                                                                        |
| `params`  | `object`                                                      | no       | A mapping of the querystring - will get merged with any query params in the URL. Keys and values will be encoded.              |
| `headers` | `object`                                                      | no       | The HTTP headers for the request.                                                                                              |
| `auth`    | oneOf(`array<string>`, `object`)                              | no       | An object holding the auth parameters for OAuth1 request signing or an array to hold the username and password for Basic Auth. |
