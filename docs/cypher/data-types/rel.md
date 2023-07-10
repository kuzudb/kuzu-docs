---
title: Rel
sidebar_position: 8
---

# REL
`REL` is a logical type. Internally, `REL` is processed as `STRUCT` type. A `REL` always contains a src ID field with key `_SRC`, a dst ID field with key `_DST`, an internal ID field with key `_ID` and a label field with key `_LABEL`. The rest fields are rel properties.

# Return `REL` column
```
MATCH (a:User)-[e:Follows]->(b:User)
RETURN e;
```
Output:
```
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) |
---------------------------------------------------------
| (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) |
---------------------------------------------------------
| (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) |
---------------------------------------------------------
```