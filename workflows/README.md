# Grindery Nexus Workflow Schema Definitions


## WorkflowSchema
An `object` that represents a workflow.

Key | Type | Required | Description
----|------|----------|------------
`title` | `string` | yes | A short name for the workflow
`trigger` | [OperationSchema](#operationschema) | yes | Defines the trigger of the workflow.
`actions` | array<[OperationSchema](#operationschema)> | yes | Defines the actions of the workflow.


## OperationSchema
An `object` that defines a workflow operation e.g a trigger or an action.

Key | Type | Required | Description
----|------|----------|------------
`type` | `string` in (`trigger`, `action`) | yes | The type of operation.
`connector` | `string` | yes | the identifier of the connector app that defines this operation.
`operation` | `string` | yes | the identifier of the connector app's trigger or action that defines this operation.
`input` | `object` | yes | An object that defines the user's input as a `key`, `value` map where the `key` is the input field's identifier as defined in the corresponding [FieldSchema](../connectors/README.md#fieldschema) and the value is the user defined input value.
`display` | `object` | no | An object that defines the user's input as a `key`, `label` map where the `key` is the input field's identifier as defined in the corresponding [FieldSchema](../connectors/README.md#fieldschema) and the label is the user friendly label that corresponds to the user's input value.
