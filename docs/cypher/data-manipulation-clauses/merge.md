---
title: Merge
description: Match existing pattern or, if not present, create the pattern.
---

import RunningExample from '../running-example.png';

# Database
We will use the database, whose schema and data import commands are given [here](../query-clauses/example-database.md):

<img src={RunningExample} style={{width: 800}} />

# MERGE
`MERGE` clause tries to match the query pattern in database or, if not present, create the pattern in database. `MERGE <pattern>` can be interrepted as `If MATCH <pattern> then RETURN <pattern> ELES CREATE <patten>`. Note that there is no notion of partially match, i.e. either the whole pattern is matched or the whole pattern is created.

Similar to `INSERT ON CONFLICT` in sql, `MERGE` clause comes with `ON CREATE` and `ON MATCH` set operation allowing user to specify addition update logic if the pattern is (not) found.

## Merge nodes

### Merge exiting nodes
The following query tries to merge a user with name "Adam". Since user "Adam" exists in the database, the match is found no user is created.
```
MERGE (n:User {name : 'Adam'}) RETURN n.*;
------------------
| n.name | n.age |
------------------
| Adam   | 30    |
------------------
MATCH (:User) RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 4            |
----------------
```

### Merge non-existing nodes
The following query tries to merge a user with name "Bob". Since user "Bob" does not exist in the database, a new user with name "Bob" is created.
```
MERGE (n:User {name : 'Bob'}) RETURN n.*;
------------------
| n.name | n.age |
------------------
| Bob    |       |
------------------
MATCH (:User) RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 5            |
----------------
```

### Merge with `ON MATCH`
`ON MATCH` specifies the set operation once a match is found. The followng query updates age property if pattern is matched.
```
MERGE (n:User {name : 'Adam'}) ON MATCH SET n.age = 35 RETURN n.*;
------------------
| n.name | n.age |
------------------
| Adam   | 35    |
------------------
```

### Merge with `ON CREATE`
`ON CREATE` specifies the set operation if no match is found. The following query updates age property if pattern is not matched.
```
MERGE (n:User {name : 'Bob'}) ON CREATE SET n.age = 60 RETURN n.*;
------------------
| n.name | n.age |
------------------
| Bob    | 60    |
------------------
```
## Merge relationships

### Merge existing relationships
The following query tries to merge a follows edge since 2020 between "Adam" and "Zhang". A match is found in this case.
```
MATCH (a:User), (b:User) 
WHERE a.name = 'Adam' AND b.name = 'Zhang' 
MERGE (a)-[e:Follows {since:2020}]->(b) RETURN e;
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) |
---------------------------------------------------------
MATCH (a:User)-[e:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Zhang' 
RETURN e;
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) |
---------------------------------------------------------
```

### Merge non-existing relationships
The following query tries to merge a follows edge since 2022 between "Adam" and "Zhang". No match is found and an edge is created.
```
MATCH (a:User), (b:User) 
WHERE a.name = 'Adam' AND b.name = 'Zhang' 
MERGE (a)-[e:Follows {since:2022}]->(b) RETURN e;
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 0:4, since: 2022}->(0:2) |
---------------------------------------------------------
MATCH (a:User)-[e:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Zhang' 
RETURN e;
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
```
MATCH (a:User), (b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
MERGE (a)-[e:Follows {since:2020}]->(b) 
ON MATCH SET e.since = 2021
RETURN e;
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2021}->(0:1) |
---------------------------------------------------------
```

### Merge with `ON CREATE`
Similar to merge nodes, the following query update edge since property if the pattern is not found.
```
MATCH (a:User), (b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
MERGE (a)-[e:Follows {since:2022}]->(b) 
ON CREATE SET e.since = 1999
RETURN e;
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 0:5, since: 1999}->(0:1) |
---------------------------------------------------------
```

## Merge complex patterns
Previous examples have shown how to merge single node and relationship pattern. It's also possible to merge a complex pattern involving 

TODO(Xiyang): the following query has a bug
```
MERGE (:User {name:'A'})-[:Follows]->(:User {name:'B'})-[:LivesIn]->(:City {name:'Toronto'});
```