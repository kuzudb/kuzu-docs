---
title: Remote Kùzu extension
---

This section describes how to attach to remote Kùzu database and execute queries on it. This is enabled
by the `httpfs` extension which allows reading from/writing to files hosted on remote file systems.

## Usage

First, install the `httpfs` extension per [the docs](/extensions/httpfs) and attach to a remote Kùzu database as follows:

```sql
ATTACH [DB_PATH] AS [alias] (dbtype kuzu)
```

- `DB_PATH`: Path to the remote filesystem (can either be a S3 or HTTP URL)
- `alias`: Database alias to use - If not provided, the database name from Kùzu will be used.
  When attaching multiple databases, it's recommended to use aliasing.

The below example shows how the `university` Kùzu database directory hosted on S3 can be attached to Kùzu using
the alias `uw`:

```sql
ATTACH 's3://Kùzu-example/university' AS uw (dbtype kuzu);
```
:::danger[Note]
After attaching a remote Kùzu database, users no longer have access to the original local Kùzu database. The default database is
switched to the attached remote Kùzu database right after the `attach` statement and users can only query the remote Kùzu database.
:::

## Execute queries

Only read-only queries are allowed to execute on a remote Kùzu database (no writes).

```sql
MATCH (p:person) RETURN p.*
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
