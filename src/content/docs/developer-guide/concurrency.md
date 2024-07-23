---
title: "Concurrency"
---

This section is for developers who want to better understand the concurrency model in Kùzu.

Kùzu implements MVCC ([Multiversion Concurrency Control](https://en.wikipedia.org/wiki/Multiversion_concurrency_control)),
allowing concurrent read/write access to the database. You can use one of the below configurations
to concurrently read/write data in Kùzu:

1. **One** `READ_WRITE` process: One process can concurrently _read_ and _write_ to the database.
2. **Multiple** `READ_ONLY` process: Multiple processes can concurrently _read_ from the database.
3. **Multiple** `READ_WRITE` processes via API: See the [below section](#option-3-multiple-read_write-processes-via-api).

To understand this in more detail, it's first important to understand what constitutes a process, and
subsequently, a connection, in Kùzu.

## Processes and connections

Each time you open a `Database` directory in your client language for your application, you are creating
a new process. This process can then open one or more concurrent connections to the database.
A `Database` process can be opened in either `READ_WRITE` mode or `READ_ONLY` mode. Within a
given process, you are free to open multiple connections to the database.

## Usage

The following subsections outline some scenarios that illustrate these different configurations.

### Option 1. Single `READ_WRITE` process

In this scenario, you have a single application process that embeds Kùzu and opens the directory in
`READ_WRITE` mode. Within this process, you can open multiple concurrent connections, each of which
can execute queries that can read and write to the database (including manual transactions). See the
[transactions](/cypher/transaction) section for more details on how concurrent write operations
are handled.

<img src="/img/concurrency/kuzu-concurrency-1.svg" width="400"/>

In the example above, the database process is opened in `READ_WRITE` mode, and two connections are opened.
Two concurrent write operations that use the `CREATE` statement are run within this process.

### Option 2. Multiple `READ_ONLY` processes

In cases where you have read-heavy workloads, you can have multiple applications process that embed
Kùzu and open the same database directory in `READ_ONLY` mode. Each process can have multiple connections
as well. However, each connection can only execute read-only queries (because the database is opened in
`READ_ONLY` mode).

<img src="/img/concurrency/kuzu-concurrency-2.svg" />

In the example above, two independent processes are opened in `READ_ONLY` mode, and each process has its
own connection to the same database. Two separate read queries that use the `MATCH` clause are run
concurrently.

### Option 3. Multiple `READ_WRITE` processes via API

In certain production settings, you may need to have multiple processes reading from the database
and one process writing to it, all open at the same time. In this case, we highlight a design pattern that enables this without
risking data corruption. This scenario involves building an API server that embeds Kùzu in `READ_WRITE`
mode, and then building your application layer on top of this API server.

<img src="/img/concurrency/kuzu-concurrency-3.svg" />

The example above shows the following components:
1. **One** API server process that embeds Kùzu and has access to the database directory in `READ_WRITE` mode.
The API server is responsible to handle incoming requests from clients, say through HTTP or gRPC. The
requests' Cypher queries, which can read and write data to the database, are parsed and executed
concurrently, making this similar to scenario 1.
1. **Multiple** client processes that connect to the API server. You are free to open any number of client
processes that issue read or write queries to the API server.

To enable users to get up and running with such an architecture, we provide [Kùzu API server](https://github.com/kuzudb/api-server),
a REST-style API server powered by Express.js.

:::caution[Note]
There are performance implications of executing queries via a REST API server, because the HTTP
protocol involves passing query results as JSON over the network. In general, it is faster to execute
queries directly on the database by embedding Kùzu in your application, per scenarios 1 or 2.

For high-performance applications that require the architecture shown in scenario 3, we could
explore other protocols like Bolt or gRPC to communicate between the client and the API server. Reach out
to us on [GitHub]([https://kuzu](https://github.com/kuzudb/kuzu/issues/new/choose)) if you have such an issue.
:::

## Commonly asked questions

In this section, we address some common questions that developers have when working with Kùzu.

##### Q1: Can I embed Kùzu using both `READ_ONLY` and `READ_WRITE` processes in my application?

A: No, when embedding Kùzu in your application, you cannot have both `READ_WRITE` and `READ_ONLY` database processes
open at any given time. The reason for this restriction is that `READ_WRITE` process can make changes
to the disk layout, which may or may not be reflected in the buffer manager of other processes, and this
can lead to data corruption. To avoid this issue, the best practice when embedding Kùzu in your
application is to use design patterns from one of the three scenarios listed above.

##### Q2: I'm facing issues having a Jupyter notebook and Kùzu Explorer open at the same time. How can I resolve this?

A: You can have the Jupyter notebook open that embeds a Kùzu database in `READ_WRITE` mode, and a `READ_ONLY`
Kùzu Explorer process open in your browser at the same time. To reflect the most recent writes made
via the Jupyter notebook, we recommend that you restart the Kùzu Explorer container via the `docker restart <my_container>`.
command. This will ensure that the Kùzu Explorer process is in sync with the latest changes made by the Jupyter notebook.

If you see an error like "Could not set lock on file : ./db/.lock", it is because the `READ_ONLY` process
could not acquire a lock on the database directory (which is held by the `READ_WRITE` process, to protect you
from data corrpution). To resolve this, simply click the `Restart server` button in your Jupyter notebook.
Restarting the Jupyter notebook server will release the lock file in the database directory, allowing
you to open other `READ_ONLY` processes that connect to same database.
