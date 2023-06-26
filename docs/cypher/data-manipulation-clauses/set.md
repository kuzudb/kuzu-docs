---
title: Set
description: Update properties of node or relationship records to new values.
---

import RunningExample from '../running-example.png';

# Database
We will use the database, whose schema and data import commands are given [here](../query-clauses/example-database.md):

<img src={RunningExample} style={{width: 800}} />

You can import this database by copy pasting the commands on that page. 

# SET 
SET is similar to SQL's SET clause, and allows updating properties of node or relationship
records to new values (possibly NULL).

## Examples:
### 1. Setting node properties
For example the following query sets the age property of the User node
with name Adam to 50 (which is 30 in the original database).

Query:
```
MATCH (u:User) 
WHERE u.name = 'Adam' 
SET u.age = 50 
```
Similarly the following sets Adam's age property to NULL.
Query:
```
MATCH (u:User) 
WHERE u.name = 'Adam' 
SET u.age = NULL
```
### 2. Setting relationship properties
For example the following query sets the `since` property of the Follows relationship(From Adam to Karissa) to 2012 (which is 2020 in the original database).

Query:
```
MATCH (u0:User)-[f:Follows]->(u1:User)
WHERE u0.name = 'Adam' AND u1.name = 'Karissa'
SET f.since = 2012
```



