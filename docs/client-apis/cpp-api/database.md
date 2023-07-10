---
title: Database
sidebar_position: 0
---

# Database

To use Kùzu, you need to first create a `Database` instance.
The `Database` class requires: 
 1. `databasePath`, which sets the path to the directory of your database;
 2. a `SystemConfig` object, which sets the size of the buffer pool, and max num of threads.

To construct a Database instance, databasePath is mandatory.
Currently, we do not support the in-memory mode, thus, each database must point to a directory in the file system.

By default, SystemConfig sets the max size of the buffer pool to 80% of the system physical memory and max num threads to `std::thread::hardware_concurrency();`.
You can set a customized max buffer pool size (e.g., several GBs) through the constructor of `SystemConfig`.
For example:
```
SystemConfig systemConfig(1ull << 31 /* set max buffer pool size to 2GB */);
Database database("testdb", systemConfig);
...
```

By setting a buffer pool size to `x`, Kùzu' buffer pool is limited to use at most `x` amount of memory.
Instead of grabbing all of the memory at the initial startup, Kùzu grabs memory on demand, until hit the size.

Also: Do not construct multiple Database instances either within the same process or 
using multiple separate processes unless you will only issue read-only queries
through the connections you create from these these Database instances.
See [this note](..#note-on-connecting-to-the-same-database-directory-from-multiple-database-instances) for more details.

## Available APIs

## class kuzu::main::Database

Database class is the main class of KùzuDB. It manages all database components.  

---
**Database**

```c++
Database (std::string databasePath)
```
Creates a database object at the given path with the default buffer pool size and max num threads. 

**Parameters**
- `databasePath` Database path. 

---
**Database**

```c++
Database (std::string databasePath, SystemConfig systemConfig)
```
Creates a database object at the given path with customized buffer pool size and max num threads.

**Parameters**
- `databasePath` Database path. 
- `systemConfig` System configurations (buffer pool size and max num threads). 

---
**setLoggingLevel**

```c++
void setLoggingLevel (std::string loggingLevel)
```
Sets the logging level of the database instance. 

**Parameters**
- `loggingLevel` New logging level. (Supported logging levels are: 'info', 'debug', 'err'). 

---

## class kuzu::main::SystemConfig

Stores buffer pool size and max number of threads configurations.  

---

```c++
SystemConfig (uint64_t bufferPoolSize)
```
Creates a SystemConfig object. 

**Parameters**
- `bufferPoolSize` Buffer pool size in bytes. 
