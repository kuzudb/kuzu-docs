---
title: User defined types
---

Kùzu allows you to define a customized datatype in the system, and use it the same way as you would a built-in type.
The process of creating types involves using the `CREATE TYPE` keyword followed by the type name.
The `AS` keyword comes next, followed by an existing type in the system.

## Grammar
`CREATE TYPE <type_name> AS <existing_type>`

:::caution[Note]
`<type_name>`: must be a unique name meaning that it can not be an existing type name.
`<existing_type>`:
1. a primitive type (e.g. int64, int32, double)
2. a composite type (INT64[4], STRUCT(name string, age int64))
3. another user defined type
:::

## Example:

Create a user defined type `BIGINT` which is an alias of Kùzu's internal primitive type `INT64`
```
CREATE TYPE BIGINT AS INT64;
```
Create a node table with a `BIGINT` column:
```
CREATE NODE TABLE Person (id BIGINT, PRIMARY KEY(id));
```
Ingest data into the Person table:
```
CREATE (p:Person {ID: 5});
CREATE (p:Person {ID: 10});
```
Query the Person table and cast `id` as `INT32`:
```
MATCH (p:Person) RETURN CAST(p.id AS INT32);
```
Result:
```
---------------------
| CAST(p.id, INT32) |
---------------------
| 5                 |
---------------------
| 10                |
---------------------
```

You can also create an additional user-defined type based on an existing user defined type:
```
CREATE TYPE LENGTH AS BIGINT;
```
