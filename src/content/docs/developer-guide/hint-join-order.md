---
title: Hint Join Order
---

## Hint Join Order

Sometimes, Kùzu might give a sub-optimal join order when statistics is in-accurate or trying to optimize a large query graph. Join order hints allows user to by-pass optimizer and enforce a specific join order. 

E.g. for the following query, optimizer will always compile a plan that scans from `a` due to the index lookup.
```cypher
MATCH (a)-[e]->(b)
WHERE a.ID = 0
RETURN *;
```
User could instead, force a plan that scans from `b` through `HINT`
```cypher
MATCH (a)-[e]->(b)
WHERE a.ID = 0
HITN a JOIN (e JOIN b)
RETURN *;
```

### Hint Worst Case Optimal Join

User could also force worst case optimal join through `MULTI_JOIN` hint.
```
MATCH (a:person)<-[e1:knows]-(b:person)-[e2:knows]->(c:person), (a)-[e3:knows]->(c)
HINT (((a JOIN e1) JOIN b) MULTI_JOIN e2 MULTI_JOIN e3) JOIN c
RETURN COUNT(*)
```