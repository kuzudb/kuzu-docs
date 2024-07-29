---
title: User defined types
---

Kùzu allows you to define a customized datatype in the system, by leveraging an existing built-in
type. The process of creating types involves using the `CREATE TYPE` keyword followed by
the type name. The `AS` keyword comes next, followed by an existing type in the system.

This type is useful when you want to create a new type that is more relevant to your business
logic, or when you want to extend an existing type. For example, you can create a
`LENGTH` data type based on the `BIGINT` type in Kùzu. See below for some examples.

You can define a user-defined type using the following grammar.

## Grammar
`CREATE TYPE <type_name> AS <existing_type>`

:::caution[Note]
The type name specified cannot clash with an existing type in the system.

The following cases are where `<type_name>` cannot clash with an `<existing_type>`:
1. A primitive type (e.g. `INT64`, `INT32`, `DOUBLE`)
2. A composite type (`INT64[4]`, `STRUCT(name string, age int64)`)
3. Another user-defined type
:::

## Examples

Create a user defined type `BIGINT` which is an alias of Kùzu's internal primitive type `INT64`
```cypher
CREATE TYPE BIGINT AS INT64;
```

You can create an additional user-defined type based on an existing user-defined type as follows:
```cypher
CREATE TYPE LENGTH AS BIGINT;
```

You can also use the existing user-defined type and cast it to another type:

Create a node table with a `BIGINT` column:
```cypher
CREATE NODE TABLE Person (id BIGINT, name STRING, age INT64, PRIMARY KEY(id));
```
Ingest data into the Person table:
```cypher
CREATE (p:Person {ID: 5, name: 'Kevin', age: 30});
CREATE (p:Person {ID: 10, name: 'Judy', age: 25});
```
Query the Person table and case the user-defined type an existing primitive type:
```cypher
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


