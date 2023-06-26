---
title: List
sidebar_position: 5
---

# LIST
Kùzu supports two `LIST` data types: variable-size list `VAR-LIST` and fixed-size `FIXED-LIST`.

A `VAR-LIST` type can contain arbitrary number of values with the same type.

A `FIXED-LIST` type can contain fixed number of values with the same numerical type.


| Data Type | DDL definition
| --- | --- | 
| VAR-LIST | INT64[] |
| FIXED-LIST | INT64[5] |

**Note**: FIXED-LIST is an **experimental** feature. Kùzu only supports bulk loading (i.e. `COPY` statement) and reading for FIXED_LIST data type.

### `VAR-LIST` creation
```
RETURN ["Alice", "Bob"] AS l;
```
Output:
```
---------------
| l           |
---------------
| [Alice,Bob] |
---------------
```

### `VAR-LIST` creation with function
```
RETURN list_creation(1,2,3,4) AS l;
```
Output:
```
-------------
| l         |
-------------
| [1,2,3,4] |
-------------
```

### Unwind `VAR-LIST`
```
UNWIND [[1,2], [3], [4, 5]] AS x 
UNWIND x as y 
RETURN y;
```
Output:
```
-----
| y |
-----
| 1 |
-----
| 2 |
-----
| 3 |
-----
| 4 |
-----
| 5 |
-----
```
