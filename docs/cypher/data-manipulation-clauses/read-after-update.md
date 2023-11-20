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

Instead of returning modified record, it is also possible to continue querying based on modified record.

