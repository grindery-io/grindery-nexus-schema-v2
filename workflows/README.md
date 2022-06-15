# Grindery Nexus Workflow Schema Definitions

Workflows define a sequence of actions to be executed predicated on a trigger (an event or condition).

Workflows leverage the composability of connectors hence a workflow can include triggers and actions from multiple connectors.


## WorkflowSchema

An `object` that represents a workflow.

Key | Type | Required | Description
----|------|----------|------------
`title` | `string` | yes | A short name for the workflow
`trigger` | [OperationSchema](#operationschema) | yes | Defines the trigger of the workflow.
`actions` | array<[OperationSchema](#operationschema)> | yes | Defines the actions of the workflow.
`creator` | [DIDSchema](../connectors/README.md#didschema) | yes | The DID of the creator of this workflow.
`signature` | `string` | yes | signature of the workflow definition by the creator (i.e JSON of all fields except signature).
`state` | `string` in (`on`, `off`) | yes | State of the workflow. If `on` workflow must be executed immediately. If `off` workflow must be saved, but not executed.

## OperationSchema

An `object` that defines a workflow operation e.g a trigger or an action.

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` in (`trigger`, `action`) | yes | The type of operation.
`connector` | `string` | yes | the identifier of the connector app that defines this operation.
`operation` | `string` | yes | the identifier of the connector app's trigger or action that defines this operation.
`input` | `object` | yes | An object that defines the user's input as a `key`, `value` map where the `key` is the input field's identifier as defined in the corresponding [FieldSchema](../connectors/README.md#fieldschema) and the value is the user defined input value.
`display` | `object` | no | An object that defines the user's input as a `key`, `label` map where the `key` is the input field's identifier as defined in the corresponding [FieldSchema](../connectors/README.md#fieldschema) and the label is the user friendly label that corresponds to the user's input value.
`authentication` | `string` | no | the identifier of the connector app's authentication config.
