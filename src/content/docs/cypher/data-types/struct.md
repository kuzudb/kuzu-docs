---
title: Struct
description: Struct data type in Kuzu
---

## STRUCT

A `STRUCT` is a mapping of key-value pairs where the keys are of the type `STRING`. `STRUCT` is a
**fixed-size** data type so values with the same `STRUCT` type must contain the same set of key-value pairs.
You can think of a `STRUCT` column as a nested single column over multiple other columns.

| Data Type | DDL definition |
| --- | --- |
| STRUCT | STRUCT(a INT64, b INT64) |

To construct a `STRUCT`, provide a mapping of keys to values as follows:

```cypher
RETURN {first: 'Adam', last: 'Smith'};
```

Output:
```
-------------------------------
| STRUCT_PACK(Adam,Smith)    |
-------------------------------
| {FIRST: Adam, LAST: Smith} |
-------------------------------
```

You can extract a value from a `STRUCT` using the dot notation:

```cypher
WITH {first: 'Adam', last: 'Smith'} AS full_name
RETURN full_name.first AS first_name;
```
Output:
```
-------------
| first_name |
-------------
| Adam |
-------------
```

Alternatively you can use the `struct_extract()` function
```cypher
WITH {first:'Adam', last: 'Smith'} AS full_name
RETURN struct_extract(full_name, 'first') AS first_name;
```

Functions that work on `STRUCT`s can be found [here](/cypher/expressions/struct-functions).