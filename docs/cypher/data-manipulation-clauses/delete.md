---
title: Delete
description: Delete node records from your tables.
---

import RunningExample from '../running-example.png';

# Database
We will use the database, whose schema and data import commands are given [here](../query-clauses/example-database.md):

<img src={RunningExample} style={{width: 800}} />

You can import this database by copying pasting the commands on that page. 

# Delete Node
You can delete node records from your tables using the DELETE clause.
We currently only support deleting singleton node records, i.e., those that don't have
have any incoming or outgoing relationships. Deleting of relationship records and
nodes with edges are not yet supported

For example, the following query first creates a User (Alice, 40) node record, 
without inserting any relationships to that node record, and then deletes that record

```
CREATE (u:User {name: 'Alice', age: 35});
MATCH (u:User) WHERE u.name = 'Alice' 
DELETE u;
```

# Delete Relationship
You can delete arbitrary relationship records from your tables using the DELETE clause.<br />
For example, the following query deletes the `Follows` relationship between `Adam` and `Karissa`:
```
MATCH (u:User)-[f:Follows]->(u1:User)
WHERE u.name = 'Adam' AND u1.name = 'Karissa'
DELETE f;
```
