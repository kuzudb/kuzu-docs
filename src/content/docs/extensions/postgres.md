---
title: PostgreSQL Extension
---

The `postgreSQL` extension allows Kùzu to directly scan from PostgreSQL databases that are persisted to
disk. This allows users to not only view their PostgreSQL data in Kùzu, but also facilitates seamless
migraton of data from PostgreSQL to Kùzu for deeper graph analysis.

## Usage

`PostgreSQL` is an official extension developed and maintained by Kùzu.
It can be installed and loaded using the following commands:

```cypher
INSTALL postgres_scanner;
LOAD EXTENSION postgres_scanner;
```

## Direct scan from PostgreSQL

Directly scan from PostgreSQL tables using the `LOAD FROM` statement.

### Create a sample postgreSQL database

To illustrate the usage of this extension, we create a sample `postgresql` database of university
students.

Firstly, we have to create the university database:
```py
import psycopg2

conn = psycopg2.connect(
    dbname="postgres",
    user="username",
    host="localhost",
)

cur = conn.cursor()
conn.autocommit = True
cur.execute("CREATE DATABASE university")
cur.close()
conn.close()
```


Then we can connect and start populating the university database with some data:
```py
import psycopg2

conn = psycopg2.connect(
    dbname="university",
    user="username",
    host="localhost",
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

```
ATTACH [PG_CONNECTION_STRING] as [alias] (dbtype 'postgres')
```

- `PG_CONNECTION_STRING`: PostgreSQL connection string
- `alias`: Database alias to use in Kùzu - If not provided, the database name from PostgreSQL will be used

:::note[Note]
When attaching multiple databases, it's recommended to use aliasing to avoid conflicts in
referencing tables.
:::

The following example shows how the `university` PostgreSQL database can be attached to Kùzu using
the alias `uw`:

```cypher
ATTACH 'dbname=university user=username host=localhost' as uw (dbtype 'POSTGRES');
```

### Scan from PostgreSQL tables

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

The above steps showed how to scan (i.e., read) data from a PostgreSQL table using the `postgres_scanner`.

## Data migration from PostgreSQL tables

The larger purpose of the PostgreSQL Scanner is to facilitate seamless data transfer from PostgreSQL to Kùzu.
In this example, We continue using the `university.db` database created in the last step, but this time,
we copy the data and persist it to Kùzu. This is done with the `COPY FROM {subquery}` feature.

### Create a person table in Kùzu

We first create a `Person` table in Kùzu which has the same schema as the one defined in PostgreSQL.

```cypher
CREATE NODE TABLE Person (name STRING, age INT32, PRIMARY KEY(name));
```

### Utilize `COPY FROM` to migrate data

We can reference the created alias `uw` to copy data from the PostgreSQL table to the Kùzu table.

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
