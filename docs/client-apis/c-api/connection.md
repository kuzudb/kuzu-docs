---
title: Connection
sidebar_position: 1
---

## class kuzu_connection

kuzu_connection is used to interact with a Database instance. Each connection is thread-safe. Multiple connections can connect to the same Database instance in a multi-threaded environment.  

---

```c++
KUZU_C_API kuzu_connection* kuzu_connection_init (kuzu_database * database)
```
Allocates memory and creates a connection to the database. Caller is responsible for calling kuzu_connection_destroy() to release the allocated memory. 

**Parameters**
- `database` The database instance to connect to. 

**Returns:**
- The connection instance. 

---

```c++
KUZU_C_API void kuzu_connection_destroy (kuzu_connection * connection)
```
Destroys the connection instance and frees the allocated memory. 

**Parameters**
- `connection` The connection instance to destroy. 

---

```c++
KUZU_C_API kuzu_query_result* kuzu_connection_query (kuzu_connection * connection, const char * query)
```
Executes the given query and returns the result. 

**Parameters**
- `connection` The connection instance to execute the query. 
- `query` The query to execute. 

**Returns:**
- the result of the query. 

---

```c++
KUZU_C_API void kuzu_connection_begin_read_only_transaction (kuzu_connection * connection)
```
Begins a read-only transaction in the given connection. 

**Parameters**
- `connection` The connection instance to begin read-only transaction. 

---

```c++
KUZU_C_API void kuzu_connection_begin_write_transaction (kuzu_connection * connection)
```
Begins a write transaction in the given connection. 

**Parameters**
- `connection` The connection instance to begin write transaction. 

---

```c++
KUZU_C_API void kuzu_connection_commit (kuzu_connection * connection)
```
Commits the current transaction. 

**Parameters**
- `connection` The connection instance to commit transaction. 

---

```c++
KUZU_C_API kuzu_query_result* kuzu_connection_execute (kuzu_connection * connection, kuzu_prepared_statement * prepared_statement)
```
Executes the prepared_statement using connection. 

**Parameters**
- `connection` The connection instance to execute the prepared_statement. 
- `prepared_statement` The prepared statement to execute. 

---

```c++
KUZU_C_API uint64_t kuzu_connection_get_max_num_thread_for_exec (kuzu_connection * connection)
```
Returns the maximum number of threads of the connection to use for executing queries. 

**Parameters**
- `connection` The connection instance to return max number of threads for execution. 

---

```c++
KUZU_C_API char* kuzu_connection_get_node_property_names (kuzu_connection * connection, const char * table_name)
```
Returns all property names of the given node table. 

**Parameters**
- `connection` The connection instance to return all property names. 
- `table_name` The table name to return all property names. 

---

```c++
KUZU_C_API char* kuzu_connection_get_node_table_names (kuzu_connection * connection)
```
Returns all node table names of the database. 

**Parameters**
- `connection` The connection instance to return all node table names. 

---

```c++
KUZU_C_API char* kuzu_connection_get_rel_property_names (kuzu_connection * connection, const char * table_name)
```
Returns all property names of the given rel table. 

**Parameters**
- `connection` The connection instance to return all property names. 
- `table_name` The table name to return all property names. 

---

```c++
KUZU_C_API char* kuzu_connection_get_rel_table_names (kuzu_connection * connection)
```
Returns all rel table names of the database. 

**Parameters**
- `connection` The connection instance to return all rel table names. 

---


```c++
KUZU_C_API void kuzu_connection_interrupt (kuzu_connection * connection)
```
Interrupts the current query execution in the connection. 

**Parameters**
- `connection` The connection instance to interrupt. 

---

```c++
KUZU_C_API kuzu_prepared_statement* kuzu_connection_prepare (kuzu_connection * connection, const char * query)
```
Prepares the given query and returns the prepared statement. 

**Parameters**
- `connection` The connection instance to prepare the query. 
- `query` The query to prepare. 

---


```c++
KUZU_C_API void kuzu_connection_rollback (kuzu_connection * connection)
```
Rollbacks the current transaction. 

**Parameters**
- `connection` The connection instance to rollback transaction. 

---

```c++
KUZU_C_API void kuzu_connection_set_max_num_thread_for_exec (kuzu_connection * connection, uint64_t num_threads)
```
Sets the maximum number of threads to use for executing queries. 

**Parameters**
- `connection` The connection instance to set max number of threads for execution. 
- `num_threads` The maximum number of threads to use for executing queries. 

---

```c++
KUZU_C_API void kuzu_connection_set_query_timeout (kuzu_connection * connection, uint64_t timeout_in_ms)
```
Sets query timeout value in milliseconds for the connection. 

**Parameters**
- `connection` The connection instance to set query timeout value. 
- `timeout_in_ms` The timeout value in milliseconds. 

---