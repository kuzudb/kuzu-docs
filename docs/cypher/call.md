---
title: CALL
sidebar_position: 4
---

# CALL statement

CALL statements in Kùzu serve as a powerful tool for controlling and querying the internal state of the database engine. These statements provide fine-grained control over specific functionalities and allow you to customize the behavior of Kùzu to suit your specific requirements. 

Kùzu currently supports two types of CALLs: STANDALONE_CALL, IN_QUERY_CALL.

### STANDALONE_CALL
STANDALONE_CALL is implemented as standalone statement and can cannot be combined with a query. It is typically used to change a configuration of database.

Supported STANDALONE_CALL:
| Option | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| THREADS | set the number of threads used by execution | CALL THREADS=5 | set execution thread to 5 |
| timeout | set the timeout value of query execution | CALL TIMEOUT=3000 | set the timeout value of query to 3000ms |

### INQUERY CALL
INQUERY_CALL can be combined with other match statements in a query. It is typically used to query the internal state of the database engine, and results are returned as table format.

Supported INQUERY CALL functions：
| Option | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| TABLE_INFO('tableName') | returns the properties information of the given table | CALL TABLE_INFO('person') return * | returns all properties of person table |
| CURRENT_SETTING('setting') | returns the value of the given setting, an exception will be thrown if the setting is invalid | CALL current_setting('threads') return * | returns the number of threads for execution |
| DB_VERSION() | returns the version of Kùzu | CALL DB_VERSION() return * | returns the current version of kuzu |
