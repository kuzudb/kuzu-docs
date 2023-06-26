# Prepared Statement

<a name="#PreparedStatement"></a>

- [PreparedStatement](#preparedstatement)
  - [new PreparedStatement(connection, preparedStatement)](#new-preparedstatementconnection-preparedstatement)
  - [preparedStatement.isSuccess() ⇒ Boolean](#preparedstatementissuccess--boolean)
  - [preparedStatement.getErrorMessage() ⇒ String](#preparedstatementgeterrormessage--string)

<a name="new_PreparedStatement_new"></a>

### new PreparedStatement(connection, preparedStatement)
Internal constructor. Use `Connection.prepare` to get a
`PreparedStatement` object.


| Param | Type | Description |
| --- | --- | --- |
| connection | <code>Connection</code> | the connection object. |
| preparedStatement | <code>KuzuNative.NodePreparedStatement</code> | the native prepared statement object. |

<a name="PreparedStatement+isSuccess"></a>

### preparedStatement.isSuccess() ⇒ <code>Boolean</code>
Check if the prepared statement is successfully prepared.

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Returns**: <code>Boolean</code> - true if the prepared statement is successfully prepared.  
<a name="PreparedStatement+getErrorMessage"></a>

### preparedStatement.getErrorMessage() ⇒ <code>String</code>
Get the error message if the prepared statement is not successfully prepared.

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Returns**: <code>String</code> - the error message.  
