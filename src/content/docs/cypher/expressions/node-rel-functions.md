---
title: Node/Rel Functions
description: Node/Rel functions are used to get information about nodes and relationships.
---

Node/Rel functions are used to get information about nodes and relationships.

| Function | Description |
| ----------- | ----------- |
| `ID` | returns the internal ID of node/rel |
| `LABEL` | returns the label name of node/rel |
| `OFFSET` | returns the offset of the internal ID |

See below for more details on each of these functions.

## ID
Returns the internal ID of node/rel.

| Input type | Output type |
| --- | --- |
| `NODE` | `ID` (Internal database ID) |
| `REL` | `ID` (Internal database ID) |

```cypher
MATCH (a:User) RETURN ID(a) AS ID LIMIT 1;
```
Output:
```
-------
| ID  |
-------
| 0:0 |
-------
```

## LABEL

Returns the label name of node/rel.

| Input type | Output type |
| --- | --- |
| `NODE` | `STRING` |
| `REL` | `STRING` |

```cypher
MATCH (a) RETURN LABEL(a) AS LABEL LIMIT 1;
```
Output:
```
---------
| LABEL |
---------
| User  |
---------
```

## OFFSET

Returns the offset of the internal ID.

| Input type | Output type |
| --- | --- |
| `ID` | `INT64` |


```cypher
MATCH (a) RETURN OFFSET(ID(a)) AS OFFSET LIMIT 1;
```
Output:
```
----------
| OFFSET |
----------
| 0      |
----------
```
