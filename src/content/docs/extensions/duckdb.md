---
title: DuckDB extension
---

The DuckDB scanner extension allows Kùzu to directly scan data from DuckDB databases that are persisted to
disk. This allows users to not only view their DuckDB tables in Kùzu, but also facilitates seamless
migration of data from DuckDB to Kùzu for deeper graph analysis. Currently, the extension is read-only
from DuckDB and does not support write operations.

## Usage

`duckdb` is an official extension developed and maintained by Kùzu.
It can be installed and loaded by running the following commands using the CLI or your preferred language
client API:

```sql
INSTALL duckdb_scanner;
LOAD EXTENSION duckdb_scanner;
```

:::note[Notes]
- The minimum version of DuckDB required to use this extension is 0.10.0.
- If you experience an error while loading the extension, ensure that the `duckdb` binary is installed
on your system. On MacOS, this is done via `brew install duckdb`. See the DuckDB
[installation guide](https://duckdb.org/docs/installation) for instructions for your OS.
:::

## Direct scan from DuckDB

This section shows how to directly scan from DuckDB tables to Kùzu using the `LOAD FROM` statement.

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

```sql
ATTACH [DB_PATH] AS [alias] (dbtype 'duckdb')
```

- `DB_PATH`: Path to the DuckDB database instance (can be relative or absolute path)
- `alias`: Database alias to use in Kùzu - If not provided, the database name from DuckDB will be used
    - When attaching multiple databases, it's recommended to use aliasing to avoid conflicts in
referencing tables

The below example shows how the `university.db` DuckDB database can be attached to Kùzu using
the alias `uw`:

```sql
ATTACH 'university.db' AS uw (dbtype 'duckdb');
```

### Scan from DuckDB tables

Finally, we can utilize the `LOAD FROM` statement to scan the person table.

```sql
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

## Detach DuckDB instance

To detach a DuckDB instance, use `DETACH [ALIAS]` as follows:

```sql
DETACH uw
```

## Data migration from duckdb tables

One important use case of the DuckDB extension is to facilitate seamless data transfer from DuckDB to Kùzu.
In this example, We continue using the `university.db` database created in the last step, but this time,
we copy the data and persist it to Kùzu. This is done with the `COPY FROM {subquery}` feature.

### Create a `Person` table in Kùzu

We first create a `Person` table in Kùzu which has the same schema as the one defined in DuckDB.

```cypher
CREATE NODE TABLE Person (name STRING, age INT32, PRIMARY KEY(name));
```

### Utilize `COPY FROM` to migrate data

We can reference the created alias `uw` to copy data from the DuckDB table to the Kùzu table.

```sql
COPY Person FROM (LOAD FROM uw.person RETURN *);
```

### Query the data in Kùzu

Finally, we can verify the data in the `Person` table in Kùzu.

```cypher
MATCH (p:Person) RETURN p.*;
```

Result:
```
------------------
| p.name | p.age |
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

### DuckDB schema cache
To avoid repetitive retriving schema data from Postgres, Kùzu maintains cached schema information including table names, their respective columns and types. Should modifications occur in the schema via an alternate connection to the DuckDB instance, such as creation/deletion of tables, the cached schema data may become obsolete. Users can utilize duckdb_clear_cache() function to refresh cached schema information.

