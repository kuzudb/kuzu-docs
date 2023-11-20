---
title: Read After Update
sidebar_position: 10
---


## Return Modified Records

To obtain modified record, you can append a `RETURN` clause after any update clause.

For `CREATE`, the data available to `RETURN` is the newly inserted node/relationship.
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
SET u.name = "New" RETURN u.*;
------------------
| u.name | u.age |
------------------
| New    | 30    |
------------------
```

For `DELETE`, the data available to `RETURN` is the deleted node/relationship.
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

Instead of returning modified record, it is also possible to continue querying based on modified record. Data available to reading clauses follow the same rule as return clause.

Read after update can be particularly useful when trying to create dependent records.
```
MATCH (a:User {name:'Adam'})
WITH a
MATCH (b:User {name:'Karissa'}) CREATE (a)<-[e1:Follows {since:2023}]-(b)
WITH a
MATCH (c:User {name:'Zhang'}) CREATE (a)<-[e2:Follows {since:2024}]-(c)
```
The query above tries to create two followers for "Adam". The second creation will only be executed if "Karissa-Follows->Adam" is successfully created.