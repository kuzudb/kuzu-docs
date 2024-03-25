---
title: Create
description: Insert records into your node and relationship tables.
sidebar_position: 1
---

import RunningExample from '../running-example.png';

# CREATE
`CREATE` is similar to the `INSERT` clause of SQL and lets you insert records into your node and relationship tables. We describe the generic semantics of the 
`CREATE` clause momentarily [below](#generic-semantics). We first start with some simple examples.

We will use the example database for demonstration, whose schema and data import commands are given [here](../query-clauses/example-database.md).

## Insert Nodes
The following query inserts a single (Alice, 35) node record into the User node table:

```
CREATE (u:User {name: 'Alice', age: 35})
```
The properties you would like to set are specified using the
`{prop1 : val1, prop2 : val2, ...}` syntax.  

If you queried the database now for 
a User node with name Alice, you would get the above tuple:
```
MATCH (a:User) 
WHERE a.name = 'Alice' 
RETURN a.*;
------------------
| a.name | a.age |
------------------
| Alice  | 35    |
------------------
```

Any node property which is not specified will be set to NULL. 
For example the following query will set the age property
the inserted node record to NULL. Note that for node records,
the primary key property, in our example "name" has to be non-NULL.
```
CREATE (u:User {name: 'Dimitri'})
```
```
MATCH (a:User) 
WHERE a.name = 'Dimitri' 
RETURN a.*;
-------------------
| a.name  | a.age |
-------------------
| Dimitri |       |
-------------------
```

## Insert Relationships
You can insert records to your relationship tables by
first binding two variables `s` and `t` to nodes, and then
"drawing" a relationship pattern between `s` and `t`. 
For example, the following creates a Follows relationship
from the User node with name "Adam" to the User node with
name "Noura". 
```
MATCH (u1:User), (u2:User) WHERE u1.name = 'Adam' AND u2.name = 'Noura' 
CREATE (u1)-[:Follows {since: 2011}]->(u2)
```
Similar to inserting node records, any relationship property which is not 
specified in the query will be set to NULL.

## Generic Semantics
The general semantics of `CREATE` is as follows. You can specify
an arbitrary graph pattern `P` after the `CREATE` clause.
Then for each tuple `t` that was produced before the `CREATE` statement, 
each node `n` and relationship `r` that is not bound by `t` is inserted
as a new node and relationship. For example the following query
adds a Follows relationship with `since=2022` from User node "Zhang" 
to every other User node (including from "Zhang" to "Zhang") 
in the database:

```
MATCH (a:User), (b:User) 
WHERE a.name = "Zhang" 
CREATE (a)-[:Follows {since:2022}]->(b);
```
This is because the "a" variable matches to User node "Zhang" and the "b" variable matches to any node in the "User" table. As a result, this query creates a Follows relationship from User node "Zhang" to every other User nodes.

