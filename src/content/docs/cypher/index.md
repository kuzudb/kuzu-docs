---
title: Cypher manual
---

Cypher is a high-level query language for the property graph data model.
It is similar to SQL in many aspects. Some of its analogues with SQL are shown below.

| Type | SQL | Cypher
| ---| --- | ---
| Query | `SELECT`/`FROM`/`WHERE` | `MATCH`/`WHERE`/`RETURN`
| Data manipulation | `INSERT`/`UPDATE`/`DELETE` | `CREATE`/`SET`/`DELETE`

The features of Cypher that are different from SQL are listed below:
- Joins between records from different node and relationship tables are specified using a graph-like syntax.
  - `MATCH (n:Person)-[:Follows]->(m:Person)`
- Special syntax, such as the Kleene star `*` to describe variable-length and recursive joins.
- Cypher does not have an explicit `GROUP BY` like SQL does -- instead, grouping is done implicitly
depending on the combination of bound variables in the `RETURN` clause.

There are a few other differences between SQL and Cypher. Yet, like other high-level database
query languages, most of its semantics can be understood as mappings to relational algebra operators
for selections, joins, projections and aggregations.

Kùzu implements openCypher's[^1] standard predicates and expressions. The following sections in this
chapter covers all Cypher clauses, expressions and functions implemented in Kùzu.

---

[^1]: [openCypher](https://opencypher.org/resources/) is an open-source project that formalizes the
semantics, style and grammar for the Cypher query language in order to make it more compatible to be
used by multiple graph database vendors.
