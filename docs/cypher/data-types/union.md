---
title: Union
sidebar_position: 13
---

# UNION

Kùzu's `UNION` is implemented by taking DuckDB's `UNION` type as a reference. Simialr to C++ `std::variant`, `UNION` is a nested data type that is capable of holding multiple alternative values with different types. The value under key "tag" is considered as the value being currently hold by the `UNION`.

Internally, `UNION` are implemented as `STRUCT` with "tag" as one of its keys.

| Data Type | DDL definition
| --- | --- | 
| UNION | UNION(price FLOAT, note STRING) | 

Consider the following csv file
```
1
aa
```

Example
```
CREATE NODE TABLE demo(a SERIAL, b UNION(num INT64, str STRING), PRIMARY KEY(a));
COPY demo from "csv file";

MATCH (d:demo) RETURN d.b;
-------
| d.b |
-------
| 1   |
-------
| aa  |
-------

MATCH (d:demo) RETURN union_extract(d.b, 'num');
--------------------------
| UNION_EXTRACT(d.b,num) |
--------------------------
| 1                      |
--------------------------
|                        |
--------------------------

MATCH (d:demo) RETURN union_extract(d.b, 'str');
--------------------------
| UNION_EXTRACT(d.b,str) |
--------------------------
|                        |
--------------------------
| aa                     |
--------------------------
```

## TODO(Ziyi): union_tag failed