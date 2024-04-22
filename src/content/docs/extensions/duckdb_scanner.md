---
title: duckdb_scanner (duckdb database scanner)
---

The `duckdb_scanner` extension allows Kùzu to directly scan duckdb tables. Tables can be easily migrated from duckdb to kuzu.
  
# Usage

`duckdb_scanner` is an official extension developed and maintained by Kùzu.
It can be installed and loaded as other extensions using the following commands:

```cypher
INSTALL duckdb_scanner;
LOAD EXTENSION duckdb_scanner;
```

## Direct scan from duckdb
`duckdb_scanner` allows user to direct scan from duckdb tables using `load from` statement.

Example:

1. To begin with, we create a sample duckdb database using python:
```
import duckdb

conn = duckdb.connect('university.db')

# Insert data to person table
conn.execute("CREATE TABLE person (name VARCHAR, age INTEGER);")
conn.execute("INSERT INTO person values ('Alice', 30);")
conn.execute("INSERT INTO person values ('Bob', 27);")
conn.execute("INSERT INTO person values ('Carol', 19);")
conn.execute("INSERT INTO person values ('Dan', 25);")
```

2. Attach duckdb database instance in Kùzu:

Grammar:
```
ATTACH [DB_PATH] as [alias] (dbtype 'duckdb')
Where:
DB_PATH: is the path to the duckdb database instance.
alias: the database alias to use in kuzu. (If not provided, the database instance default name will be used.)
```
Example:
```cypher
ATTACH 'university.db' as uw (dbtype 'duckdb');
```

3. Finally, we can utilize the `load from` statement to scan the person table.
```cypher
LOAD FROM uw.person 
RETURN *
```

Result:

```
---------------
| name  | age |
---------------
| Alice | 30  |
---------------
| Bob   | 27  |
---------------
| Carol | 19  |
---------------
| Dan   | 25  |
---------------
```

## Data migration from duckdb tables.
DuckDB Scanner facilitates seamless data migration from DuckDB to Kudu with ease.
In this example, We continue use the `university`, which is created in the last step.
If we want to migrate a duckdb table to kuzu, we can utilize the `copy from subquery` feature.
1. Firstly, we create a person table in kuzu which has the same schema as the one defined in duckdb.
```
create node table person (name string, age int32, primary key(name));
```
2. Then, `copy from subquery` feature can be utilized to easily migrate table data from duckdb to kuzu.
```
copy person from (load from uw.person return *);
```
3. Finally, verify the data in kuzu person table.
```
MATCH (p:person) RETURN p.*;
```
Result:
```
------------------
| s.name | s.age |
------------------
| Alice  | 30    |
------------------
| Bob    | 27    |
------------------
| Carol  | 19    |
------------------
| Dan    | 25    |
------------------
```
