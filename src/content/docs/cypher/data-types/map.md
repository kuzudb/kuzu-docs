---
title: Map
sidebar_position: 15
---

# MAP

A `MAP` is a dictionary of key-value pairs where all keys have the same type and all values have the same type. Different from `STRUCT`, `MAP` doesn't require the same key to present in each row. Therefore, `MAP` is more suitable when the schema is not determined.

Internally, Kùzu process `MAP` as a `STRUCT[LIST]`, more sepcifically, a `STRUCT` with two `LIST` one for keys and the other for values.

| Data Type | DDL definition
| --- | --- | 
| MAP | MAP(STRING, INT64) | 

### `MAP` Creation

```
RETURN map([1, 2], ['a', 'b']) AS m;
--------------
| m          |
--------------
| {1=a, 2=b} |
--------------
```

### `Map` Extraction

```
RETURN map_extract(map([1, 2], ['a', 'b']),2) AS m;
-------
| m   |
-------
| [b] |
-------
```


More map functions can be found at [map-functions](https://docs.kuzudb.com/expressions/map-functions)
