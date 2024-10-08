---
title: Delete
description: Delete node records from your tables.
---

# DELETE
`DELETE` clause deletes node or relationship records from the table.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/data-manipulation-clauses/example-database).

## Delete Nodes

### Delete Single Label Nodes
The following statements first create a User (Alice, 35) node record, without inserting any relationships to that node record, and then deletes the record

```cypher
CREATE (u:User {name: 'Alice', age: 35});
MATCH (u:User) WHERE u.name = 'Alice' DELETE u RETURN u.*;
```
```
┌────────┬───────┐
│ u.name │ u.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Alice  │ 35    │
└────────┴───────┘
```

### Delete Multi Label Nodes
The following statements first create a user node and a city node both with name "A" and then delete them. 
```cypher
CREATE (:User {name: 'A'}), (:City {name: 'A'});
MATCH (u) WHERE u.name = 'A' DELETE u RETURN u.*;
```
```
┌────────┬───────┬──────────────┐
│ u.name │ u.age │ u.population │
│ STRING │ INT64 │ INT64        │
├────────┼───────┼──────────────┤
│ A      │       │              │
│ A      │       │              │
└────────┴───────┴──────────────┘
```

## Detach Delete
`DELETE` can only delete nodes that do not have any relationships. To delete a node and all of its relationships with
a single clause, use `DETACH DELETE`.

```cypher
MATCH ()-[e]->() RETURN COUNT(e) AS num_rels;
```
```
┌──────────┐
│ num_rels │
│ INT64    │
├──────────┤
│ 8        │
└──────────┘
```
```cypher
MATCH (u:User) WHERE u.name = 'Adam' DETACH DELETE u;
MATCH ()-[]->() RETURN COUNT(*) AS num_rels;
```
```
┌──────────┐
│ num_rels │
│ INT64    │
├──────────┤
│ 5        │
└──────────┘
```

For example, to delete every record in the database, you can do the following:
```cypher
MATCH (n) DETACH DELETE n;
```

## Delete Relationships

### Delete Single Label Relationships
The following query deletes the `Follows` relationship between `Adam` and `Karissa`:
```
MATCH (u:User)-[f:Follows]->(u1:User)
WHERE u.name = 'Adam' AND u1.name = 'Karissa'
DELETE f;
```


### Delete Multi Label Relationships

The following query deletes all out-going edges from "Karissa".
```cypher
MATCH (u:User)-[f]->(u1)
WHERE u.name = 'Karissa' 
RETURN u.name, u1.name;
```
```
┌─────────┬──────────┐
│ u.name  │ u1.name  │
│ STRING  │ STRING   │
├─────────┼──────────┤
│ Karissa │ Waterloo │
│ Karissa │ Zhang    │
└─────────┴──────────┘
```
```cypher
MATCH (u:User)-[f]->(u1)
WHERE u.name = 'Karissa' 
DELETE f;
MATCH (u:User)-[f]->(u1)
WHERE u.name = 'Karissa' 
RETURN u.name, u1.name;
```
```
┌────────┬─────────┐
│ u.name │ u1.name │
│ STRING │ STRING  │
├────────┼─────────┤
└────────┴─────────┘
```
