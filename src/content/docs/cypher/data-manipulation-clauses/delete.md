---
title: Delete
description: Delete node records from your tables.
sidebar_position: 3
---

import RunningExample from '../running-example.png';

# DELETE
`DELETE` clause deletes node or relationship records from the table.

We will use the example database for demonstration, whose schema and data import commands are given [here](../query-clauses/example-database.md).

## Delete Nodes

### Delete Single Label Nodes
The following statements first create a User (Alice, 35) node record, without inserting any relationships to that node record, and then deletes the record

```
CREATE (u:User {name: 'Alice', age: 35});
MATCH (u:User) WHERE u.name = 'Alice' DELETE u RETURN u.*;
------------------
| u.name | u.age |
------------------
| Alice  | 35    |
------------------
```

### Delete Multi Label Nodes
The following statements first create a user node and a city node both with name "A" and then delete them. 
```
CREATE (:User {name: 'A'}), (:City {name: 'A'});
MATCH (u) WHERE u.name = 'A' DELETE u RETURN u.*;
-------------------------------------
| u                                 |
-------------------------------------
| {_ID: 1:3, _LABEL: City, name: A} |
-------------------------------------
| {_ID: 0:4, _LABEL: User, name: A} |
-------------------------------------
```

## Detach Delete
`DELETE` can only delete nodes that do not have any relationships. To delete a node and all of its relationships with
a single clause, use `DETACH DELETE`.

```
MATCH ()-[e]->() RETURN COUNT(e) AS num_rels;
------------
| num_rels |
------------
| 8        |
------------
MATCH (u:User) WHERE u.name = 'Adam' DETACH DELETE u;
MATCH ()-[]->() RETURN COUNT(*) AS num_rels;
------------
| num_rels |
------------
| 5        |
------------
```

For example, to delete every record in the database, you can do the following:
```
MATCH (n) DETACH DELETE n;
```

## Delete Relationships

### Delete Single Label Relationships
The following query deletes the `Follows` relationship between `Adam` and `Karissa`:
```
MATCH (u:User)-[f:Follows]->(u1:User)
WHERE u.name = 'Adam' AND u1.name = 'Karissa'
DELETE f
RETURN f;
---------------------------------------------------------
| f                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) |
---------------------------------------------------------
```


### Delete Multi Label Relationships

The following query deletes all out-going edges from "Karissa".
```
MATCH (u:User)-[f]->(u1)
WHERE u.name = 'Karissa' 
RETURN u.name, u1.name;
----------------------
| u.name  | u1.name  |
----------------------
| Karissa | Zhang    |
----------------------
| Karissa | Waterloo |
----------------------
MATCH (u:User)-[f]->(u1)
WHERE u.name = 'Karissa' 
DELETE f;
MATCH (u:User)-[f]->(u1)
WHERE u.name = 'Karissa' 
RETURN u.name, u1.name;
--------------------
| u.name | u1.name |
--------------------
```
