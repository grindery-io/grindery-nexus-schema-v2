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
`authentication` | [AuthenticationSchema](#authenticationschema) | no | Choose what scheme your API uses for authentication.


## TriggerSchema

An `object` that defines a trigger for a workflow.

Key | Type | Required | Description
----|------|----------|------------
`key` | `string` | yes | A key to uniquely identify this trigger.
`name` | `string` | yes | A short name to uniquely identify this trigger.
`display` | [DisplaySchema](#displayschema) | yes | Defines UI representation this trigger.
`operation` | anyOf([ChainEventOperationSchema](#chaineventoperationschema)) | yes | Defines the functionality for this trigger.


## ActionSchema

An `object` that defines an action for a workflow.

Key | Type | Required | Description
----|------|----------|------------
`key` | `string` | yes | A key to uniquely identify this action.
`name` | `string` | yes | A short name to uniquely identify this action.
`display` | [DisplaySchema](#displayschema) | yes | Defines UI representation this action.
`operation` | anyOf([ChainCallOperationSchema](#chaincalloperationschema)) | yes | Defines the functionality for this action.


## AuthenticationSchema

An `object` that defines the authentication schemes.

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` in (`basic`, `custom`, `digest`, `oauth1`, `oauth2`, `session`) | yes | Choose which scheme you want to use.
`test` | oneOf([RequestSchema](#requestschema)) | yes | A request that confirms the authentication is working.
`fields` | array<[FieldSchema](#fieldschema)> | no | Fields you can request from the user before they connect your app to Nexus.
`label` | anyOf(`string`, [RequestSchema](#requestschema)) | no | A string with variables or request that returns the connection label for the authenticated user.
`oauth1Config` | [AuthenticationOAuth1ConfigSchema](#authenticationoauth1configschema) | no | OAuth1 authentication configuration.
`oauth2Config` | [AuthenticationOAuth2ConfigSchema](#authenticationoauth2configschema) | no | OAuth2 authentication configuration.
`sessionConfig` | [AuthenticationSessionConfigSchema](#authenticationsessionconfigschema) | no | session authentication configuration.


## AuthenticationOAuth1ConfigSchema

An `object` that defines OAuth1 authentication config.

Key | Type | Required | Description
----|------|----------|------------
`getRequestToken` | oneOf([RequestSchema](#requestschema)) | yes | Define where Nexus will acquire a request token which is used for the rest of the three legged authentication process.
`authorizeUrl` | oneOf([RequestSchema](#requestschema)) | yes | Define where Nexus will redirect the user to authorize our app. Typically, you should append an `oauth_token` querystring parameter to the request.
`getAccessToken` | oneOf([RequestSchema](#requestschema)) | yes | Define how Nexus fetches an access token from the API


## AuthenticationOAuth2ConfigSchema

An `object` that defines OAuth2 authentication config.

Key | Type | Required | Description
----|------|----------|------------
`authorizeUrl` | oneOf([RequestSchema](#requestschema)) | yes | Define where Nexus will redirect the user to authorize our app. Note: we append the redirect URL and state parameters to return value of this function.
`getAccessToken` | oneOf([RequestSchema](#requestschema)) | yes | Define how Nexus fetches an access token from the API
`refreshAccessToken` | oneOf([RequestSchema](#requestschema)) | no | Define how Nexus will refresh the access token from the API
`codeParam` | `string` | no | Define a non-standard code param Nexus should scrape instead.
`scope` | `string` | no | What scope should Nexus request?
`autoRefresh` | `boolean` | no | Should Nexus invoke `refreshAccessToken` when we receive an error for a 401 response?


## AuthenticationSessionConfigSchema

An `object` that defines session authentication config.

Key | Type | Required | Description
----|------|----------|------------
`operation` | oneOf([RequestSchema](#requestschema)) | yes | Defines how Nexus fetches the additional authData needed to make API calls.


## ChainSchema

A `string` that identifies a blockchain.

Type | Required | Description
-----|----------|------------
`string` | yes | The [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md) identifier for the blockchain e.g `eip155:1` for Ethereum Mainnet.


## ChainAccountSchema

A `string` that identifies a blockchain account.

Type | Required | Description
-----|----------|------------
`string` | yes | The [CAIP-10](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md) identifier for the blockchain account e.g `eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb` for an Ethereum Mainnet address.


## ChainCallOperationSchema

An `object` that defines a blockchain contract function call.

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` in (`blockchain:call`) | yes | Must be set to `blockchain:call`.
`accounts` | array<[ChainAccountSchema](#chainaccountschema)> | yes | The blockchain accounts for which this function can be called.
`signature` | `string` | yes | Signature of the function e.g `transfer(address,uint256)` for ERC20 transfer call.
`arguments` | array<[ChainCallOperationArgsSchema](#chaineventoperationfilterschema)> | yes | Defines the blockchain function call arguments for this action.
`inputFields` | array<[FieldSchema](#fieldschema)> | no | The data fields the user needs to configure for this action.
`outputFields` | array<[FieldSchema](#fieldschema)> | no | The data fields returned by this action.
`sample` | `object` | yes | Sample output data.


## ChainCallOperationArgsSchema

An `object` that defines the arguments sent to the blockchain function call.

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` | yes | The value type for this argument e.g `bool`, `int`, `uint`, `address` etc.
`value` | anyOf(`number`, `string`) | yes | The value of the argument to be passed to the function.


## ChainEventOperationSchema

An `object` that defines a blockchain event

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` in (`blockchain:event`) | yes | Must be set to `blockchain:event`.
`chains` | array<[ChainSchema](#chainschema)> | yes | All the chains for which this event is supported.
`signature` | `string` | yes | Signature of the event e.g `Transfer(address,uint256)` for ERC20 Transfer event.
`filters` | [ChainEventOperationFilterSchema](#chaineventoperationfilterschema) | yes | Defines the blockchain event filter parameters for this trigger.
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
`value` | `string` | yes | The actual value that is sent into the connector. Should match sample exactly.
`label` | `string` | yes | A human readable label for this value.
`sample` | `string` | yes | Displayed as light grey text in the editor. It's important that the value match the sample.


## RequestSchema

An `object` that represents an HTTP request. 

Key | Type | Required | Description
----|------|----------|------------
`method` | `string` in (`GET`, `PUT`, `POST`, `PATCH`, `DELETE`, `HEAD`) | no | The HTTP method for the request.
`url` | `string` | no | A URL for the request (the querystring will be parsed and merged with params). Keys and values will not be re-encoded.
`body` | oneOf(`null`, `string`, `object`, `array`) | no | Can be nothing, a raw string or JSON (object or array).
`params` | `object` | no | A mapping of the querystring - will get merged with any query params in the URL. Keys and values will be encoded.
`headers` | `object` | no | The HTTP headers for the request.
`auth` | oneOf(`array<string>`, `object`) | no | An object holding the auth parameters for OAuth1 request signing or an array to hold the username and password for Basic Auth.
