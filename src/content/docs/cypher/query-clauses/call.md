---
title: Call
description: CALL clause is a reading clause used for executing schema functions.
---

The `CALL` clause is used for executing schema functions. This way of using `CALL` needs to be followed
with other query clauses, such as `RETURN` (see below for many examples) and is
different from the standalone [`CALL` statement](/cypher/configuration) used for changing configuration.
The following tables lists the built-in schema functions you can use with the `CALL` clause:

| Function | Description                                                                                  |
| ----------- |----------------------------------------------------------------------------------------------|
| `CURRENT_SETTING('setting')` | returns the value of the given setting                                                       |
| `DB_VERSION()` | returns the version of Kùzu                                                                  |
| `SHOW_TABLES()` | returns the name, type, comment of all tables in the database                                |
| `SHOW_CONNECTION('tableName')` | returns the source/destination nodes for a relationship/relgroup in the database             |
| `SHOW_ATTACHED_DATABASES()` | returns the name, type of all attached databases                                             |
| `SHOW_FUNCTIONS()` | returns all registered functions in the database                                             |
| `SHOW_WARNINGS()` | returns the contents of the [Warnings Table](/import#warnings-table-inspecting-skipped-rows) |
| `CLEAR_WARNINGS()` | clears all warnings in the [Warnings Table](/import#warnings-table-inspecting-skipped-rows)  |
| `TABLE_INFO('tableName')` | returns metadata information of the given table                                              |

### TABLE_INFO

`TABLE_INFO` takes table name as a parameter and returns metadata information of the table.

| Column | Description | Type |
| ------ | ----------- | ---- |
| `property id` | Internal identifier of the property within table | INT64 |
| `name` | name of the property | STRING |
| `type` | data type of the property | STRING |
| `default expression` | default value of property when none is specified | STRING |
| `primary key` | if property is primary key | BOOLEAN |

```cypher
CALL TABLE_INFO('User') RETURN *;
```
Output:
```
┌─────────────┬──────────────┬────────┬──────────────────────┬──────────────┐
│ property id │ name         │ type   │ default expression   │ primary key  │
│ INT32       │ STRING       │ STRING │ STRING               │ BOOL         │
├─────────────┼──────────────┼────────┼──────────────────────┼──────────────┤
│ 0           │ name         │ STRING │ NULL                 │ True         │
│ 1           │ age          │ INT64  │ 0                    │ False        │
└─────────────┴──────────────┴────────┴──────────────────────┴──────────────┘
```

### CURRENT_SETTING

`CURRENT_SETTING` returns the value of given database configuration.

```cypher
CALL current_setting('threads') RETURN *;
```
Output:
```
┌─────────┐
│ threads │
│ STRING  │
├─────────┤
│ 12      │
└─────────┘
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
┌─────────┐
│ version │
│ STRING  │
├─────────┤
│ 0.x.0   │
└─────────┘
```

### SHOW_TABLES

`SHOW_TABLES` returns the id, name, type and comment of all tables in the database.

| Column | Description | Type |
| ------ | ----------- | ---- |
| id   | id of the table   | INT    |
| name | name of the table | STRING |
| type | type of the table | STRING |
| comment | comment of the table | STRING |

```cypher
CALL show_tables() RETURN *;
```
Output:
```
┌────────┬─────────┬────────┬───────────────┬─────────┐
│ id     │ name    │ type   │ database name │ comment │
│ UINT64 │ STRING  │ STRING │ STRING        │ STRING  │
├────────┼─────────┼────────┼───────────────┼─────────┤
│ 0      │ User    │ NODE   │ local(kuzu)   │         │
│ 2      │ Follows │ REL    │ local(kuzu)   │         │
│ 1      │ City    │ NODE   │ local(kuzu)   │         │
│ 3      │ LivesIn │ REL    │ local(kuzu)   │         │
└────────┴─────────┴────────┴───────────────┴─────────┘
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
CALL show_connection('LivesIn') RETURN *;
```
Output:
```
┌───────────────────┬────────────────────────┬──────────────────────────┬───────────────────────────────┐
│ source table name │ destination table name │ source table primary key │ destination table primary key │
│ STRING            │ STRING                 │ STRING                   │ STRING                        │
├───────────────────┼────────────────────────┼──────────────────────────┼───────────────────────────────┤
│ User              │ City                   │ name                     │ name                          │
└───────────────────┴────────────────────────┴──────────────────────────┴───────────────────────────────┘
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
┌─────────────┬────────────────┐
│ name        │ database type  │
│ STRING      │ STRING         │
├─────────────┼────────────────┤
│ tinysnb     │ DUCKDB         │
│ anotherdb   │ POSTGRES       │
└─────────────┴────────────────┘
```

### SHOW_WARNINGS

`SHOW_WARNINGS` returns the contents of the
[Warnings Table](/import#warnings-table-inspecting-skipped-rows). This is a feature
related to [ignoring errors](/import#ignore-erroneous-rows) when running `COPY/LOAD FROM` statements to scan files. 
They will only be reported if the [`IGNORE_ERRORS`](/import#ignore-erroneous-rows) setting is enabled. 
Note that the number of warnings that are stored is limited by the `warning_limit` parameter.
See [configuration](/cypher/configuration#configure-warning-limit) for more details on how to set the warning limit.
After `warning_limit` many warnings are stored, any new warnings generated will not be stored. 

| Column | Description | Type |
| ------ | ----------- | ---- |
| query_id | The query that triggered the warning | UINT64 |
| message | A description of what triggered the warning | STRING |
| file_path | The path to the file that triggered the warning | STRING |
| line_number | The line number in the file that triggered the warning. | UINT64 |
| skipped_line_or_record | The line or record (depending on the type of file that is being read from) containing the actual value that triggered the warning. For example, for CSV files this will be the line number and for JSON files this will be the record number. | STRING |

```cypher
CALL show_warnings() RETURN *;
```
Output:
```
┌──────────┬─────────────────────────────────────────────────────────────────────────────┬─────────────┬─────────────┬────────────────────────┐
│ query_id │ message                                                                     │ file_path   │ line_number │ skipped_line_or_record │
│ UINT64   │ STRING                                                                      │ STRING      │ UINT64      │ STRING                 │
├──────────┼─────────────────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼────────────────────────┤
│ 1        │ Conversion exception: Cast failed. Could not convert "2147483650" to INT32. │ vPerson.csv │ 2           │ 2,2147483650           │
└──────────┴─────────────────────────────────────────────────────────────────────────────┴─────────────┴─────────────┴────────────────────────┘
```

### CLEAR_WARNINGS
If you would like to clear the contents of the [Warnings Table](/import#warnings-table-inspecting-skipped-rows), you can run the `CLEAR_WARNINGS` function. 
This function has no output.

```cypher
CALL clear_warnings();
```
