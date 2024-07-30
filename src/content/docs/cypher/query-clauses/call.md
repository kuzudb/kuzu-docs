---
title: Call
description: CALL clause is a reading clause used for executing schema functions.
---

The `CALL` clause is used for executing schema functions. The following tables lists
the built-in schema functions:

| Function | Description |
| ----------- | --------------- |
| `TABLE_INFO('tableName')` | returns metadata information of the given table |
| `CURRENT_SETTING('setting')` | returns the value of the given setting |
| `DB_VERSION()` | returns the version of Kùzu |
| `SHOW_TABLES()` | returns the name, type, comment of all tables in the database |
| `SHOW_CONNECTION('tableName')` | returns the source/destination nodes for a relationship/relgroup in the database |
| `SHOW_ATTACHED_DATABASES()` | returns the name, type of all attached databases |
| `SHOW_SEQUENCES()` | returns the name and properties of all sequences in the database |

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

### SHOW_SEQUENCES

`SHOW_SEQUENCES` returns the name and properties of all sequences in the database.

| Column        | Description                                                           | Type    |
| ------------- | --------------------------------------------------------------------- | ------- |
| name          | name of the sequence                                                  | STRING  |
| database name | the database the sequence is located in                               | STRING  |
| start value   | the start value of the sequence                                       | INT64   |
| increment     | the amount the sequence is incremented by each time                   | INT64   |
| min value     | the minimum value of the sequence                                     | INT64   |
| max value     | the maximum value of the sequence                                     | INT64   |
| cycle         | whether or not the sequence can wrap around when the limit is reached | BOOLEAN |

```cypher
CALL show_sequences() RETURN *;
```
Example output:
```
--------------------------------------------------------------------------------------------------------
| name             | database name | start value | increment | min value | max value           | cycle |
--------------------------------------------------------------------------------------------------------
| Person_id_serial | local(kuzu)   | 0           | 1         | 0         | 9223372036854775807 | False |
--------------------------------------------------------------------------------------------------------
| Seq2             | local(kuzu)   | 1           | 1         | 1         | 9223372036854775807 | False |
--------------------------------------------------------------------------------------------------------
| id_sequence      | local(kuzu)   | 0           | 1         | 0         | 9223372036854775807 | False |
--------------------------------------------------------------------------------------------------------
```
