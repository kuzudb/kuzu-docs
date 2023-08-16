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
`SET` is similar to SQL's SET clause, and allows updating properties of node or relationship records to new values (possibly NULL).

## Set Node Properties

### Set Single Label Node Properties
The following query sets the age property of the User node with name Adam to 50 (which is 30 in the original database).

```
MATCH (u:User) 
WHERE u.name = 'Adam' 
SET u.age = 50
RETURN u.*;
------------------
| u.name | u.age |
------------------
| Adam   | 50    |
------------------
```
Similarly the following sets Adam's age property to NULL.
Query:
```
MATCH (u:User) 
WHERE u.name = 'Adam' 
SET u.age = NULL
RETURN u.*;
------------------
| u.name | u.age |
------------------
| Adam   |       |
------------------
```

### Set Multi Label Node Properties
Kùzu also supports updating node properties with multi-label nodes.
```
MATCH (u)
SET u.population = 0
RETURN u.name, u.population; 
----------------------------
| u.name    | u.population |
----------------------------
| Waterloo  | 0            |
----------------------------
| Kitchener | 0            |
----------------------------
| Guelph    | 0            |
----------------------------
| Adam      |              |
----------------------------
| Karissa   |              |
----------------------------
| Zhang     |              |
----------------------------
| Noura     |              |
----------------------------
```

## Set Relationship Properties

### Set Single Label Relationship Properties
The following query sets the `since` property of the Follows relationship(From Adam to Karissa) to 2012 (which is 2020 in the original database).

```
MATCH (u0:User)-[f:Follows]->(u1:User)
WHERE u0.name = 'Adam' AND u1.name = 'Karissa'
SET f.since = 2012
RETURN f;
---------------------------------------------------------
| f                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2012}->(0:1) |
---------------------------------------------------------
```

### Set Multi Label Relationship Properties
```
MATCH (u0)-[f]->()
WHERE u0.name = 'Adam'
SET f.since = 1999
RETURN f;
---------------------------------------------------------
| f                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:0, since: 1999}->(0:1) |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:1, since: 1999}->(0:2) |
---------------------------------------------------------
| (0:0)-{_LABEL: LivesIn, _ID: 3:0}->(1:0)              |
---------------------------------------------------------
```



