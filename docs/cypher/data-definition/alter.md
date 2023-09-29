---
title: Alter
sidebar_position: 1
description: Alter
---

# ALTER TABLE
You can change the schema of a table using the `ALTER TABLE` command.<br />

### ADD COLUMN
`ADD COLUMN` allows you to add a new column to a node/rel table. If you don't specify a default value, the newly added column is filled with `NULLs`.

Column names must be unique within a node/rel table. E.g. the following query will fail since the age column already exists in the User table.
```
ALTER TABLE User ADD age INT64;
"Binder exception: Property: age already exists."
```

The following query adds a new column with the default value NULL to the User table.
```
ALTER TABLE User ADD grade INT64;
```

You can also specify the default value of the added column.
```
ALTER TABLE User ADD grade INT64 DEFAULT 40;
```

### DROP COLUMN
`DROP COLUMN` allows you to remove a column from a table.<br />

The following query drops the age column from the User table.
```
ALTER TABLE User DROP age;
```

### RENAME TABLE
`RENAME TABLE` allows the user to rename a table.<br />

The following query renames table User to Student.
```
ALTER TABLE User RENAME TO Student;
```

### RENAME COLUMN
`RENAME COLUMN` allows the user to rename a column of a table.<br />

The following query renames the age column to grade.
```
ALTER TABLE User RENAME age TO grade;
```
