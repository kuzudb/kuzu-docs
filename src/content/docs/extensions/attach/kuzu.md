---
title: Attaching to external Kùzu databases
---

Using the `ATTACH` statement, you can connect to an external Kùzu database. The external Kùzu database can be local or remote, e.g.,
in an S3 bucket. Attaching to a local Kùzu database does not require installing any extensions. Attaching to a remote
Kùzu database requires installing the `httpfs` extension. Aside from this requirement of installing the `httpfs` extension,
attaching to a local vs. remote Kùzu database work the same. So, we only document how to attach to a remote Kùzu database here.

As a first step, you need to install the `httpfs` extension with the following commands:

```sql
INSTALL httpfs;
LOAD EXTENSION httpfs;
```
Then you use the `ATTACH` statement to attach to a remote Kùzu database. The basic syntax is as follows:
```sql
ATTACH [DB_PATH] AS [alias] (dbtype kuzu)
```

- `DB_PATH`: Path to the (remote) database directory  (can either be an S3, GCS or HTTP URL)
- `alias`: Database alias to use. Aliases are mandatory for attaching to external Kùzu databases.

You can list all the databases you have attached to by running the following command:
```sql
CALL SHOW_ATTACHED_DATABASES() RETURN *;
```

Unlike attaching to external RDBMSs, the alias is not used as a prefix of node and relationship tables. This is because at any point in time,
you can attach to a single external Kùzu database (or be connected to the local Kùzu database you opened at the beginning of your session).
Therefore you don't need to prefix your node and relationship tables.
Instead you will use the alias to `DETACH` from the external Kùzu database.

Suppose you are connected to a local database `./demo_db`. The below example shows how the Kùzu database hosted on S3 directory
`'s3://kuzu-example/university` can be attached to using the alias `uw`.

If you wish to attach to a database hosted on GCS instead, just replace the prefix `s3://` with `gs://` (in this case it would become `'gs://kuzu-example/university`). For more information on how to set up Kùzu with GCS, see [here](/extensions/httpfs#gcs-file-system).

```sql
ATTACH 's3://kuzu-example/university' AS uw (dbtype kuzu);
```
After attaching a remote Kùzu database, you no longer have access to the original local Kùzu database `./demo_db`.
After the `ATTACH` statement above, you can only query the external Kùzu database under `s3://kuzu-example/university`.

#### Execute queries on external Kùzu database.
We only allow **read-only** queries to execute on external Kùzu database (even if the external database is stored on local disk).
```sql
MATCH (p:Person) RETURN p.name AS name, p.age AS age;
```

Result:

```
┌────────┬───────┐
│ name   │ age   │
│ STRING │ INT64 │
├────────┼───────┤
│ Alice  │ 30    │
│ Bob    │ 27    │
│ Carol  │ 19    │
│ Dan    │ 25    │
└────────┴───────┘
```

## Detaching from a remote Kùzu database
You can detach from an external Kùzu database by using the `DETACH [ALIAS]` statement as follows:

```sql
DETACH uw
```

After the `DETACH` statement, you can continue querying your local Kùzu database `./demo_db`. Therefore, detaching
from an external Kùzu database switches your Kùzu database to become the local database you had started your session with.

## Using local cache for remote files

When connecting to a remote external Kùzu database, say the `'s3://kuzu-example/university`  database in our example above,
you would use the `httpfs` extension. When querying this remote database in Cypher, Kùzu will make HTTPS calls to the
remote server to query this database. Similar to how you can speed up `LOAD FROM` queries using the [local httpfs cache](/extensions/httpfs#local-cache-for-remote-files)
for scanning remote files, you can also speed up your Cypher queries by using the local httpfs cache.
You can enable the local cache by running `CALL HTTP_CACHE_FILE=TRUE;` _after_ installing the `httpfs`
extension and _before_ attaching to the remote Kùzu database.
