---
title: Struct
sidebar_position: 11
---

# STRUCT
A `STRUCT` is a dictionary of key-value pairs where keys are of type STRING. `STRUCT` is a fixed-size data type so values with the same `STRUCT` type must contain the same set of keys. User can think of a `STRUCT` column as a nested single column over multiple other columns.

| Data Type | DDL definition
| --- | --- | 
| STRUCT | STRUCT(a INT64, b INT64) | 

**Note**: Updating `STRUCT` with update statement is not yet supported.

### `STRUCT` creation
```
RETURN {first:'Xiyang', last:'Feng'};
```
Output:
```
-------------------------------
| STRUCT_PACK(Xiyang,Feng)    |
-------------------------------
| {FIRST: Xiyang, LAST: Feng} |
-------------------------------
```

### `STRUCT` extraction
```
WITH {first:'Xiyang', last:'Feng'} AS fullName
RETURN fullName.first AS firstName;
```
Output:
```
-------------
| firstName |
-------------
| Xiyang    |
-------------
```

Alternatively you can use struct_extract() function
```
WITH {first:'Xiyang', last:'Feng'} AS fullName
RETURN struct_extract(fullName, 'first') AS firstName;
```
