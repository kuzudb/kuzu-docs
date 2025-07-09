---
title: Drop
description: Drop DDL statement
---

## Drop a table

Dropping a table removes the table and all its data from the database.

:::caution[Note]
- To drop a node table, you need to first drop all of the relationship tables that refer to it in
  their `FROM` or `TO` clauses.
- You can drop any relationship table without affecting the nodes it refers to.
:::

For example, consider the following tables:

```sql
CREATE NODE TABLE User(name STRING PRIMARY KEY, age INT64, reg_date DATE);
CREATE REL TABLE Follows(FROM User TO User, since DATE);
```

If you try to drop the `User` node table without first dropping the associated
relationship tables, you will get an error:

```sql
DROP TABLE User;
```
```
Error: Binder exception: Cannot delete node table User because it is referenced by relationship table Follows.
```

You can first drop the `Follows` relationship table and then the `User` node table:

```sql
DROP TABLE Follows;
DROP TABLE User;
```

## Drop if exists

If the given table does not exist in the database, Kuzu throws an exception when you try to drop it.
To avoid the exception being raised, use the `IF EXISTS` clause. This instructs Kuzu to do nothing when
the given table name does not exist in the database.

The following query tells Kuzu to drop the `UW` table only if it exists:

```sql
DROP TABLE IF EXISTS UW;
```
