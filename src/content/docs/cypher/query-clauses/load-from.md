---
title: Load (Scan)
description: Direct scan over file using the LOAD FROM clause
---

The `LOAD FROM` clause performs a direct scan over an input file **without copying it into the database**.
This clause is very useful to inspect a subset of a larger file to display or load into a node table, or to
perform simple transformation tasks like rearranging column order.

`LOAD FROM` can be followed by arbitrary clauses like `MATCH`, `CREATE`, `WHERE`, `RETURN`, and so on.
Suppose the input source has tuples with k columns.
`LOAD FROM` will bind each tuple t=(col0, col1, ..., col(k-1)) of the scanned input source to k variables
with some names and data types. Names and data types of the variables can either be specified
in the `LOAD FROM` statement using the [`WITH HEADERS` clause](#enforce-schema). Or they will be automatically inferred from the source.

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

### Bound variable names and data types

By default, Kùzu will infer the column names and data types from the scan source automatically.
- For Parquet, Pandas, Polars and PyArrow, column names and data types are always available in the data source
- For CSV: The behavior is determined by the [CSV scanning configuration](/import/csv#csv-configurations), which are specified at the end of `LOAD FROM`,  inside `()`, similar
to `COPY FROM` statements. We review the details of this behavior [below](#csv).
- For JSON, we use keys as column names, and infer a common data type from each key's values. To use `LOAD FROM` with JSON, you need
to have the [JSON extension](/extensions/json) installed. More details on using `LOAD FROM` with JSON files is provided
on the documentation page for the [JSON extension](/extensions/json).

You can enforce specific column names and data types when reading, by using the `LOAD WITH HEADERS (<name> <dataType>, ...) FROM ...` syntax.

The following query will first bind the column `name` to the `STRING` type and second column `age` to the `INT64` type.
You can combine this with a `WHERE` clause to filter the data as needed.

```cypher
LOAD WITH HEADERS (name STRING, age INT64) FROM "user.csv" (header = true)
WHERE name =~ 'Adam*'
RETURN name, age;
```
```
--------------
| name | age |
--------------
| Adam | 30  |
--------------
```

:::caution[Note]
If `WITH HEADERS` is specified manually:
- Kùzu will throw an exception if the given number of columns in `WITH HEADERS` does not the match number of columns in the file.
- Kùzu will always try to cast to the type specified header. An exception will be thrown if the
casting operation fails.
:::

## Ignore erroneous rows
Errors can happen when scanning different lines or elements of an input file with `LOAD FROM`. 
Error can happen for several reasons, such as a line in the scanned file is malformed (e.g., in CSV files)
or a field in the scanned line cannot be cast into its expected data type (e.g., due to an integer overflow).
You can  skip erroneous lines when scanning large files by setting [`IGNORE_ERRORS`](/import#ignore-erroneous-rows)
configuration to `true`. This configuration is also supported when using `COPY FROM` and the details of this feature
is documented in the [ignoring erroneous rows section of `COPY FROM`](import#ignore-erroneous-rows).

Here is an example. Suppose the CSV file `user.csv` contain the following rows:
```csv
Alice,4
Bob,2147483650
```

Suppose we write a `LOAD FROM` statement that tries to read the second column as an INT32.
The second row `(Bob,2147483650)` would be malformed because 2147483650 does not fit into an INT32 and will cause an error.
By setting `IGNORE_ERRORS` to true, instead of erroring, we can make `LOAD FROM` simply skip over this line: 
```cypher
LOAD WITH HEADERS (name STRING, age INT32) FROM "user.csv" (ignore_errors = true)
RETURN name, age;
```
```
┌────────┬───────┐
│ name   │ age   │
│ STRING │ INT32 │
├────────┼───────┤
│ Alice  │ 4     │
└────────┴───────┘
```
You can also see the details of any warnings generated by the skipped lines using the [SHOW_WARNINGS](/cypher/query-clauses/call#show_warnings) function. 
See the [ignoring erroneous rows section of `COPY FROM`](import#ignore-erroneous-rows) for more details.

## Scan Data Formats
`LOAD FROM` can scan several raw or in-memory file formats, such as CSV, Parquet, Pandas, Polars, Arrow tables, and JSON.

### File format detection
`Load from` determines the file format based on the file extension if the `file_format` option is not given. For instance, files with a `.csv` extension are automatically recognized as CSV format.

If the file format cannot be inferred from the extension, or if you need to override the default sniffing behaviour, the `file_format` option can be used.

For example, to load a CSV file that has a `.tsv` extension (for tab-separated data), you must explicitly specify the file format using the `file_format` option, as shown below:
```
LOAD FROM 'data.tsv' (file_format='csv')
RETURN *
```


Below we give examples of using `LOAD FROM` to scan data from each of these formats. We assume `WITH HEADERS`
is not used in the examples below, so we discuss how Kùzu infers the variable names and data types of
that bind to the scanned tuples.

### CSV

:::caution[Note]
See the
[CSV Configurations](/import/csv#csv-configurations) and [ignoring erroneous rows
](/import/csv#ignoring-erroneous-rows) documentation pages for the `COPY FROM` file.
The configurations documented in those pages can also be specified after the `LOAD FROM` statement inside `()` when scanning
CSV files. For example, you can indicate that the first line should
be interpreted as a header line by setting `(haders = true)` or that the CSV delimiter is '|' by setting `(DELIM="|")`.
Some of these configurations are also by default [automatically detected](/import/csv#auto-detecting-configurations) by Kùzu when scanning CSV files.
These configurations determine the names and data types of the 
variables that bind to the fields scanned from CSV files.
This page does not document those options in detail. We refer you to [CSV Configurations](/import/csv#csv-configurations) and 
[ignoring erroneous rows](/import/csv#ignoring-erroneous-rows) documentation pages for details.
:::

The syntax for using `LOAD FROM` to scan a CSV file is similar to the one used for using `COPY FROM` with CSV files.
#### CSV header
If (i) the CSV file has a header line, i.e., a first line that should not be interpreted
as a tuple to be scanned; and (ii) `(header = true)` set, then the column names in the first line 
provide the names of the columns. The data types are always automatically inferred from the CSV file (except of course 
if `LOAD WITH HEADERS (...) FROM` is used, in which case the data types provided inside the `(...)` are used as 
described [above](#bound-variable-names-and-data-types)).

Suppose user.csv is a CSV file with the following contents:
```
name,age
Adam,30
Karissa,40
Zhang,50
```

Then if you run the following query, Kùzu will infer the column names `name` and `age` from the first line of the CSV:

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


If (header = false), then the names of the columns will be column0, column1, ..., column(k-1), where k is the number of columns in the CSV file.
Suppose user.csv has instead the following contents:
```
Adam,30
Karissa,40
Zhang,50
```

```cypher
LOAD FROM "user.csv" (header = false) RETURN *;
---------------------
| column0 | column1 |
---------------------
| Adam    |    30   |
---------------------
| Karissa |    40   |
--------------------- 
| Zhang   |    50   |
---------------------
```

### Parquet

Since Parquet files contain schema information in their metadata, Kùzu will always use the available
schema information when loading from Parquet files (except again
if `LOAD WITH HEADERS (...) FROM` is used). Suppose we have a Parquet file `user.parquet` with two columns `f0` and `f1` 
and the same content as in the `user.csv` file above. Then the query below will scan the Parquet file and output the following:

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

Kùzu allows zero-copy access to Pandas DataFrames. The variable names and data types of scanned columns 
within a Pandas DataFrame will be
inferred from the schema information of the data frame. Here is an example:

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
Here `name` and `age` have string and integer types in the define Pandas Dataframe, and so the output table
contains two columns with the same names and data types.

:::note[Note]
Pandas can use either a NumPy or Arrow backend - Kùzu can natively scan from either backend.
:::

### Polars

Kùzu can also scan Polars DataFrames via the underlying PyArrow layer. The rules for determining the 
variable names and data types is identical to scanning Pandas data frames. Here is an example:

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

### JSON
Kùzu can scan JSON files using `LOAD FROM`.
All JSON-related features are part of the JSON extension. See the documentation on the [JSON extension](/extensions/json#load-from) for details.
