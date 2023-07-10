---
title: Node
sidebar_position: 5
---

# Node
`NODE` is a logical type. Internally, `NODE` is processed as `STRUCT` type. A `NODE` always contains an internal ID field with key `_ID` and a label field with key `_LABEL`. The rest fields are node properties.

### Return `NODE` column
```
MATCH (a:User)
RETURN a;
```
Output:
```
----------------------------------------------------
| a                                                |
----------------------------------------------------
| {_ID: 0:0, _LABEL: User, name: Adam, age: 30}    |
----------------------------------------------------
| {_ID: 0:1, _LABEL: User, name: Karissa, age: 40} |
----------------------------------------------------
| {_ID: 0:2, _LABEL: User, name: Zhang, age: 50}   |
----------------------------------------------------
| {_ID: 0:3, _LABEL: User, name: Noura, age: 25}   |
----------------------------------------------------
```