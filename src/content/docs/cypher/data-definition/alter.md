---
title: Alter
description: Alter DDL statements
---

## Add column

`ADD COLUMN` allows you to add a new column to a node/rel table. If you don't specify a default value, the newly added column is filled with `NULLs`.

Column names must be unique within a node/relationship table.

For example, consider that you try to run the following command to add a column `age`, but it
already exists in the `User` table:
```sql
ALTER TABLE User ADD age INT64;
```
The query will raise the following exception:
```
"Binder exception: Property: age already exists."
```

The following query adds a new column with the default value `NULL` to the User table.
```sql
ALTER TABLE User ADD grade INT64;
```

You can also specify the default value of the added column.
```sql
ALTER TABLE User ADD grade INT64 DEFAULT 40;
```

## Add column if not exists

If the given column name already exists in the table, Kuzu throws an exception when you try to create it.
To avoid the exception being raised, use the `IF NOT EXISTS` clause. This tells Kuzu to do nothing when
the given column name already exists in the table.

Example:
```sql
ALTER TABLE User ADD IF NOT EXISTS grade INT64;
```
This query tells Kuzu to only create the `grade` column if it doesn't exist.

The same applies to relationship tables.

## Drop column

`DROP COLUMN` allows you to remove a column from a table.

The following query drops the age column from the User table.
```sql
ALTER TABLE User DROP age;
```

## Drop column if exists

If the given column name does not exists in the table, Kuzu throws an exception when you try to drop it.
To avoid the exception being raised, use the `IF EXISTS` clause. This tells Kuzu to do nothing when
the given column name does not exists in the table.

Example:
```sql
ALTER TABLE User DROP IF EXISTS grade;
```
This query tells Kuzu to only drop the `grade` column if it exists.

The same applies to relationship tables.

## Rename table

`RENAME TABLE` allows the user to rename a table.

The following query renames table User to Student.
```sql
ALTER TABLE User RENAME TO Student;
```

## Rename column

`RENAME COLUMN` allows the user to rename a column of a table.<br />

The following query renames the age column to grade.
```sql
ALTER TABLE User RENAME age TO grade;
```

## Comment on a table

`COMMENT ON` allows you to add comments to a table.

The following query adds a comment to `User` table.
```sql
COMMENT ON TABLE User IS 'User information';
```
Comments can be extracted through `SHOW_TABLES()` function. See [CALL](https://docs.kuzudb.com/query-clauses/call) for more information.
```sql
CALL SHOW_TABLES() RETURN *;
--------------------------------------------
| TableName | TableType | TableComment     |
--------------------------------------------
| User      | NODE      | User information |
--------------------------------------------
| City      | NODE      |                  |
--------------------------------------------
```

