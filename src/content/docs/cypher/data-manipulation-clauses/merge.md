---
title: Merge
description: Match existing pattern or, if not present, create the pattern.
---

![](/img/running-example.png)

# MERGE
`MERGE` clause tries to match the query pattern in database or, if not present, create the pattern in database. `MERGE <pattern>` can be interrepted as `If MATCH <pattern> then RETURN <pattern> ELSE CREATE <pattern>`. Note that there is no notion of partially matching of the pattern
and creating the remaining parts. That is, either the whole pattern is matched or the whole pattern is created.

Similar to `INSERT ON CONFLICT` in SQL, `MERGE` clause comes with `ON CREATE` and `ON MATCH` set operation allowing users to specify additional update logic if the pattern is (not) found.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/data-manipulation-clauses/example-database).

## Merge Nodes

### Merge Existing Nodes
The following query tries to merge a user with name "Adam". Since user "Adam" exists in the database, no user is created.
```cypher
MERGE (n:User {name : 'Adam'}) RETURN n.*;
```
```
┌────────┬───────┐
│ n.name │ n.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Adam   │ 30    │
└────────┴───────┘
```

```cypher
MATCH (:User) RETURN COUNT(*);
```
```
┌──────────────┐
│ COUNT_STAR() │
│ INT64        │
├──────────────┤
│ 4            │
└──────────────┘
```

### Merge Non-existing Nodes
The following query tries to merge a user with name "Bob". Since user "Bob" does not exist in the database, a new user with name "Bob" is created.
```cypher
MERGE (n:User {name : 'Bob', age: 45}) RETURN n.*;
```
```
┌────────┬───────┐
│ n.name │ n.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Bob    │       │
└────────┴───────┘
```

```cypher
MATCH (:User) RETURN COUNT(*);
```
```
┌──────────────┐
│ COUNT_STAR() │
│ INT64        │
├──────────────┤
│ 5            │
└──────────────┘
```

### Merge with `ON MATCH`
`ON MATCH` specifies the `SET` operation once a match is found. The followng query updates age property if pattern is matched.
```cypher
MERGE (n:User {name : 'Adam'}) ON MATCH SET n.age = 35 RETURN n.*;
```
```
┌────────┬───────┐
│ n.name │ n.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Adam   │ 35    │
└────────┴───────┘
```

### Merge with `ON CREATE`
`ON CREATE` specifies the `SET` operation if no match is found. The following query updates age property if pattern is not matched.
```cypher
MERGE (n:User {name : 'Bob'}) ON CREATE SET n.age = 60 RETURN n.*;
```
```
┌────────┬───────┐
│ n.name │ n.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Bob    │ 60    │
└────────┴───────┘
```

## Merge Relationships

### Merge Existing Relationships
The following query tries to merge a follows edge since 2020 between "Adam" and "Zhang". A match is found in this case.
```cypher
MATCH (a:User), (b:User) 
WHERE a.name = 'Adam' AND b.name = 'Zhang' 
MERGE (a)-[e:Follows {since:2020}]->(b) RETURN e;
```
```
┌───────────────────────────────────────────────────────┐
│ e                                                     │
│ REL                                                   │
├───────────────────────────────────────────────────────┤
│ (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) │
└───────────────────────────────────────────────────────┘
```
```cypher
MATCH (a:User)-[e:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Zhang' 
RETURN e;
```
```
┌───────────────────────────────────────────────────────┐
│ e                                                     │
│ REL                                                   │
├───────────────────────────────────────────────────────┤
│ (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) │
└───────────────────────────────────────────────────────┘
```

### Merge Non-existing Relationships
The following query tries to merge a follows edge since 2022 between "Adam" and "Zhang". No match is found and an edge is created.
```cypher
MATCH (a:User), (b:User) 
WHERE a.name = 'Adam' AND b.name = 'Zhang' 
MERGE (a)-[e:Follows {since:2022}]->(b) RETURN e;
```
```
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 0:4, since: 2022}->(0:2) |
---------------------------------------------------------
```

```cypher
MATCH (a:User)-[e:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Zhang' 
RETURN e;
```
```
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:4, since: 2022}->(0:2) |
---------------------------------------------------------
```

### Merge with `ON MATCH`
Similar to merge nodes, the following query update edge since property if the pattern is found.
```cypher
MATCH (a:User), (b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
MERGE (a)-[e:Follows {since:2020}]->(b) 
ON MATCH SET e.since = 2021
RETURN e;
```
```
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2021}->(0:1) |
---------------------------------------------------------
```

### Merge with `ON CREATE`
Similar to merge nodes, the following query update edge since property if the pattern is not found.
```cypher
MATCH (a:User), (b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
MERGE (a)-[e:Follows {since:2022}]->(b) 
ON CREATE SET e.since = 1999
RETURN e;
```
```
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 0:5, since: 1999}->(0:1) |
---------------------------------------------------------
```

## Merge Complex Patterns
Previous examples have shown how to merge single node and relationship pattern. It's also possible to merge a complex pattern involving 

```cypher
MERGE (:User {name:'A'})-[:Follows]->(:User {name:'B'})-[:LivesIn]->(:City {name:'Toronto'});
MATCH (a:User)-[:Follows]->(b:User)-[:LivesIn]->(c:City)
RETURN a.name, b.name, c.name;
```
```
---------------------------------
| a.name  | b.name  | c.name    |
---------------------------------
| Adam    | Karissa | Waterloo  |
---------------------------------
| Karissa | Zhang   | Kitchener |
---------------------------------
| Adam    | Zhang   | Kitchener |
---------------------------------
| Zhang   | Noura   | Guelph    |
---------------------------------
| A       | B       | Toronto   |
---------------------------------
```

