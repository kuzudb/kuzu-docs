---
title: Scan
sidebar_position: 11
description: Direct scan over file
---

# Scan

The `LOAD FROM` clause, which performs a direct scan over an input file without loading it into the database.
This clause can be useful when performing quick testing to extract a small sample of a larger file
to load into a node table, or to perform simple transformation tasks like rearranging column order.

`LOAD FROM` is designed to be used in the exact same way as `MATCH`, meaning that it can be followed
by arbitrary clauses like `WHERE, RETURN, CREATE, ...`.

## Example usage

Some example usage is as follows.

### Filtering/aggregating
```
LOAD FROM "user.csv" (header = true)
WHERE to_int64(age) > 25 
RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 3            |
----------------
```

### Create nodes from input file
```
LOAD FROM "user.csv" (header = true)
CREATE (:User {name: name, age:to_int64(age)});

MATCH (u:User) RETURN u;
----------------------------------------------------
| u                                                |
----------------------------------------------------
| {_ID: 0:0, _LABEL: User, name: Adam, age: 30}    |
----------------------------------------------------
| {_ID: 0:1, _LABEL: User, name: Karissa, age: 40} |
----------------------------------------------------
| {_ID: 0:2, _LABEL: User, name: Zhang, age: 50}   |
----------------------------------------------------
| {_ID: 0:3, _LABEL: User, name: Noura, age: 25}   |
----------------------------------------------------
```

### Reorder and subset columns

You can also use the scan functionality to reorder and subset columns from a given dataset. For
example, the following query will return just the `age` and `name` in that order, even if the
input file has more columns specified in a different order.

```
LOAD FROM "user.csv" (header = true)
RETURN age, name LIMIT 3;

--------------------
| age | name       |
--------------------
| 30  | Adam       |
--------------------
| 40  | Karissa    |
--------------------
| 50  | Zhang      |
--------------------
```

### Enforce Schema
To enforce a specific schema when reading CSV, user can use `LOAD WITH HEADERS (<name> <dataType>, ...) FROM ...`

E.g. the following query will bind first column to `name` to the STRING type and second column to `age` to the INT64 type.

```
LOAD WITH HEADERS (name STRING, age INT64) FROM "user.csv" (header = true)
WHERE name =~ 'Adam*'
RETURN name, age;
--------------
| name | age |
--------------
| Adam | 30  |
--------------
```

:::info Note
If the header is specified manually:
- Kùzu will throw an exception if the given header does not the match number of columns in the file.
- Kùzu will always try to cast to the type specified header. An exception will be thrown if the
casting operation fails.
:::

## Scan Data Formats

### CSV
When loading from a CSV file, user can specify the same set of configuration as [importing from CSV through COPY](../data-import/csv-import.md).

If no header information is available, Kùzu will use the default cofiguration and parse each column as `STRING` type with name `column0, column1, ...`. E.g.
```
LOAD FROM "test.csv" RETURN *;
-----------
| column0 |
-----------
| a       |
-----------
| b       |
-----------
```

If header information is available in the file, Kùzu will parse the header and use data types and names as specified in the header. E.g.
```
LOAD FROM "user.csv" (header = true) RETURN *;
-----------------
| name    | age |
-----------------
| Adam    | 30  |
-----------------
| Karissa | 40  |
-----------------
| Zhang   | 50  |
-----------------
| Noura   | 25  |
-----------------
```

### Parquet

Since parquet file contains schema, Kùzu will always use parquet schema information. 

```
LOAD FROM "user.parquet" RETURN *;
----------------
| f0      | f1 |
----------------
| Adam    | 30 |
----------------
| Karissa | 40 |
----------------
| Zhang   | 50 |
----------------
| Noura   | 25 |
----------------
```

### Pandas

Kùzu allows zero-copy access to Pandas DataFrames. The data types within a Pandas DataFrame will be used to infer the schema of the data.

Because Pandas is a Python-only DataFrame library, the following example is for Python users. We first create a Pandas
DataFrame as follows:

```py
import kuzu
import pandas as pd

db = kuzu.Database("persons")
conn = kuzu.Connection(db)

df = pd.DataFrame({
    "name": ["Adam", "Karissa", "Zhang", "Noura"],
    "age": [30, 40, 50, 25]
})
```

The Pandas DataFrame can be scanned using the LOAD FROM clause just like we would from
an external file. The data access occurs in a zero-copy manner, meaning that Kùzu natively scans
the underlying Pandas data objects.

```py
result = conn.execute("LOAD FROM df RETURN *;")
print(result.get_as_df())

# Result
      name  age
0     Adam   30
1  Karissa   40
2    Zhang   50
3    Noura   25
```
