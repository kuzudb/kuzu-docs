---
title: Map
description: Map data type in Kuzu
---

## MAP

A `MAP` is a dictionary of key-value pairs where all keys have the same type and all values have the
same type. `MAP` is similar to `STRUCT` in that it is an ordered list of mappings. However, `MAP` does
not need to have the same keys present for each row, and is thus more suitable when the schema of an entity
is unknown beforehand or when the schema varies per row.

`MAP`s must have a single type for all keys, and a single type for all values. Additionally, keys of
a `MAP` do not need to be `STRING`s like they do in a `STRUCT`.

| Data Type | DDL definition |
| --- | --- |
| MAP | MAP(STRING, INT64) |

To construct a `MAP`, provide a list of keys and a list of values. The keys and values must be of the same length.

Example:

```cypher
RETURN map([1, 2], ['a', 'b']) AS m;
```
Output:
```
--------------
| m          |
--------------
| {1=a, 2=b} |
--------------
```

Functions that work on `MAP`s can be found [here](/cypher/expressions/map-functions).