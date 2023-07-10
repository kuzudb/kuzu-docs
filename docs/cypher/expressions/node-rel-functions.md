---
title: Node/Rel Functions
description: Node/Rel functions are used to get information about nodes and relationships.
---

# Node/Rel Functions

| Function | Description |
| ----------- | ----------- |
| ID | returns the internal ID of node/rel |
| LABEL | returns the label name of node/rel |
| OFFSET | returns the offset of internal ID |

### ID
Returns the internal ID of node/rel.

**Input Type**: `NODE`/`REL`

**Output Type**: `INTERNAL_ID`

```
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

### LABEL

Returns the label name of node/rel.

**Input Type**: `NODE`/`REL`

**Output Type**: `STRING`

```
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

### OFFSET 

Returns the offset of internal ID

**Input Type**: `INTERNAL_ID`

**Output Type**: `INT64`

```
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
