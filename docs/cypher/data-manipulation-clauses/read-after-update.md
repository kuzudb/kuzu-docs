---
title: Read After Update
sidebar_position: 10
---


## Return Modified Records
`RETURN` statements following an update clause has access to the variables that are used
in the immediately preceding update clause.

For `CREATE`, the data available to the immediately following `RETURN` is the newly inserted node/relationship.
```
CREATE (u:User {name: 'Alice', age: 35}) RETURN u.*;
------------------
| u.name | u.age |
------------------
| Alice  | 35    |
------------------
```

For `SET`, the data available to `RETURN` is the updated value.
```
MATCH (u:User) WHERE u.name = "Adam"
SET u.name = "Aisha" RETURN u.*;
------------------
| u.name | u.age |
------------------
| Aisha    | 30    |
------------------
```

For `DELETE`, the data available to `RETURN` is the deleted node/relationship record.
```
MATCH (u:User) WHERE u.name = 'Adam' 
DETACH DELETE u RETURN u.*;
------------------
| u.name | u.age |
------------------
| Adam   | 30    |
------------------
```

## Read After Update

You can also have other reading clauses after update clauses. 
The node or relationship variables that were used in the update clauses will be available to the
following reading clauses.  For example, the following query tries to create two `Follows` relationships from Adam, 
one to Karissa and other to Zhang. Note that the part of the query that creates the 
`Adam-[Follows]->Zhang` relationship happens after an update and has a reading MATCH clause. 
Specifically, it follows the creation of the `Adam-[Follows]->Karissa` relationship, which is an update, and the query 
has a reading `MATCH (c:User {name:'Zhang'})` clause in it.

```
MATCH (a:User {name:'Adam'})
WITH a
MATCH (b:User {name:'Karissa'}) CREATE (a)<-[e1:Follows {since:2023}]-(b)
WITH a
MATCH (c:User {name:'Zhang'}) CREATE (a)<-[e2:Follows {since:2024}]-(c)
```
Note that the second `Adam-[Follows]->Zhang` relationship will be created only if
the first `Adam-[Follows]->Karissa` relationship is successfully created.
