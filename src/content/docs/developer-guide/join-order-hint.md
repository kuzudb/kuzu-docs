---
title: Join order hints
description: Join order hint that allow users to enforce a specific join order
---

`HINT` is an optional clause allows you to enforce a specific query plan by explicitly declaring the join order or
the join strategy. See below for the available hints for Kùzu 0.5.0 and upward.

## Join order hint

Consider the following query
```cypher
MATCH (a:person)-[e:LivesIn]->(b:City)
RETURN *;
```
The system optimizer has its freedom to generate a query plan that finds all edges from `a` to `b` using forward adjacency list or from `b` to `a` using a backward adjacency list. Both query plans are semantically equivalent and generate the same query result. There is, however, a potential performance difference because `a` and `b` may have different cardinalities.

To enforce a particular join order (you may want to do this for experimental purposes, or when the optimizer provides a sub-optimal plan), use `HINT` and write a join order with the following rules:
- Join hint works within the scope of a single `MATCH` pattern. Hint across different join patterns is not supported.
- All node/relationship variable must be named and appear in the join order
- The join order is a binary tree where the tree node is either a variable or a sub-join order tree enclosed in parentheses


For example, we can enforce a query plan that scans from `b` with a backward adjacency list as follows:
```cypher
MATCH (a)-[e]->(b)
WHERE a.ID = 0
HINT a JOIN (e JOIN b)
RETURN *;
```

### Multi-way join hint

This section assumes you are knowledgeable about worst-case-optimal joins (WCOJ). For cyclic queries, we allow not only binary join hints but also multi-way join (worst-case-optimal-join) hints. When hinting k-way joins, the following rules needs to be satisfied:

- Use the keyword `MULTI_JOIN` instead of `JOIN`.
- Within `k` tree nodes, `k-1` of them must be edge variables - these edges must intersect at a single node.

When we perform the k-way join between a subplan and `k-1` edges, for each input tuple from the subplan, we find an adjacency list from each edge table and sort-merge join them on the intersected node.

For example, in the following query, we find the forward adjacency list for `e2` and `e3` and intersect them over `c` for each `(a, e1, b)` input.
```cypher
MATCH (a:person)<-[e1:knows]-(b:person)-[e2:knows]->(c:person), (a)-[e3:knows]->(c)
HINT (((a JOIN e1) JOIN b) MULTI_JOIN e2 MULTI_JOIN e3) JOIN c
RETURN COUNT(*)
```
