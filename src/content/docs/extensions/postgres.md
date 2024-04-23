---
title: PostgreSQL Extension
---

The PostgreSQL extension allows Kùzu to directly scan data from PostgreSQL databases.
This allows users to not only view their PostgreSQL tables in Kùzu, but also facilitates seamless
migraton of data from PostgreSQL to Kùzu for deeper graph analysis. Currently, the extension is read-only
from Postgres and does not support write operations.

## Usage

`postgres` is an official extension developed and maintained by Kùzu.
It can be installed and loaded by running the following commands using the CLI or your preferred language
client API:

```sql
INSTALL postgres;
LOAD EXTENSION postgres;
```

:::note[Notes]
- This extension works for PostgreSQL versions 14 and above (and possibly on older versions,
though this hasn't been tested extensively).
- If you experience an error while loading the extension, ensure that `postgres` 14 or above is installed
on your system. On MacOS for PostfreSQL 16, this is done via `brew install postgres@16`. See the PostgreSQL
[installation guide](https://www.postgresql.org/download/) for specific instructions for your OS.
:::

## Direct scan from PostgreSQL

Directly scan from PostgreSQL tables using the `LOAD FROM` statement.

### Create a sample postgreSQL database

To illustrate the usage of this extension, we create a sample `postgresql` database of university
students. The first step is to create an empty database.

```py
import psycopg2

conn = psycopg2.connect(
    dbname="university",
    user="postgres",
    host="localhost",
    password=os.environ.get("POSTGRES_PASSWORD"),
    port=5432,
)

cur = conn.cursor()
conn.autocommit = True
cur.execute("CREATE DATABASE university")
cur.close()
conn.close()
```

Then we can connect to this database and start populating it with with some data:
```py
import psycopg2

conn = psycopg2.connect(
    dbname="university",
    user="postgres",
    host="localhost",
    password=os.environ.get("POSTGRES_PASSWORD"),
    port=5432,
)

cur = conn.cursor()
conn.autocommit = True
cur.execute("CREATE TABLE PERSON (name VARCHAR, age INTEGER);")
cur.execute("INSERT INTO PERSON (name, age) VALUES ('Alice', 30)")
cur.execute("INSERT INTO PERSON (name, age) VALUES ('Bob', 27)")
cur.execute("INSERT INTO PERSON (name, age) VALUES ('Carol', 19)")
cur.execute("INSERT INTO PERSON (name, age) VALUES ('Dan', 25)")

cur.close()
conn.close()
```

### Attach PostgreSQL instance in Kùzu

```sql
ATTACH [PG_CONNECTION_STRING] AS [alias] (dbtype 'postgres')
```

The below example shows how the `university` PostgreSQL database can be attached to Kùzu using
the alias `uw`:

```sql
ATTACH 'dbname=university user=postgres host=localhost password=POSTGRES_PASSWORD' AS uw (dbtype 'POSTGRES');
```

The `ATTACH` statement requires the following parameters:

- `PG_CONNECTION_STRING`: PostgreSQL connection string
- `alias`: Database alias to use in Kùzu - If not provided, the database name from PostgreSQL will be used
    - When attaching multiple databases, it's recommended to use aliasing to avoid conflicts in
referencing tables.

The below table lists some common connection string parameters:

| Parameter | Description | Default |
|-----------|-------------| ------- |
| `dbname`    | Database name | [user defined] |
| `host`      | Host IP address | `localhost` |
| `user`      | Postgres username | `postgres` |
| `password`  | Postgres password | [empty] |
| `port`      | Port number | 5432 |

#### Configuring PostgreSQL via environment variables

It's recommended to use environment variables to store sensitive information like passwords. This is
common practice in production environments where the connection information is managed externally and
passed to the application via scripts.

```sh
export POSTGRES_PASSWORD="secret"
```

### Scan from PostgreSQL tables

Finally, we can utilize the `LOAD FROM` statement to scan the `Person` table.

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

The above steps showed how to scan (i.e., read) data from a PostgreSQL table using the `postgres` extension.

## Data migration from PostgreSQL tables

One important use case of the PostgreSQL extension is to facilitate seamless data transfer from PostgreSQL to Kùzu.
In this example, We continue using the `university` database created in the last step, but this time,
we copy the data and persist it to Kùzu. This is done with the `COPY FROM {subquery}` feature.

### Create a `Person` table in Kùzu

We first create a `Person` table in Kùzu which has the same schema as the one defined in PostgreSQL.

```sql
CREATE NODE TABLE Person (name STRING, age INT32, PRIMARY KEY(name));
```

### Utilize `COPY FROM` to migrate data

We can reference the created alias `uw` to copy data from the PostgreSQL table to the Kùzu table.

```sql
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
