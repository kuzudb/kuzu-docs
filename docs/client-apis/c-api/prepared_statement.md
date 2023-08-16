---
title: Prepared Statement
sidebar_position: 6
---

## struct kuzu_prepared_statement

kuzu_prepared_statement is a parameterized query which can avoid planning the same query for repeated execution.  

---

```c
void kuzu_prepared_statement_destroy (kuzu_prepared_statement * prepared_statement)
```
Destroys the prepared statement instance and frees the allocated memory. 

**Parameters**
- `prepared_statement` The prepared statement instance to destroy. 

---


```c
char* kuzu_prepared_statement_get_error_message (kuzu_prepared_statement * prepared_statement)
```

**Returns:**
- the error message if the statement is not prepared successfully. 

---

```c
bool kuzu_prepared_statement_is_success (kuzu_prepared_statement * prepared_statement)
```

**Returns:**
- the query is prepared successfully or not. 

---

```c
bool kuzu_prepared_statement_allow_active_transaction (kuzu_prepared_statement * prepared_statement)
```
DDL and COPY statements are automatically wrapped in a transaction and committed. As such, they cannot be part of an active transaction. 

**Returns:**
- the prepared statement is allowed to be part of an active transaction. 

---

```c
void kuzu_prepared_statement_bind_bool (kuzu_prepared_statement * prepared_statement, char * param_name, bool value)
```
Binds the given boolean value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The boolean value to bind. 

---

```c
void kuzu_prepared_statement_bind_date (kuzu_prepared_statement * prepared_statement, char * param_name, kuzu_date_t value)
```
Binds the given date value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The date value to bind. 

---

```c
void kuzu_prepared_statement_bind_double (kuzu_prepared_statement * prepared_statement, char * param_name, double value)
```
Binds the given double value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The double value to bind. 

---

```c
void kuzu_prepared_statement_bind_float (kuzu_prepared_statement * prepared_statement, char * param_name, float value)
```
Binds the given float value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The float value to bind. 

---

```c
void kuzu_prepared_statement_bind_int16 (kuzu_prepared_statement * prepared_statement, char * param_name, int16_t value)
```
Binds the given int16_t value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The int16_t value to bind. 

---

```c
void kuzu_prepared_statement_bind_int32 (kuzu_prepared_statement * prepared_statement, char * param_name, int32_t value)
```
Binds the given int32_t value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The int32_t value to bind. 

---

```c
void kuzu_prepared_statement_bind_int64 (kuzu_prepared_statement * prepared_statement, char * param_name, int64_t value)
```
Binds the given int64_t value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The int64_t value to bind. 

---

```c
void kuzu_prepared_statement_bind_interval (kuzu_prepared_statement * prepared_statement, char * param_name, kuzu_interval_t value)
```
Binds the given interval value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The interval value to bind. 

---

```c
void kuzu_prepared_statement_bind_string (kuzu_prepared_statement * prepared_statement, char * param_name, char * value)
```
Binds the given string value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The string value to bind. 

---

```c
void kuzu_prepared_statement_bind_timestamp (kuzu_prepared_statement * prepared_statement, char * param_name, kuzu_timestamp_t value)
```
Binds the given timestamp value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The timestamp value to bind. 

---

```c
void kuzu_prepared_statement_bind_value (kuzu_prepared_statement * prepared_statement, char * param_name, kuzu_value * value)
```
Binds the given kuzu value to the given parameter name in the prepared statement. 

**Parameters**
- `prepared_statement` The prepared statement instance to bind the value. 
- `param_name` The parameter name to bind the value. 
- `value` The kuzu value to bind. 

---
