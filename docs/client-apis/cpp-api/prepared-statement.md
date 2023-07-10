---
title: Prepared Statement
sidebar_position: 6
---

# PreparedStatement
`PreparedStatement` is a parameterized query which can avoid planning the same query for repeated execution.  

## Example
```
auto preparedStatement = conn->prepare("MATCH (a:person) WHERE a.isStudent = $1 RETURN COUNT(*)");
auto result = conn->execute(preparedStatement.get(), std::make_pair(std::string("1"), true));
```

## Available APIs

## class kuzu::main::PreparedStatement

A prepared statement is a parameterized query which can avoid planning the same query for repeated execution.  

---
**allowActiveTransaction**

```c++
bool allowActiveTransaction ()
```
DDL and COPY_CSV statements are automatically wrapped in a transaction and committed. As such, they cannot be part of an active transaction. 

**Returns:**
- the prepared statement is allowed to be part of an active transaction. 

---
**getErrorMessage**

```c++
std::string getErrorMessage ()
```

**Returns:**
- the error message if the query is not prepared successfully. 

---
**isReadOnly**

```c++
bool isReadOnly ()
```

**Returns:**
- the prepared statement is read-only or not. 

---
**isSuccess**

```c++
bool isSuccess ()
```

**Returns:**
- the query is prepared successfully or not. 

---
