---
title: DuckDB Extension
---

The `duckdb` extension allows Kùzu to directly scan from DuckDB databases that are persisted to
disk. This allows users to not only view their DuckDB data in Kùzu, but also facilitates seamless
migraton of data from DuckDB to Kùzu for deeper graph analysis.

## Usage

`duckdb_scanner` is an official extension developed and maintained by Kùzu.
It can be installed and loaded using the following commands:

```cypher
INSTALL duckdb_scanner;
LOAD EXTENSION duckdb_scanner;
```

## Direct scan from DuckDB

Directly scan from DuckDB tables using the `LOAD FROM` statement.

### Create a sample DuckDB database

To illustrate the usage of this extension, we create a sample `duckdb` database of university
students in Python.

```py
import duckdb

conn = duckdb.connect('university.db')

# Insert data to person table
conn.execute("CREATE TABLE person (name VARCHAR, age INTEGER);")
conn.execute("INSERT INTO person values ('Alice', 30);")
conn.execute("INSERT INTO person values ('Bob', 27);")
conn.execute("INSERT INTO person values ('Carol', 19);")
conn.execute("INSERT INTO person values ('Dan', 25);")
```

### Attach DuckDB instance in Kùzu

```
ATTACH [DB_PATH] as [alias] (dbtype 'duckdb')
```

- `DB_PATH`: Path to the DuckDB database instance (can be relative or absolute path)
- `alias`: Database alias to use in Kùzu - If not provided, the database name from DuckDB will be used

:::note[Note]
When attaching multiple databases, it's recommended to use aliasing to avoid conflicts in
referencing tables.
:::

The following example shows how the `university.db` DuckDB database can be attached to Kùzu using
the alias `uw`:

```cypher
ATTACH 'university.db' as uw (dbtype 'duckdb');
```

### Scan from DuckDB tables

Finally, we can utilize the `load from` statement to scan the person table.

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

The above steps showed how to scan (i.e., read) data from a DuckDB table using the `duckdb_scanner`.

## Data migration from duckdb tables

The larger purpose of the DuckDB Scanner is to facilitate seamless data transfer from DuckDB to Kùzu.
In this example, We continue using the `university.db` database created in the last step, but this time,
we copy the data and persist it to Kùzu. This is done with the `COPY FROM {subquery}` feature.

### Create a person table in Kùzu

We first create a `Person` table in Kùzu which has the same schema as the one defined in DuckDB.

```cypher
CREATE NODE TABLE Person (name STRING, age INT32, PRIMARY KEY(name));
```

### Utilize `COPY FROM` to migrate data

We can reference the created alias `uw` to copy data from the DuckDB table to the Kùzu table.

```cypher
COPY Person FROM (LOAD FROM uw.person RETURN *);
```

### Query the data in Kùzu

Finally, we can verify the data in the `Person` table in Kùzu.

```cypher
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
