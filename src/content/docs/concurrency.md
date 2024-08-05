---
title: "Connections & Concurrency"
---

:::caution[Note]
This section is for users who are interested in gaining a deeper understanding of Kùzu's concurrency model
and some of its limitations. If you are just getting started with Kùzu, you can skip to the [FAQ](#faqs)
section below to get answers to common questions.
:::

In this section, we will go over the basics of how applications connect to a Kùzu database and list some
best practices on how to do so concurrently.

Kùzu is a disk-based system and each database is stored in a database directory (an in-memory version
of Kùzu is on our immediate roadmap). Throughout this documentation, let's suppose you have a Kùzu
database in your local directory `./kuzu-db-dir`.

## Understand connections

### Database and connection objects
Application processes must connect to a Kùzu database in 2 steps before they can start querying it:

**Step 1.** Create an instance of a `Database` object `db` and pass it the database directory (`./kuzu-db-dir` in our example below), and 
a read-write mode which can be either:
1. `READ_WRITE` (default); or
2. `READ_ONLY`

**Step 2.** Creating a `Connection` object `conn` from the Database object `db`.

- A Connection object that was created using a `READ_WRITE` Database object can execute queries that
do both read (e.g., queries with `MATCH WHERE RETURN` statements) as well as  write operations
(e.g., queries with `CREATE` or `COPY FROM` statements).
- In contrast, a Connection object that was created using a `READ_ONLY` Database can only execute
queries that do read operations.

Then, using `conn`, one can execute Cypher queries against the database stored under `./kuzu-db-dir`.
Here's a simple example application in Python that demonstrates these 2 steps for creating a `READ_WRITE`
database and a connection. The same principles apply to other language APIs as well:

```python
import kuzu

# Open the database in `READ_WRITE` mode. The below code is equivalent to:
# db = kuzu.Database("./kuzu-db-dir", read_only=False)  
db = kuzu.Database("./kuzu-db-dir") 
conn = kuzu.Connection(db)
conn.execute("CREATE (a:Person {name: 'Alice'});")
```

## Understand concurrency

### Limitations of creating multiple Database objects
Kùzu is an embedded database, i.e., it is a library you embed inside an application process and runs as part
of this application process, instead of a separate process.
You can think of the Database object as the Kùzu database software.
Specifically, the Database object contains
different components of the Kùzu database software, such as its buffer manager, storage manager, transaction manager etc. 
Several of the components inside a Database object, such as the buffer manager,
caches parts of the data that is stored on disk. This limits the number of Database objects that can be created
pointing to the same database directory, either in the same process or across multiple processes.

The possible settings are:
1. One `READ_WRITE` Database object; or
2. Multiple `READ_ONLY` Database objects.

:::caution[Note]
The core idea related to concurrency is this: you cannot have a `READ_WRITE` Database object `db1`
and a separate  `READ_ONLY` or `READ_WRITE` Database object `db2`, and also concurrently query the same
database through connections from both `db1` and `db2`. This is not safe.
:::

The reason for this limitation is that if a connection `conn1` from `db1` makes a
write operation, say deleting some node record, then the`db1` object is able to ensure
that any cached data in `db1` is refreshed and is accurate. However, it cannot notify other Database objects that may exist
about the change. So in our example, `db2`'s cache would no longer represent the true state of the
data on disk that was cached. This can lead to problems if
connections from `db2` try to run queries after db1's modification. Therefore, Kùzu will
not allow multiple Database objects to be created unless they are all `READ_ONLY`.

The limitation of having either one `READ_WRITE` Database object or multiple `READ_ONLY` Database objects applies
even if these Database objects are created in the same application process. That said, there is often no good reason for
creating multiple Database instances within the same process (you should instead share the same Database object
in that process).

However, there are common scenarios when you may want to launch
multiple application processes that connect to the same database directory. Once such scenario
is when developing your workflow in Python using a Jupyter notebook,
that connects to `./kuzu-db-dir`. Say you want to also run the Kùzu CLI alongside your Jupyter notebook,
which also connects to the same `./kuzu-db-dir`. When you launch Kùzu CLI and point it to
`./kuzu-db-dir`, Kùzu CLI embeds Kùzu and tries to creates a `READ_WRITE` Database object. So if your notebook process already
has created a Database object, this will fail with an error that looks like this:

```
IO exception: Could not set lock on file : ./kuzu-db-dir/.lock
```

If this happens, would have to shut down your notebook process (or simply restart your Jupyter server),
so that its Database object is destroyed, before the CLI can run.

### Create multiple Connections from the same Database object

Note that the above limitation about creating multiple Database objects does not mean that you cannot create 
multiple Connections from the same `READ_WRITE` Database object and issue concurrent queries. For example,
you can write a program that creates a single `READ_WRITE` Database object `db` that points to `./kuzu-db-dir`. 
Then, you can spawn multiple threads
T<sub>1</sub>, ..., T<sub>k</sub>, and each T<sub>i</sub> obtains a connection from `db` and concurrently issue
read or write queries. This is safe. Every read and write statement in Kùzu is wrapped around a transaction
(either automatically or manually by you). Concurrent transactions that operate on the same database
`./kuzu-db-dir` are safely executed by Kùzu's transaction manager (i.e., the transaction manager inside `db`),
again as long as those transactions are issued by connections that were created from the same Database object. 
See the documentation on [transactions](/cypher/transaction) for the transactional guarantees that Kùzu provides.

## Example scenarios

Below, we provide some examples and best practices for common scenarios you are likely to run Kùzu under:

### Scenario 1: One process that creates a `READ_WRITE` database
In this scenario, you have a single application process that embeds Kùzu and creates a `READ_WRITE` Database object
that opens the `./kuzu-db-dir` database. Within this process, you can create multiple concurrent connections, each of which
can execute queries that can read and write to the database, which will be handled safely
by Kùzu's transaction manager. Pictorially, this scenario looks as follows:

<img src="/img/concurrency/kuzu-concurrency-1.svg" width="400"/>

For simplicity, in the above image queries
from `conn1` and `conn2` are executed sequentially but they could be running concurrently as well.

### Scenario 2: Multiple processes that create `READ_ONLY` databases
In this scenario, you have multiple applications process that embed
Kùzu and create `READ_ONLY` Database objects that open the same database directory `./kuzu-db-dir`. 
Each process can create multiple concurrent connections and issue queries.
However, each connection can only execute read-only queries (because the database is opened in `READ_ONLY` mode).
Since the connections and queries are read-only none of the queries can change the actual database files on disk.
Therefore, even though the queries are coming
from connections from different Database objects, this is safe and allowed.

<img src="/img/concurrency/kuzu-concurrency-2.svg" />

If you're interested in running multiple processes that can read and write to the same database, see the next section.

### Performing read-write operations from multiple processes
In certain production settings, you may need to have multiple processes that read and write to the same Kùzu database,
say again stored under `./kuzu-db-dir`.
This is the case for example if you have an online application. Say you have a browser application and multiple users 
use your application from different browsers and each user interaction leads to concurrent read-write queries
on the same database. To support such scenarios, a common design pattern is this: 
1. **One API server process** that embeds Kùzu
   and creates a single `READ_WRITE` Database object pointing to `./kuzu-db-dir`.
   The API server is responsible for handling incoming requests from clients, say through HTTP or gRPC. The
   requests' Cypher queries, which can read and write data to the database, are executed
   (possibly) concurrently. 
2. **Multiple client processes** that connect to the API server and send requests to the API server (again through some protocol, such
as HTTP or gRPC). You are free to open any number of client processes that issue read or write queries to the API server.

Note that in terms of processes that embed Kùzu, this design pattern follows
[scenario 1](#scenario-1-one-process-that-creates-a-read_write-database) above as there is actually
one process that creates a `READ_WRITE` Database object. To enable users to get up and running with such an architecture, 
we provide a REST-style [Kùzu API server](https://github.com/kuzudb/api-server) powered by Express.js. 
Pictorially, this design pattern looks as follows:

<img src="/img/concurrency/kuzu-concurrency-3.svg" />

:::caution[Note]
There are potential performance implications of executing queries via a REST API server, because the HTTP
protocol involves passing query results as JSON over the network. In general, it is faster to execute
queries directly on the database by embedding Kùzu in your application.
:::

## Known Issue: Kùzu Explorer not recognizing the `.lock` file permissions

Kùzu ensures that multiple Database objects, where one of them is a `READ_WRITE` instance, are not 
created by setting some permission flags in a `.lock` file under the database directory. This is a lightweight
locking mechanism. However, there is a known issue that Kùzu Explorer is not
able to see the flags put by other processes. The core problem is that Explorer runs as a Docker container
and the flags are not propagated between the host operating system and the Docker environment. We do not currently
have a fix to this (do [contact us](mailto:contact@kuzudb.com) if you know of an easy solution). So if you have a process (or processes) that has 
opened a Database directory and yonpmu concurrently start Kùzu Explorer, you should manually ensure that
either: (i) both Explorer and your other process  are in `READ_ONLY` mode; or (ii) you shut down your other
process first before opening Explorer in `READ_WRITE` mode.

## FAQs

In this section, we address some commonly asked questions related to concurrency and connections in Kùzu.

##### Can I embed Kùzu using both `READ_ONLY` and `READ_WRITE` processes in my application?

No, when embedding Kùzu in your application, you cannot have both `READ_WRITE` and `READ_ONLY` database processes
open at any given time (in a safe manner). Technical details for this limitation are described the the sections above.

In short, the reason for this limitation is that at any given time, `READ_WRITE` process can make changes
to the disk layout, which may or may not be reflected in the buffer manager of other open `READ_ONLY` connections, and this
can lead to inconsistencies or data corruption. To avoid this issue, the best practice when embedding Kùzu in your
application is to use design patterns as per one of the scenarios shown pictorially, in the sections above.

##### I'm seeing an error related to lock files when running Kùzu in a Jupyter notebook. How can I resolve this?

Sometimes, when you are working in a Jupyter notebook and building your Kùzu graph while also trying to
open other processes that connect to the same database directory, you may come across this error:

```
IO exception: Could not set lock on file : ./db_directory/.lock
```

The `.lock` file, as described in earlier sections in this page, is present to protect you from inadvertent
data corruption due to multiple Database instances trying to access the same database directory concurrently.
To resolve this, simply click the `Restart server` button in your Jupyter notebook (or close the Jupyter
notebook entirely). Restarting the Jupyter notebook server (or closing it) will release the `.lock` file
present in the database directory, allowing you to safely connect to the database via another connection,
for example, a CLI or Kùzu Explorer for graph visualization. In general, it's recommended to only
open the CLI or Kùzu Explorer *after* you have finished any operations to the database (and closing or
restarting the Jupyter notebook server).
