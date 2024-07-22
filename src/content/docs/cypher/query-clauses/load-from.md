---
title: Load (Scan)
description: Direct scan over file using the LOAD FROM clause
---

The `LOAD FROM` clause performs a direct scan over an input file **without copying it into the database**.
This clause is very useful to inspect a subset of a larger file to display or load into a node table, or to
perform simple transformation tasks like rearranging column order.

`LOAD FROM` is designed to be used in the exact same way as `MATCH`, meaning that it can be followed
by arbitrary clauses like `CREATE`, `WHERE`, `RETURN`, and so on.

## Example usage

Some example usage for the `LOAD FROM` clause is shown below.

### Filtering/aggregating

```cypher
LOAD FROM "user.csv" (header = true)
WHERE CAST(age, INT64) > 25 
RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 3            |
----------------
```

To skip the first 2 lines of the CSV file, you can use the `SKIP` parameter as follows:

```cypher
LOAD FROM "user.csv" (header = true, skip = 2)
RETURN *;
```

### Create nodes from input file
```cypher
LOAD FROM "user.csv" (header = true)
CREATE (:User {name: name, age: CAST(age, INT64)});

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
```

### Reorder and subset columns

You can also use the scan functionality to reorder and subset columns from a given dataset. For
example, the following query will return just the `age` and `name` in that order, even if the
input file has more columns specified in a different order.

```cypher
// Return age column before the name column
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
To enforce a specific schema and data types when reading from CSV, you can use the `LOAD WITH HEADERS (<name> <dataType>, ...) FROM ...` syntax.

The following query will bind first column `name` to the STRING type and second column `age` to the INT64 type.
You can combine this with a `WHERE` clause to filter the data as needed.

```cypher
LOAD WITH HEADERS (name STRING, age INT64) FROM "user.csv" (header = true)
WHERE name =~ 'Adam*'
RETURN name, age;
--------------
| name | age |
--------------
| Adam | 30  |
--------------
```

:::caution[Note]
If the header is specified manually:
- Kùzu will throw an exception if the given header does not the match number of columns in the file.
- Kùzu will always try to cast to the type specified header. An exception will be thrown if the
casting operation fails.
:::

## Scan Data Formats

### CSV

When loading from a CSV file, you can use a similar syntax to the `COPY FROM` statement.

If no header row is available, you can simply pass in the CSV file name to the statment and Kùzu will parse
each column as `STRING` type with name `column0, column1, ...`.

Example:

```cypher
LOAD FROM "test.csv" RETURN *;
-----------
| column0 |
-----------
| a       |
-----------
| b       |
-----------
```

If header names are available in the file, you can ask Kùzu to parse the header and use data types
and names as specified in the header.

Example:

```cypher
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
```

### Parquet

Since Parquet files contain schema information in their metadata, Kùzu will always use the available
schema information when loading from Parquet files.

```cypher
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
```

### Pandas

Kùzu allows zero-copy access to Pandas DataFrames. The data types within a Pandas DataFrame will be
used to infer the schema of the data. The Pandas DataFrame can be scanned using the `LOAD FROM`
clause just like we would from an external file.

```py
# main.py
import kuzu
import pandas as pd

db = kuzu.Database("persons")
conn = kuzu.Connection(db)

df = pd.DataFrame({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})

result = conn.execute("LOAD FROM df RETURN *;")
print(result.get_as_df())
```
```
      name  age
0     Adam   30
1  Karissa   40
2    Zhang   50
```

:::note[Note]
Pandas can use either a NumPy or Arrow backend - Kùzu can natively scan from either backend.
:::

### Polars

Kùzu can also scan Polars DataFrames via the underlying PyArrow layer.

```python
import kuzu
import polars as pl

db = kuzu.Database("tmp")
conn = kuzu.Connection(db)

df = pl.DataFrame({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})

res = conn.execute("LOAD FROM df RETURN *")
print(res.get_as_pl())
```
```
shape: (3, 2)
┌─────────┬─────┐
│ name    ┆ age │
│ ---     ┆ --- │
│ str     ┆ i64 │
╞═════════╪═════╡
│ Adam    ┆ 30  │
│ Karissa ┆ 40  │
│ Zhang   ┆ 50  │
└─────────┴─────┘
```


### Arrow tables

You can scan an existing PyArrow table as follows:

```python
import kuzu
import pyarrow as pa

db = kuzu.Database("tmp")
conn = kuzu.Connection(db)

pa_table = pa.table({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})
print(pa_table)

res = conn.execute("LOAD FROM pa_table RETURN *")
print(res.get_as_arrow())
```
```
pyarrow.Table
name: string
age: int64
----
name: [["Adam","Karissa","Zhang"]]
age: [[30,40,50]]
```