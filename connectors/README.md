# Grindery Nexus Connector Schema Definitions


## ConnectorSchema
An `object` that represents a connector app.

Key | Type | Required | Description
----|------|----------|------------
`name` | `string` | yes | A short name to uniquely identify this connector app.
`version` | `string` | yes | version identifier for your code.
`platformVersion` | `string` | yes | version identifier for the Grindery Nexus execution environment.
`triggers` | array<[TriggerSchema](#triggerschema)> | no | All the triggers for your connector app.
`actions` | array<[ActionSchema](#actionschema)> | no | All the actions for your connector app.


## TriggerSchema

An `object` that defines a trigger for a workflow

Key | Type | Required | Description
----|------|----------|------------
`key` | `string` | yes | A key to uniquely identify this trigger.
`name` | `string` | yes | A short name to uniquely identify this trigger.
`display` | [DisplaySchema](#displayschema) | yes | Defines UI representation this trigger.
`operation` | anyOf([ChainEventOperationSchema](#chaineventoperationschema)) | yes | Defines the functionality for this trigger.


## ActionSchema

An `object` that defines an action for a workflow

Key | Type | Required | Description
----|------|----------|------------
`key` | `string` | yes | A key to uniquely identify this action.
`name` | `string` | yes | A short name to uniquely identify this action.
`display` | [DisplaySchema](#displayschema) | yes | Defines UI representation this action.
`operation` | anyOf([ChainCallOperationSchema](#chaineventoperationschema)) | yes | Defines the functionality for this action.


## ChainSchema

A `string` that identifies a blockchain.

Type | Required | Description
-----|----------|------------
`string` | yes | The [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md) identifier for the blockchain e.g eip155:1 for Ethereum Mainnet.

## ChainAccountSchema

A `string` that identifies a blockchain account.

Type | Required | Description
-----|----------|------------
`string` | yes | The [CAIP-10](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md) identifier for the blockchain account e.g eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb for an Ethereum Mainnet address.


## ChainCallOperationSchema

An `object` that defines a blockchain contract function call.

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` in (`blockchain:call`) | yes | Must be set to `blockchain:call`.
`accounts` | array<[ChainAccountSchema](#chainaccountschema)> | yes | The blockchain accounts for which this function can be called.
`signature` | `string` | yes | Signature of the function e.g `transfer(address,uint256)` for ERC20 transfer call.
`arguments` | array<[ChainCallOperationArgsSchema](#chaineventoperationfilterschema)> | Defines the blockchain function call arguments for this action.
`inputFields` | array<[FieldSchema](#fieldschema)> | no | The data fields the user needs to configure for this action.
`outputFields` | array<[FieldSchema](#fieldschema)> | no | The data fields returned by this action.
`sample` | `object` | yes | Sample output data.


## ChainCallOperationArgsSchema

An `object` that defines the arguments sent to the blockchain function call.

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` | yes | The value type for this argument e.g `bool`, `int`, `uint`, `address` etc for EVM function calls.
`value` | anyOf(`number`, `string`) | yes | The value of the argument to be passed to the function.


## ChainEventOperationSchema

An `object` that defines a blockchain event

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` in (`blockchain:event`) | yes | Must be set to `blockchain:event`.
`chains` | array<[ChainSchema](#chainschema)> | yes | All the chains for which this event is supported.
`signature` | `string` | yes | Signature of the event e.g `Transfer(address,uint256)` for ERC20 Transfer event.
`filters` | [ChainEventOperationFilterSchema](#chaineventoperationfilterschema) | Defines the blockchain event filter parameters for this trigger.
`inputFields` | array<[FieldSchema](#fieldschema)> | no | The data fields the user needs to configure for this trigger.
`outputFields` | array<[FieldSchema](#fieldschema)> | no | The data fields returned by this trigger.
`sample` | `object` | yes | Sample output data.


## ChainEventOperationFilterSchema

An `object` that defines the parameters used to filter blockchain events.

Key | Type | Required | Description
----|------|----------|------------
`fromBlock` | anyOf(`number`, `string`) | no | The number of the earliest block ("latest" may be given to mean the most recent and "pending" currently mining, block). By default "latest".
`toBlock` | anyOf(`number`, `string`) | no | The number of the latest block ("latest" may be given to mean the most recent and "pending" currently mining, block). By default "latest".
`address` | anyOf(`string`, `array<string>`) | no | An address or a list of addresses to only get logs from particular account(s).
`topics` | `array<string>` | no | An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x12...']. You can also pass an array for each topic with options for that topic e.g. [null, ['option1', 'option2']]


## DisplaySchema

An `object` that defines UI information for a trigger or action.

Key | Type | Required | Description
----|------|----------|------------
`label` | `string` | yes | A short label for this trigger or action e.g "New Record" or "Create Record".
`description` | `string` | yes | A short description for what this trigger or action does.
`instructions` | `string` | no | Short instructions for how to use this trigger or action.


## FieldSchema

An `object` that defines an input or output field

Key | Type | Required | Description
----|------|----------|------------
`key` | `string` | yes | A unique machine readable key for this value (e.g "name").
`label` | `string` | no | A human readable label for this value (e.g "Name").
`helpText` | `string` | no | A human readable description of this value (e.g "Your full name.").
`type` | `string` in (`string`, `text`, `integer`, `number`, `boolean`, `datetime`, `file`, `password`, `copy`, `code`) | no | The type of this value. Use `string` for basic text input, `text` for a large, `<textarea>` style box, and `code` for a `<textarea>` with a fixed-width (monospaced) font.
`required` | `boolean` | no | If this value is required or not.
`placeholder` | `string` | no | An example value that is not saved.
`default` | `string` | no | A default value that is saved if no value is provided by the user.
`choices` | array<[FieldChoiceSchema](#fieldchoiceschema)> | no | Defines the choices/options used to populate a dropdown.
`list` | `boolean` | no | Defines whether a user can provide multiples on an input field or whether an output field returns an array of items of type `type`.
`children` | array<[FieldSchema](#fieldschema)> | no | An array of child fields that define the structure of a sub-object for this field. Usually used for line items.
`dict` | `boolean` | no | Is this field a key/value input?
`computed` | `boolean` | no | Is this field automatically populated (and hidden from the user)?
`inputFormat` | `string` | no | Useful when you expect the input to be part of a longer string. Put "{{input}}" in place of the user's input (e.g "https://{{input}}.yourdomain.com").


## FieldChoiceSchema

Either a `string` or an `object` describing the choice in a dropdown.

In the case of an object, the properties should be defined as follows:

Key | Type | Required | Description
----|------|----------|------------
`value` | `string` | yes | The actual value that is sent into the Zap. Should match sample exactly.
`label` | `string` | yes | A human readable label for this value.
`sample` | `string` | yes | Displayed as light grey text in the editor. It's important that the value match the sample.

