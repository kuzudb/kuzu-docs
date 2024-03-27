---
title: List
sidebar_position: 4
---

# LIST
Kùzu supports two LIST data types: variable-size list `VAR-LIST` and fixed-size `FIXED-LIST.`
`LIST` data types include values of a single data type. The data type of values within a `LIST` is declared before a set of brackets in DDL.
For example, `STRING[]` declares a `(VAR-)LIST` of STRING values.

A `VAR-LIST` type can contain arbitrary number of values with the same type. VAR-LISTS can be of any
type Kùzu supports including nested and complex type. For example, `STRING[][]` is
`VAR-LIST` of `VAR-LIST` of STRING values. Similarly, `MAP(STRING, STRING)[]`
is a `VAR-LIST` of `MAP(STRING, STRING)` values.

A `FIXED-LIST` type can contain fixed number of values with the same numeric type. For example,
`INT64[5]` is a `FIXED-LIST` of 5 INT64 values.  FIXED-LIST is an **experimental** feature designed
for Kùzu's [Pytorch Geometric integration](https://kuzudb.com/docusaurus/getting-started/python/#colab-notebooks). 

The below table summarizes VAR-LIST and FIXED-LIST data types and how to define them in DDL statements.

| Data Type | DDL Definition |
| --- | --- | 
| VAR-LIST | INT64[] |
| FIXED-LIST | INT64[5] |

Kùzu does not support operations on `FIXED-LIST` values (except casting values to `FIXED-LIST`).
Instead, Kùzu support several operations on VAR-LIST, which we cover below through several examples:

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

### UNWIND'ing `VAR-LIST`
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
