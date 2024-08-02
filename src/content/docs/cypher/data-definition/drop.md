---
title: Drop
description: Drop DDL statement
---

## Drop a table

Dropping a table removes the table and all its data from the database.

:::caution[Note]
- To drop a node table, you need to first drop all of the relationship tables that refer to X in
  its `FROM` or `TO` first.
- You can drop any relationship table without affecting its underlying nodes.
:::

For example, consider the following database:

```sql
CREATE NODE TABLE User(name STRING, age INT64, reg_date DATE, PRIMARY KEY (name));
CREATE REL TABLE Follows(FROM User TO User, since DATE);
```

Consider that you try to directly drop the `User` node table without first dropping the associated
relationship tables.
```sql
DROP TABLE User
```
This will raise the following exception:
```
Binder exception: Cannot delete a node table with edges. It is on the edges of rel: Follows.
```

You can first delete the `Follows` rel table, and subsequently the `User` table as follows:

```sql
DROP TABLE Follows
---------------------------------------
| RelTable: Follows has been dropped. |
---------------------------------------
DROP TABLE User
-------------------------------------
| NodeTable: User has been dropped. |
-------------------------------------
```

## Drop a sequence

Consider the following sequence:

```sql
CREATE SEQUENCE Seq;
```

You can drop a `SEQUENCE` as follows:

```sql
DROP SEQUENCE Seq;
```
Once dropped, the sequence is no longer available in the database.

## Drop if exists
If the given table does not exist in the database, Kùzu throws an exception when you try to drop it.
To avoid the exception being raised, use the `IF EXISTS` clause. This instructs Kùzu to do nothing when
the given table name does not exist in the database.

Example:
```sql
DROP TABLE IF EXISTS UW
```
This query tells Kùzu to drop the `UW` table only if it exists.

You can also drop a sequence if it exists as follows:

```sql
DROP SEQUENCE IF EXISTS Seq;
```
