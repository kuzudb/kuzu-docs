---
title: Connection
sidebar_position: 2
---

# Connection

<a name="#Connection"></a>

- [Connection](#connection)
    - [new Connection(database)](#new-connectiondatabase)
    - [connection.init()](#connectioninit)
    - [connection.execute(preparedStatement, params) ⇒ Promise.\<kuzu.QueryResult\>](#connectionexecutepreparedstatement-params--promisekuzuqueryresult)
    - [connection.prepare(statement) ⇒ Promise.\<kuzu.PreparedStatement\>](#connectionpreparestatement--promisekuzupreparedstatement)
    - [connection.query(statement) ⇒ Promise.\<kuzu.QueryResult\>](#connectionquerystatement--promisekuzuqueryresult)
    - [connection.setMaxNumThreadForExec(numThreads)](#connectionsetmaxnumthreadforexecnumthreads)
    - [connection.getNodeTableNames() ⇒ Promise.\<Array.\<String\>\>](#connectiongetnodetablenames--promisearraystring)
    - [connection.getRelTableNames() ⇒ Promise.\<Array.\<String\>\>](#connectiongetreltablenames--promisearraystring)
    - [connection.getNodePropertyNames(tableName) ⇒ Promise.\<Array.\<Object\>\>](#connectiongetnodepropertynamestablename--promisearrayobject)
    - [connection.getRelPropertyNames(tableName) ⇒ Promise.\<Object\>](#connectiongetrelpropertynamestablename--promiseobject)

<a name="new_Connection_new"></a>

### new Connection(database)
Initialize a new Connection object. Note that the initialization is done
lazily, so the connection is not initialized until the first query is
executed. To initialize the connection immediately, call the `init()`
function on the returned object.


| Param | Type | Description |
| --- | --- | --- |
| database | <code>kuzu.Database</code> | the database object to connect to. |

<a name="Connection+init"></a>

### connection.init()
Initialize the connection. Calling this function is optional, as the
connection is initialized automatically when the first query is executed.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
<a name="Connection+execute"></a>

### connection.execute(preparedStatement, params) ⇒ <code>Promise.&lt;kuzu.QueryResult&gt;</code>
Execute a prepared statement with the given parameters.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Returns**: <code>Promise.&lt;kuzu.QueryResult&gt;</code> - a promise that resolves to the query result. The promise is rejected if there is an error.  

| Param | Type | Description |
| --- | --- | --- |
| preparedStatement | <code>kuzu.PreparedStatement</code> | the prepared statement to execute. |
| params | <code>Object</code> | a plain object mapping parameter names to values. |

<a name="Connection+prepare"></a>

### connection.prepare(statement) ⇒ <code>Promise.&lt;kuzu.PreparedStatement&gt;</code>
Prepare a statement for execution.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Returns**: <code>Promise.&lt;kuzu.PreparedStatement&gt;</code> - a promise that resolves to the prepared statement. The promise is rejected if there is an error.  

| Param | Type | Description |
| --- | --- | --- |
| statement | <code>String</code> | the statement to prepare. |

<a name="Connection+query"></a>

### connection.query(statement) ⇒ <code>Promise.&lt;kuzu.QueryResult&gt;</code>
Execute a query.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Returns**: <code>Promise.&lt;kuzu.QueryResult&gt;</code> - a promise that resolves to the query result. The promise is rejected if there is an error.  

| Param | Type | Description |
| --- | --- | --- |
| statement | <code>String</code> | the statement to execute. |

<a name="Connection+setMaxNumThreadForExec"></a>

### connection.setMaxNumThreadForExec(numThreads)
Set the maximum number of threads to use for query execution.

**Kind**: instance method of [<code>Connection</code>](#Connection)  

| Param | Type | Description |
| --- | --- | --- |
| numThreads | <code>Number</code> | the maximum number of threads to use for query execution. |

<a name="Connection+getNodeTableNames"></a>

### connection.getNodeTableNames() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Get the names of all node tables in the database.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - a promise that resolves to an array of table names. The promise is rejected if there is an error.  
<a name="Connection+getRelTableNames"></a>

### connection.getRelTableNames() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Get the names of all relationship tables in the database.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - a promise that resolves to an array of table names. The promise is rejected if there is an error.  
<a name="Connection+getNodePropertyNames"></a>

### connection.getNodePropertyNames(tableName) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Get the names and types of all properties in the given node table. Each
property is represented as an object with the following properties:
- `name`: the name of the property.
- `type`: the type of the property.
- `isPrimaryKey`: whether the property is a primary key.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - a promise that resolves to an array of property names. The promise is rejected if there is an error.  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>String</code> | the name of the node table. |

<a name="Connection+getRelPropertyNames"></a>

### connection.getRelPropertyNames(tableName) ⇒ <code>Promise.&lt;Object&gt;</code>
Get the names and types of all properties in the given rel table.
The result is an object with the following properties:
- `name`: the name of the rel table.
- `src`: the name of the source node table.
- `dst`: the name of the destination node table.
- `props`: an array of property names and types.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - a promise that resolves to an object representing the properties of the rel table. The promise is rejected if there is an error.  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>String</code> | the name of the rel table. |
