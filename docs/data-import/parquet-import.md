---
title: Parquet
---

# Data Import from Parquet Files
Apache Parquet is an open source, column-oriented data file format designed for efficient data storage and retrieval. We support data import from parquet files through `COPY FROM` command.

## Notes
Similar to importing from CSV files, there are several rules about importing from parquet files.
- **Starting with empty tables** 
- **Copying nodes before rels**

See [notes in CSV import](csv-import.md#several-notes) for details.

## `COPY FROM` a Parquet File to a Node Table
Similar to copy from a csv file to a node table, the order of the columns in a parquet file need to match the order of predefined properties for node tables in the catalog, i.e. the order used when defining the schema of a node table.

Example parquet file for "user.parquet". The output is obtained from `print(pyarrow.Table)`.
```
pyarrow.Table
name: string
age: int64
----
name: [["Adam","Karissa","Zhang","Noura"]]
age: [[30,40,50,25]]
```
To load this parquet into User table. Simply run
```
COPY User FROM "user.parquet";
```

## `COPY FROM` a Parquet File to a Rel Table
Similar to copy from a CSV file to a rel table. The first two columns should the "from" column and the "to" column.

Example parquet file for "follows.parquet". The output is obtained from `print(pyarrow.Table)`.
```
pyarrow.Table
from: string
to: string
since: int64
----
from: [["Adam","Adam","Karissa","Zhang"]]
to: [["Karissa","Zhang","Zhang","Noura"]]
since: [[2020,2020,2021,2022]]
```
To load this parquet into Follows table. Simply run
```
COPY Follows FROM "follows.parquet";
```

## `COPY FROM` Multiple Parquet Files to a Single Table
Please refer to the [COPY FROM MULTIPLE CSV FILES](csv-import.md#copy-from-multiple-csv-files-to-a-single-table) section for details.
