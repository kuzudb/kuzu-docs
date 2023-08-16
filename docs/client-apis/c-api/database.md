---
title: Database
sidebar_position: 0
---

## struct kuzu_database

kuzu_database manages all database components.  

---

```c
kuzu_database* kuzu_database_init (const char * database_path, uint64_t buffer_pool_size)
```
Allocates memory and creates a kuzu database instance at database_path with bufferPoolSize=buffer_pool_size. Caller is responsible for calling kuzu_database_destroy() to release the allocated memory. 

**Parameters**
- `database_path` The path to the database. 
- `buffer_pool_size` The size of the buffer pool in bytes. 

**Returns:**
- The database instance. 

---

```c
void kuzu_database_destroy (kuzu_database * database)
```
Destroys the kuzu database instance and frees the allocated memory. 

**Parameters**
- `database` The database instance to destroy. 

---

```c
void kuzu_database_set_logging_level (const char * logging_level)
```
Sets the logging level of the database. 

**Parameters**
- `logging_level` The logging level to set. Supported logging levels are: 'info', 'debug', 'err'. 

---