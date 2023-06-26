---
title: Query Result
sidebar_position: 2
---

## class kuzu_query_result

kuzu_query_result stores the result of a query.  

---

## class kuzu_query_summary

kuzu_query_summary stores the execution time, plan, compiling time and query options of a query.  

---

```c++
KUZU_C_API void kuzu_query_result_destroy (kuzu_query_result * query_result)
```
Destroys the given query result instance. 

**Parameters**
- `query_result` The query result instance to destroy. 

---

```c++
KUZU_C_API kuzu_logical_type* kuzu_query_result_get_column_data_type (kuzu_query_result * query_result, uint64_t index)
```
Returns the data type of the column at the given index. 

**Parameters**
- `query_result` The query result instance to return. 
- `index` The index of the column to return data type. 

---

```c++
KUZU_C_API char* kuzu_query_result_get_column_name (kuzu_query_result * query_result, uint64_t index)
```
Returns the column name at the given index. 

**Parameters**
- `query_result` The query result instance to return. 
- `index` The index of the column to return name. 

---

```c++
KUZU_C_API char* kuzu_query_result_get_error_message (kuzu_query_result * query_result)
```
Returns the error message if the query is failed. 

**Parameters**
- `query_result` The query result instance to check and return error message. 

---

```c++
KUZU_C_API kuzu_flat_tuple* kuzu_query_result_get_next (kuzu_query_result * query_result)
```
Returns the next tuple in the query result. Throws an exception if there is no more tuple. 

**Parameters**
- `query_result` The query result instance to return. 

---

```c++
KUZU_C_API uint64_t kuzu_query_result_get_num_columns (kuzu_query_result * query_result)
```
Returns the number of columns in the query result. 

**Parameters**
- `query_result` The query result instance to return. 

---

```c++
KUZU_C_API uint64_t kuzu_query_result_get_num_tuples (kuzu_query_result * query_result)
```
Returns the number of tuples in the query result. 

**Parameters**
- `query_result` The query result instance to return. 

---


```c++
KUZU_C_API kuzu_query_summary* kuzu_query_result_get_query_summary (kuzu_query_result * query_result)
```
Returns the query summary of the query result. 

**Parameters**
- `query_result` The query result instance to return. 

---

```c++
KUZU_C_API bool kuzu_query_result_has_next (kuzu_query_result * query_result)
```
Returns true if we have not consumed all tuples in the query result, false otherwise. 

**Parameters**
- `query_result` The query result instance to check. 

---

```c++
KUZU_C_API bool kuzu_query_result_is_success (kuzu_query_result * query_result)
```
Returns true if the query is executed successful, false otherwise. 

**Parameters**
- `query_result` The query result instance to check. 

---

```c++
KUZU_C_API void kuzu_query_result_reset_iterator (kuzu_query_result * query_result)
```
Resets the iterator of the query result to the beginning of the query result. 

**Parameters**
- `query_result` The query result instance to reset iterator. 

---

```c++
KUZU_C_API char* kuzu_query_result_to_string (kuzu_query_result * query_result)
```
Returns the query result as a string. 

**Parameters**
- `query_result` The query result instance to return. 

---

```c++
KUZU_C_API void kuzu_query_result_write_to_csv (kuzu_query_result * query_result, const char * file_path, char delimiter, char escape_char, char new_line)
```
Writes the query result to the given file path as CSV. 

**Parameters**
- `query_result` The query result instance to write. 
- `file_path` The file path to write the query result. 
- `delimiter` The delimiter character to use when writing csv file. 
- `escape_char` The escape character to use when writing csv file. 
- `new_line` The new line character to use when writing csv file. 

---

```c++
KUZU_C_API void kuzu_query_summary_destroy (kuzu_query_summary * query_summary)
```
Destroys the given query summary. 

**Parameters**
- `query_summary` The query summary to destroy. 

---

```c++
KUZU_C_API double kuzu_query_summary_get_compiling_time (kuzu_query_summary * query_summary)
```
Returns the compilation time of the given query summary. 

**Parameters**
- `query_summary` The query summary to get compilation time. 

---

```c++
KUZU_C_API double kuzu_query_summary_get_execution_time (kuzu_query_summary * query_summary)
```
Returns the execution time of the given query summary. 

**Parameters**
- `query_summary` The query summary to get execution time. 

---