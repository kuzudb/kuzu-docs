---
title: Drop
description: Drop table
---

Dropping a table removes the table and all its data from the database.

:::caution[Note]
- To drop a node table, you need to first drop all of the relationship tables that refer to X in
its `FROM` or `TO` first.
- You can drop any relationship table without affecting its underlying nodes.
:::

For example, consider the following database:
```cypher
CREATE NODE TABLE User(name STRING, age INT64, reg_date DATE, PRIMARY KEY (name));
CREATE REL TABLE Follows(FROM User TO User, since DATE);
```

Directly dropping the `User` node table will fail.
```cypher
DROP TABLE User
Binder exception: Cannot delete a node table with edges. It is on the edges of rel: Follows.
```

You can first delete the `Follows` rel table, and subsequently the `User` table as follows:
```cypher
DROP TABLE Follows
---------------------------------------
| RelTable: Follows has been dropped. |
---------------------------------------
DROP TABLE User
-------------------------------------
| NodeTable: User has been dropped. |
-------------------------------------
```
