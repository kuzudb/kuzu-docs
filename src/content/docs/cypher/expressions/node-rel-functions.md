---
title: Node & relationship functions
description: Node & relationship functions are used to get information about nodes and relationships.
---

The following functions are used to get information about nodes and relationships.

| Function | Description | Alias |
| ----------- | ----------- | ----------- |
| `ID` | returns the internal ID of node/rel | |
| `LABEL` | returns the label name of node/relationship | `LABELS` |
| `OFFSET` | returns the offset of the internal ID | |

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
┌─────────────┐
│ ID          │
│ INTERNAL_ID │
├─────────────┤
│ 0:0         │
└─────────────┘
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
┌────────┐
│ LABEL  │
│ STRING │
├────────┤
│ User   │
└────────┘
```

:::note[Alias `LABELS` is available]
As of version 0.9.0, the `LABELS` function can also be used as an alias for the `LABEL` function.
For example:

```cypher
MATCH (a) RETURN LABELS(a) AS LABELS LIMIT 1;
```
:::

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
┌────────┐
│ OFFSET │
│ INT64  │
├────────┤
│ 0      │
└────────┘
```
