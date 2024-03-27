---
title: Casting Functions
description: Casting functions are used to cast values from one type to another.
---

Kùzu supports casting values to different data types via an explicit casting `CAST(source, type)` function.

A floating-point number can be cast to an integer:

```cypher
RETURN CAST(2.3, "INT8") AS l;
```
Returns:
```
-----
| l |
-----
| 2 |
-----
```

Not all inputs can be cast to every data type. For example, `INT[]` can not be cast to `INT`. Even
if a cast between the input's data type to the target type is well defined, the cast can still fail
if the input's value is not suitable to cast. For example, casting the `STRING` data type to
`INT` is well defined -- you cannot cast `"abc"` to `INT`, but you can cast `"12"` to `INT`.

```cypher
RETURN CAST("12", "INT") AS l;
```
Returns:
```
-----
| l |
-----
| 12 |
```

A string array can be cast to an integer array as follows:

```cypher
RETURN CAST("[1,2,3]", "INT[]") AS l;
```
Returns:
```
-----------
| l       |
-----------
| [1,2,3] |
-----------
```
