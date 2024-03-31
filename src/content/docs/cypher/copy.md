---
title: Copy
---

`COPY` is a statement, as opposed to a query clause. It is used to move data between external files
and Kùzu tables, i.e., it is essentially used for data import and export.

## COPY FROM
`COPY FROM` imports data from external files into tables. `COPY FROM` can only be used when the tables are empty and in initial state. 

Kùzu supports `COPY FROM` different file formats. Details can be found at
- [CSV](../data-import/csv-import.md)
- [Parquet](../data-import/parquet-import.md)
- [NPY](../data-import/npy-import.md)


#### Optional `column_names` Argument
When loading a file F input empty table T, if `column_names` is omitted, Kùzu assumes F contains
- as many columns as the columns in T; and
- in the same order

When `column_names` is spcified through `COPY <table_name>(<column_names>) FROM ...`, both constraints are relaxed:
- F can contain a subset of the columns in T; and
- in arbitrary order

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
Note that the columns in csv file is not aligned with columns in Person table and mising birthday column. You could load by explicitly specify the two columns in csv corrsponds to `name` and `age` columns respectively as shown below. `birthDay` column will be set to default NULL value. 
```
Copy Person(name, age) FROM "person.csv" (header=true);
```


## Copy To
`COPY TO` exports data to external files. You can export query result to external files with customized configutation.

The following query write all columns of User table into "user.csv" with header.
```
COPY (MATCH (u:User) RETURN u.*) TO 'user.csv' (header=true);
```

Kùzu supports `COPY TO` different file formats. Details can be found at
- [CSV](../data-export/csv-export.md)
- [Parquet](../data-export/parquet-export.md)
