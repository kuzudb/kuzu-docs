---
title: DuckDB extension
---

The DuckDB extension allows Kùzu to directly scan data from DuckDB databases. 
Currently, this is done by `LOAD FROM` statements.
This allows users to not only view their DuckDB tables in Kùzu, but also facilitates seamless
migration of data from DuckDB to Kùzu for deeper graph analysis. Currently, the extension is read-only
from DuckDB and does not support write operations.

:::note[Notes]
- The DuckDB database that you want to scan from needs to be created using a DuckDB 0.10.x version.
:::


## Usage

`duckdb` is an official extension developed and maintained by Kùzu.
It can be installed and loaded by running the following commands using the CLI or your preferred language
client API:

```
INSTALL duckdb;
LOAD EXTENSION duckdb;
```


## Direct scan from DuckDB

This section shows how to directly scan from DuckDB tables to Kùzu using the `LOAD FROM` statement.

### Create a sample DuckDB database

To illustrate the usage of this extension, we create a sample DuckDB database of university
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
- `alias`: Database alias to use in Kùzu - If not provided, the database name from DuckDB will be used.
  When attaching multiple databases, it's recommended to use aliasing.

The below example shows how the `university.db` DuckDB database can be attached to Kùzu using
the alias `uw`:

```sql
ATTACH 'university.db' AS uw (dbtype 'duckdb');
```

### Scan from DuckDB tables

Finally, we can utilize the `LOAD FROM` statement to scan the `person` table.

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

## Data migration from DuckDB tables

One important use case of the DuckDB extension is to facilitate seamless data transfer from DuckDB to Kùzu.
In this example, we continue using the `university.db` database created in the last step, but this time,
we copy the data and persist it to Kùzu. This is done with the [`COPY FROM` query results feature](../import/copy-from-query-results).

### Create a `Person` table in Kùzu

We first create a `Person` table in Kùzu which has the same schema as the one defined in DuckDB.

```cypher
CREATE NODE TABLE Person (name STRING, age INT32, PRIMARY KEY(name));
```

### Use `COPY FROM` to migrate data

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

## Clear attached database schema cache

To avoid redundantly retrieving schema information from attached databases, Kùzu maintains a schema cache
including table names and their respective columns and types. Should modifications occur in the schema
via an alternate connection to attached databases (DuckDB or some other attachad database), such as creation or deletion of tables, the cached
schema data may become obsolete. You can use the `clear_attached_db_cache()` function to refresh cached
schema information in such cases.

```sql
CALL clear_attached_db_cache() RETURN *
```
Note: this call function will clear cache of all attached databases.
## `USE` statement

The `USE` statement for attached databases sets a default database name to use for future operations.
This can be used when reading from an attached database to avoid specifying the full database name
as a prefix to the table name.

Consider the same attached database as above:

```sql
ATTACH 'university.db' AS uw (dbtype 'duckdb');
```

Instead of defining the DUckDB database name for each subsequent clause like this:

```sql
LOAD FROM uw.person
RETURN *
```

You can do:

```sql
USE uw;
LOAD FROM person
RETURN *
```
