---
title: Schema Functions
description: Schema functions are used to get information about nodes and relationships.
---

# Schema Functions

| Function | Description |
| ----------- | ----------- |
| ID(NODE/RELATIONSHIP) | returns the internal ID of node/rel |
| LABEL(NODE/RELATIONSHIP) | returns the label name of node/rel |
| OFFSET(INTERNAL_ID) | returns the offset of internal ID |
| LEGNTH(RECURSIVE_RELATIONSHIP)| returns the length of recursive rel |

### ID Function
Returns the internal ID of node/rel.

**Input Type**: NODE/RELATIONSHIP

**Output Type**: INTERNAL_ID

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

### LABEL Function

Returns the label name of node/rel.

**Input Type**: NODE/RELATIONSHIP

**Output Type**: STRING

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

### OFFSET Function 

Returns the offset of internal ID

**Input Type**: INTERNAL_ID

**Output Type**: INT64

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

### LENGTH Function

Returns the length of recursive relationship

**Input Type**: RECURSIVE_RELATIONSHIP

**Output Type**: INT64

```
MATCH (a:User)-[e*SHORTEST 1 .. 5]->(b:City)
WHERE a.name = 'Adam'
RETURN b.name, length(e) AS length;
```
Output:
```
----------------------
| b.name    | length |
----------------------
| Waterloo  | 1      |
----------------------
| Kitchener | 2      |
----------------------
| Guelph    | 3      |
----------------------
```