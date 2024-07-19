---
title: "Concurrency"
---

Kùzu implements MVCC ([Multiversion Concurrency Control](https://en.wikipedia.org/wiki/Multiversion_concurrency_control))
that allows concurrent access to the database. You can use one of (but not both) the below configurations
to concurrently read/write data in Kùzu from independent processes:

1. **One** `READ_WRITE` connection: One process can concurrently _read_ and _write_ to the database.
2. **Multiple** `READ_ONLY` connections: Multiple processes can concurrently _read_ from the database.

The effect of this concurrency model is that a `READ_WRITE` connection will hold a lock
on the database directory, preventing any other process (including `READ_ONLY` processes) from accessing the database,
to prevent data corruption and ensure consistency. Examples of either of these scenarios, as well
as some best practices, are given below.

:::caution[Note]
Kùzu's design is heavily inspired by DuckDB, an embedded relational database. Kùzu is
optimized for read-heavy workloads, so executing many small read-write transactions is not the primary
design goal of Kùzu.

As a result, it is recommended to bulk-insert data into Kùzu when possible so that you can
freely run analytical queries on large graphs with the performance guarantees that Kùzu provides.
:::

## Best practices for concurrency

There are many usage scenarios for analytical graph workloads. As many of these have custom requirements,
it helps to follow some best practices, which we will list below for some common scenarios.

### Scenario 1: Single `READ_WRITE` connection

This is a common scenario at the application level, where you may be working in a client API (or Jupyter notebook)
that writes data to the database, but are also opening additional `Database` instances in other
processes, such as the CLI or Kùzu Explorer, to query the data on the fly.

In such scenarios, it is recommended to only keep one single `READ_WRITE` connection open to
the database during the write stage, and opening the `READ_ONLY` connections _after_ the write operations
are completed. To speed up writes, it is recommended to use bulk inserts
via `COPY FROM`, so that the least possible time is spent in the write stage. Once the writer process finishes
its workload, it releases the lock on the database directory, so you can then open the `READ_ONLY` connections
via other processes like the CLI and Kùzu Explorer can be used to query the data.

For users working in Jupyter notebooks, the `.lock` file in the database directory is held by the
Jupyter server as long as the notebook is open. To release the lock so that you can query the database
via the CLI or Kùzu Explorer, simply close the notebook or restart the notebook server to release the
lock, and you can begin querying your data.

In pseudo-code, it would look something like this:

```py
# 1. Write stage
db = kuzu.Database("./db")
conn = kuzu.Connection(db)

# Bulk-insert data here
# Once this script finishes executing, the lock is released

# ---

# 2. Read stage
db = kuzu.Database("./db", read_only=True)
conn = kuzu.Connection(db)

# Altenatively, you can then open the database in Kùzu Explorer or the CLI
```

### Scenario 2: Multiple `READ_ONLY` connections

In this scenario, you are opening a single `Database` instance that can have
multiple `READ_ONLY` connections associated with it. This is common in scenarios like
running a REST API server on top of the database, or any other concurrent,
read-heavy workload. It's perfectly safe to open multiple processes that each hold their own `READ_ONLY`
connection when they originate from the same `Database` instance.

However, in this scenario, you cannot have a `READ_WRITE` connection that is _simultaneously_
modifying the data in the database, as it is possible that the transactions from one process
can modify the disk layout while not being recognized by another process, causing database corruption.
To perform writes safely in this scenario, you should ensure that the `READ_WRITE` process only runs
when all `READ_ONLY` connections are temporarily closed.

Some pseudo-code is shown below:

```py
db = kuzu.Database("./db", read_only=True)

conn1 = kuzu.Connection(db)
conn2 = kuzu.Connection(db)

# Alternatively, allow your web server to open multiple connections
# from the same `db` object
```
