---
title: Call
description: CALL clause is a reading clause used for executing schema functions.
---

The `CALL` clause is used for executing schema functions. This way of using `CALL` needs to be followed
with other query clauses, such as `RETURN` (see below for many examples) and is 
different from the standalone [`CALL` statement](/cypher/configuration) used for changing configuration.
The following tables lists the built-in schema functions you can use with the `CALL` clause:

| Function | Description |
| ----------- | --------------- |
| `CURRENT_SETTING('setting')` | returns the value of the given setting |
| `DB_VERSION()` | returns the version of Kùzu |
| `SHOW_TABLES()` | returns the name, type, comment of all tables in the database |
| `SHOW_CONNECTION('tableName')` | returns the source/destination nodes for a relationship/relgroup in the database |
| `SHOW_ATTACHED_DATABASES()` | returns the name, type of all attached databases |
| `SHOW_FUNCTIONS()` | returns all registered functions in the database |
| `TABLE_INFO('tableName')` | returns metadata information of the given table |

### TABLE_INFO

`TABLE_INFO` takes table name as a parameter and returns metadata information of the table.

| Column | Description | Type |
| ------ | ----------- | ---- |
| `property id` | Internal identifier of the property within table | INT64 |
| `name` | name of the property | STRING |
| `type` | data type of the property | STRING |
| `primary key` | if property is primary key | BOOLEAN |

```cypher
CALL TABLE_INFO('User') RETURN *;
```
Output:
```
---------------------------------------------
| property id | name | type   | primary key |
---------------------------------------------
| 0           | name | STRING | True        |
---------------------------------------------
| 1           | age  | INT64  | False       |
---------------------------------------------
```

### CURRENT_SETTING

`CURRENT_SETTING` returns the value of given database configuration.

<!-- All supported configurable database options can be found here: [configuration](../configuration) -->

```cypher
CALL current_setting('threads') RETURN *;
```
Output:
```
-----------
| threads |
-----------
| 8       |
-----------
```

### DB_VERSION

`DB_VERSION` returns current database version.

| Column | Description | Type |
| ------ | ----------- | ---- |
| version | database version | STRING |


```cypher
CALL db_version() RETURN *;
```
Output:
```
----------------
| KUZU_Version |
----------------
| v0.3.2       |
----------------
```

### SHOW_TABLES

`SHOW_TABLES` returns the name, type and comment of all tables in the database.

| Column | Description | Type |
| ------ | ----------- | ---- |
| name | name of the table | STRING |
| type | type of the table | STRING |
| comment | comment of the table | STRING |

```cypher
CALL show_tables() RETURN *;
```
Output:
```
--------------------------------------------
| name        | type | comment             |
--------------------------------------------
| gf          | RDF  |                     |
--------------------------------------------
| gf_TRIPLES  | REL  |                     |
--------------------------------------------
| gf_RESOURCE | NODE |                     |
--------------------------------------------
| person      | NODE | person info         |
--------------------------------------------
| knows       | REL  | person knows person |
--------------------------------------------
```

### SHOW_CONNECTION

`SHOW_CONNECTION` returns the source/destination nodes for a relationship/relationship group in the database.

| Column | Description | Type |
| ------ | ----------- | ---- |
| source table name | name of the source node table | STRING |
| destination table name | name of the destination node table | STRING |
| source table primary key | primary key of the source node table | STRING |
| destination table primary key | primary key of the destination node table | STRING |

Show connection on a relationship table:
```cypher
CALL show_connection('knows') RETURN *;
```
Output:
```
---------------------------------------------------------------------------------------------------------
| source table name | destination table name | source table primary key | destination table primary key |
---------------------------------------------------------------------------------------------------------
| person            | person                 | name                     | name                          |
---------------------------------------------------------------------------------------------------------
```
Show connection on a relationship group:
```cypher
CALL show_connection('knows') RETURN *;
```
Output:
```
----------------------------------------------
| source table name | destination table name |
----------------------------------------------
| user              | person                 |
----------------------------------------------
| person            | person                 |
----------------------------------------------
```

### SHOW_ATTACHED_DATABASES

`SHOW_ATTACHED_DATABASES` returns the name, database type of all attached databases.

| name | db_type |
| ------ | ----------- |
| name | name of the attached databases | STRING |
| db_type | type of the table | STRING |

```cypher
CALL show_attached_databases() RETURN *;
```
Output:
```
------------------------------------
| name             | database type |
------------------------------------
| tinysnb          | DUCKDB        |
------------------------------------
| dbfilewithoutext | DUCKDB        |
------------------------------------
```
