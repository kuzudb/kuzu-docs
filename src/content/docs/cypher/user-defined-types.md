---
title: User defined types
---

Kùzu allows you to define a customized datatype in the system, and use it as a built-in type.
The process of creating types involves using the `CREATE TYPE` keyword followed by the type name.
The `AS` keyword comes next, followed by an existing type in the system.

## Grammar
CREATE TYPE TYPE_NAME AS EXISTING_TYPE

:::caution[Note]
TYPE_NAME: must be a unique name meaning that it can not be an existing type name.
EXISTING_TYPE:
1. a primitive type (e.g. int64, int32, double)
2. a composite type (INT64[4], STRUCT(name string, age int64))
3. another user defined type
:::

## Example:

Create a user defined type BIGINT which is an alias of kuzu internal primitive: INT64
```
CREATE TYPE BIGINT AS INT64;
```
Create a node table with BIGINT column:
```
CREATE NODE TABLE PERSON (ID BIGINT, PRIMARY KEY(ID));
```
Ingest data into person table:
```
CREATE (p:PERSON {ID: 5});
CREATE (p:PERSON {ID: 10});
```
Query the PERSON table and cast ID as INT32:
```
MATCH (p:PERSON) RETURN CAST(p.ID AS INT32);
```
Result:
```
---------------------
| CAST(p.ID, INT32) |
---------------------
| 5                 |
---------------------
| 10                |
---------------------
```

Users can also create another user defined type based on an existing user defined type
```
CREATE TYPE LENGTH AS BIGINT;
```
