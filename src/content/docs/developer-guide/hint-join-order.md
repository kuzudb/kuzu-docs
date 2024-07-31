---
title: Join order hints
description: Join order hint that allow users to enforce a specific join order
---

`HINT` is an optional clause allows you to enforce a specific query plan by explicitly declaring the join order or
the join strategy. See below for the available hints for Kùzu 0.5.0 and upward.

## Join order hint

In certain cases, Kùzu might generate a sub-optimal join order when the obtained statistics are
inaccurate at the optimization stage of a large graph query. We provide join order hints to allow
users to enforce a specific join order that bypasses Kùzu's optimizer.

As an example, for the following query, the optimizer will always compile a query plan that scans
from `a` due to the index lookup.

```cypher
MATCH (a)-[e]->(b)
WHERE a.ID = 0
RETURN *;
```

You could instead, force a plan that scans from `b`, by specifying the `HINT` clause as follows:

```cypher
MATCH (a)-[e]->(b)
WHERE a.ID = 0
HINT a JOIN (e JOIN b)
RETURN *;
```

### Worst-case optimal join (WCOJ) hint

There may be scenarios where the optimizer does not pick a WCOJ join, when in fact that was desirable.
You can enforce a WCOJ join by specifying the `MULTI_JOIN` hint, as follows:

```cypher
MATCH (a:person)<-[e1:knows]-(b:person)-[e2:knows]->(c:person), (a)-[e3:knows]->(c)
HINT (((a JOIN e1) JOIN b) MULTI_JOIN e2 MULTI_JOIN e3) JOIN c
RETURN COUNT(*)
```
