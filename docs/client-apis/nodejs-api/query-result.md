# Query Result

<a name="QueryResult"></a>

- [QueryResult](#queryresult)
  - [new QueryResult(connection, queryResult)](#new-queryresultconnection-queryresult)
  - [queryResult.resetIterator()](#queryresultresetiterator)
  - [queryResult.hasNext() ⇒ Boolean](#queryresulthasnext--boolean)
  - [queryResult.getNumTuples() ⇒ Number](#queryresultgetnumtuples--number)
  - [queryResult.getNext() ⇒ Promise.<Object\>](#queryresultgetnext--promiseobject)
  - [queryResult.each(resultCallback, doneCallback, errorCallback)](#queryresulteachresultcallback-donecallback-errorcallback)
  - [queryResult.getAll() ⇒ Promise.<Array.<Object\>\>](#queryresultgetall--promisearrayobject)
  - [queryResult.all(resultCallback, errorCallback)](#queryresultallresultcallback-errorcallback)
  - [queryResult.getColumnDataTypes() ⇒ Promise.<Array.<String\>\>](#queryresultgetcolumndatatypes--promisearraystring)
  - [queryResult.getColumnNames() ⇒ Promise.<Array.<String\>\>](#queryresultgetcolumnnames--promisearraystring)

<a name="new_QueryResult_new"></a>

### new QueryResult(connection, queryResult)
Internal constructor. Use `Connection.query` or `Connection.execute`
to get a `QueryResult` object.


| Param | Type | Description |
| --- | --- | --- |
| connection | <code>Connection</code> | the connection object. |
| queryResult | <code>KuzuNative.NodeQueryResult</code> | the native query result object. |

<a name="QueryResult+resetIterator"></a>

### queryResult.resetIterator()
Reset the iterator of the query result to the beginning.
This function is useful if the query result is iterated multiple times.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  
<a name="QueryResult+hasNext"></a>

### queryResult.hasNext() ⇒ <code>Boolean</code>
Check if the query result has more rows.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  
**Returns**: <code>Boolean</code> - true if the query result has more rows.  
<a name="QueryResult+getNumTuples"></a>

### queryResult.getNumTuples() ⇒ <code>Number</code>
Get the number of rows of the query result.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  
**Returns**: <code>Number</code> - the number of rows of the query result.  
<a name="QueryResult+getNext"></a>

### queryResult.getNext() ⇒ <code>Promise.&lt;Object&gt;</code>
Get the next row of the query result.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - a promise that resolves to the next row of the query result. The promise is rejected if there is an error.  
<a name="QueryResult+each"></a>

### queryResult.each(resultCallback, doneCallback, errorCallback)
Iterate through the query result with callback functions.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  

| Param | Type | Description |
| --- | --- | --- |
| resultCallback | <code>function</code> | the callback function that is called for each row of the query result. |
| doneCallback | <code>function</code> | the callback function that is called when the iteration is done. |
| errorCallback | <code>function</code> | the callback function that is called when there is an error. |

<a name="QueryResult+getAll"></a>

### queryResult.getAll() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Get all rows of the query result.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - a promise that resolves to all rows of the query result. The promise is rejected if there is an error.  
<a name="QueryResult+all"></a>

### queryResult.all(resultCallback, errorCallback)
Get all rows of the query result with callback functions.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  

| Param | Type | Description |
| --- | --- | --- |
| resultCallback | <code>function</code> | the callback function that is called with all rows of the query result. |
| errorCallback | <code>function</code> | the callback function that is called when there is an error. |

<a name="QueryResult+getColumnDataTypes"></a>

### queryResult.getColumnDataTypes() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Get the data types of the columns of the query result.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - a promise that resolves to the data types of the columns of the query result. The promise is rejected if there is an error.  
<a name="QueryResult+getColumnNames"></a>

### queryResult.getColumnNames() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Get the names of the columns of the query result.

**Kind**: instance method of [<code>QueryResult</code>](#QueryResult)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - a promise that resolves to the names of the columns of the query result. The promise is rejected if there is an error.  
