---
title: Alter
description: Alter table
---

## Add column

`ADD COLUMN` allows you to add a new column to a node/rel table. If you don't specify a default value, the newly added column is filled with `NULLs`.

Column names must be unique within a node/rel table. E.g. the following query will fail since the age column already exists in the User table.
```cypher
ALTER TABLE User ADD age INT64;
"Binder exception: Property: age already exists."
```

The following query adds a new column with the default value NULL to the User table.
```cypher
ALTER TABLE User ADD grade INT64;
```

You can also specify the default value of the added column.
```cypher
ALTER TABLE User ADD grade INT64 DEFAULT 40;
```

## Drop column

`DROP COLUMN` allows you to remove a column from a table.

The following query drops the age column from the User table.
```cypher
ALTER TABLE User DROP age;
```

## Rename table

`RENAME TABLE` allows the user to rename a table.

The following query renames table User to Student.
```cypher
ALTER TABLE User RENAME TO Student;
```

## Rename column

`RENAME COLUMN` allows the user to rename a column of a table.<br />

The following query renames the age column to grade.
```cypher
ALTER TABLE User RENAME age TO grade;
```

## Comment on a table

`COMMENT ON` allows you to add comments to a table.

The following query adds a comment to `User` table.
```cypher
COMMENT ON TABLE User IS 'User information';
```
Comments can be extracted through `SHOW_TABLES()` function. See [CALL](https://docs.kuzudb.com/query-clauses/call) for more information.
```cypher
CALL SHOW_TABLES() RETURN *;
--------------------------------------------
| TableName | TableType | TableComment     |
--------------------------------------------
| User      | NODE      | User information |
--------------------------------------------
| City      | NODE      |                  |
--------------------------------------------
```
