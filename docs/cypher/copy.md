---
title: Copy
sidebar_position: 12
---

`COPY` statement moves data between external files and database internal.

## Copy From
`COPY FROM` imports data from external files into tables. `COPY FROM` can only be used when the tables are empty and in initial state. Columns from file should match columns defined in the table. If columns from file is a subset or in a different order compared to columns from the table. You could specify the order through column names after table name in `Copy FROM` statement.

Consider table
```
CREATE NODE TABLE Person(age INT, name STRING, birthDay DATE, PRIMARY KEY(name));
```
And CSV file "person.csv"
```
name,age
Adam,30
Karissa,40
...
```
Note that the columns in csv file is not aligned with columns in Person table and mising birthday column. You could copy by explicitly specify the two columns in csv corrsponds to `name` and `age` columns respectively as shown below. `birthDay` column will be set to default NULL value. 
```
Copy Person(name, age) FROM "person.csv" (header=true);
```

Kùzu supports `COPY FROM` different file formats. Details can be found at
- [CSV](../data-import/csv-import.md)
- [Parquet](../data-import/parquet-import.md)
- [NPY](../data-import/npy-import.md)

## Copy To
`COPY TO` exports data to external files. You can export query result to external files with customized configutation.

The following query write all columns of User table into "user.csv" with header.
```
COPY (MATCH (u:User) RETURN u.*) TO 'user.csv' (header=true);
```

Kùzu supports `COPY TO` different file formats. Details can be found at
- [CSV](../data-export/csv-export.md)
- [Parquet](../data-export/parquet-export.md)
