---
title: Call
sidebar_position: 11
description: CALL clause is a reading clause used for executing schema functions.
---

# CALL

`CALL` clause is a reading clause used for executing schema functions. The following tables lists built-in schema functions

| Function | Description |
| ----------- | --------------- |
| TABLE_INFO('tableName') | returns metadata information of the given table |
| CURRENT_SETTING('setting') | returns the value of the given setting |
| DB_VERSION() | returns the version of Kùzu |


### TABLE_INFO

TABLE_INFO takes table name as a parameter and returns metadata information of the table. 

| Column | Description | Type |
| ------ | ----------- | ---- |
| property id | Internal identifier of the property within table | INT64 |
| name | name of the property | STRING |
| type | data type of the property | STRING |
| primary key |  if property is primary key | BOOLEAN |

```
CALL TABLE_INFO('User') return *;
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

CURRENT_SETTING returns the value of given database configuration.

All supported configurable database options can be found here: [configuration](../configuration.md)

```
CALL current_setting('threads') return *;
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

DB_VERSION returns current database version.

| Column | Description | Type |
| ------ | ----------- | ---- |
| version | database version | STRING |


```
CALL db_version() RETURN *;
```
Output:
```
----------------
| KUZU_Version |
----------------
| v0.4.0       |
----------------
```
