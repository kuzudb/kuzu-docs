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
