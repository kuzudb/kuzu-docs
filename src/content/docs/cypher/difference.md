---
title: Difference in Cypher Implemetations
---

# Difference from Neo4j's Cypher Implementations

## Schema 

Different from Neo4j, Kuzu requires a schema to be defined before any data can be inserted into the database. The schema provides a logical grouping of node and relationship tables, along with their associated properties and data types that define the structure of the graph database. See [DDL](/cypher/data-definition/create-table.md) for more information. 


## Clauses

### CREATE and MERGE

It is recommended to always specifying node and relationship labels explicitly in the `CREATE` and `MERGE` clause. If not specified, Kuzu will try to infer the label by looking at the schema.

### FINISH

`FINISH` is recently introduced in GQL and adopted by Neo4j but not yet supported in Kuzu. You can use `RETURN COUNT(*)` instead which will only return one record.

### FOREACH

`FOREACH` is not supported. You can use `UNWIND` instead.

### LOAD CSV FROM

Kuzu can scan files not only in the format of CSV, so the `LOAD CSV FROM` clause is renamed to `LOAD FROM`.

### MATCH and OPTIONAL MATCH

Relationship cannot be omitted. For example `--`, `-->` and `<--` are not supported. You need to use `-[]-`, `-[]->` and `<-[]-` instead.

#### Semantic

Neo4j adopts trail semantic (no repeated edge) for pattern within a `MATCH` clause. While Kuzu adopts walk semantic (allow repeated edge) for pattern within a `MATCH` clause. You can use `is_trail` or `is_acyclic` function to check if a path is a trail or acyclic.

#### Variable length relationships

Since Kuzu adopts trail semantic by default, so a variable length relationship needs to have a upper bound to guarantee the query will terminate. If upper bound is not specified, Kuzu will assign a default value of 30.

Kuzu also extends Neo4j's variable length to support filter inside the variable length relationship. 

To run algorithms like (all) shortest path, simply add `SHORTEST` or `ALL SHORTEST` between the kleene star and lower bound. For example,  `MATCH (n)-[r* SHORTEST 1..10]->(m)`. It is recommended to use `SHORTEST` if paths are not needed in the use case.

More information can be found at [MATCH](/cypher/query-clauses/match.md).

### REMOVE

`REMOVE` is not supported. Use `SET n.prop = NULL` instead.

### SET

Properties must be updated in the form of `n.prop = expression`. Update all properties with map of `+=` operator is not supported. Try to update properties one by one.

### USE

`USE` graph is not supported. For Kuzu, each graph is a database. You can use different graph by opening different databases.

### WHERE

Using `WHERE` inside node or relationship pattern is not supported, e.g. `MATCH (n:Person WHERE a.name = 'Andy') RETURN n`. You need to write it as `MATCH (n:Person) WHERE n.name = 'Andy' RETURN n`.

Filter on node or relationship labels is not supported, e.g. `MATCH (n) WHERE n:Person RETURN n`. You need to write it as `MATCH (n:Person) RETURN n`, or `MATCH (n) WHERE label(n) = 'Person' RETURN n`.

### Others

Any `SHOW XXX` clauses become a function call in Kuzu. For example, `SHOW FUNCTIONS` in Neo4j is equivalent to `CALL show_functions() RETURN *` in Kuzu. For more information, see [Functions](/cypher/query-clauses/call.md).

## Subqueries

Kuzu supports `EXISTS` and `COUNT` subquery. See [Subqueries](/cypher/subquery.md) for more information.

`CALL <subquery>` is not supported.

## Data Types

## Functions

## Indexes and Constraints

Kuzu does not support manually creating indexes or constraints.

