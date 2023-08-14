---
title: Delete
description: Delete node records from your tables.
---

import RunningExample from '../running-example.png';

# Database
We will use the database, whose schema and data import commands are given [here](../query-clauses/example-database.md):

<img src={RunningExample} style={{width: 800}} />

You can import this database by copying pasting the commands on that page. 

# DELETE
`DELETE` clause delete node or relationship records from the table.

## Delete Nodes
We currently only support deleting singleton node records, i.e., those that don't have have any incoming or outgoing relationships. Deleting of nodes with edges are not yet supported.

### Delete Single Label Nodes
The following query first creates a User (Alice, 40) node record, without inserting any relationships to that node record, and then deletes the record

```
CREATE (u:User {name: 'Alice', age: 35});
MATCH (:User) RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 5            |
----------------
MATCH (u:User) WHERE u.name = 'Alice' DELETE u;
MATCH (:User) RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 4            |
----------------
```

### Delete Multi Label Nodes
The following query first creates a user node and a city node both with name "A" and then delete them. 
```
CREATE (:User {name: 'A'}), (:City {name: 'A'});
MATCH () RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 9            |
----------------
MATCH (u) WHERE u.name = 'A' DELETE u;
MATCH () RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 7            |
----------------
```

# Delete Relationships

### Delete Single Label Relationships
The following query deletes the `Follows` relationship between `Adam` and `Karissa`:
```
MATCH (u:User)-[f:Follows]->(u1:User)
WHERE u.name = 'Adam' AND u1.name = 'Karissa'
RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 1            |
----------------
MATCH (u:User)-[f:Follows]->(u1:User)
WHERE u.name = 'Adam' AND u1.name = 'Karissa'
DELETE f;
MATCH (u:User)-[f:Follows]->(u1:User)
WHERE u.name = 'Adam' AND u1.name = 'Karissa'
RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 0            |
----------------
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