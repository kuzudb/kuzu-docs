---
layout: default
title: Transaction
parent: Client APIs
---

# Overview

Kùzu is a transactional system. Specifically, it implements a transaction management
sub-system that is atomic, durable and supports serializability (satisfying these
properties is traditionally known as being ACID-compliant in database terminology). That is, every
query, data manipulation command, every DDL (i.e., new node/rel table schema definitions),  
or `COPY FROM' commands to Kùzu is part of a transaction. Therefore they depict all-or-nothing
behavior, so after these commands or a set of them execute and committed successfully, you are guaranteed
that all of their changes will persist entirely. If they do not execute successfully or are
rolled back, you are guaranteed that none of their changes will persist. These conditions hold,
even if your system crashes at any point during a transaction. That is, after committing successfully,
all your changes will persist even if there is an error after committing. Similarly, if your
system crashes before committing or rolling back, then none of your updates will persist.

## Important Properties of Kùzu Transactions: 
- Each transaction is identified as a write or read transaction (see below for how this is done).
- At any point in time, there can be multiple read transactions but one write transaction.
- There are two ways to use transactions: (i) manually beginning and committing/rolling back transactions; 
or (ii) auto-committing. These are reviewed below.
- Currently you can only use transactions from the .

# Manually Beginning and Committing/Rollingback
When you access Kùzu programmatically through its [C++ client API](../client-apis/cpp-api) (but not through its CLI or Python API[^1]),
you can start a write transaction, or a read only transaction manually as follows (in C++):

```
  auto systemConfig = make_unique<SystemConfig>();
  auto databaseConfig = make_unique<DatabaseConfig>("/tmp/dir-storing-kuzu-db-files/");
  auto database = make_unique<Database>(*databaseConfig, *systemConfig);
  auto conn = make_unique<Connection>(database.get());
  conn->beginWriteTransaction();
  auto result = conn->query("CREATE (a:User {name: 5, age: 72})");
  if (!result->isSuccess()) {
     throw RuntimeException("CREATE command failed.");
  }
  result = conn->query("MATCH (a:User) RETURN *");
  while (result->hasNext()) 
    auto tuple = result->getNext();
    // some code to print the tuple;
  }
  conn->commit();
```
The above code starts a manual writeTransaction, adds a new node, and within the same transaction
also reads all of the tuples in User table (which includes the (5, 72) node record). Finally, the 
transaction commits.

You can also start a read-only transaction. For example in the C++ client API, this can be done
by calling `conn->beginReadOnlyTransaction()`. Read only transactions are not allowed to write to the database. 
You should start a read-only transaction for two main reasons: (i) if you want to run multiple read queries
ensuring that the database does not change in-between those transactions; and/or (ii) you don't want
to block a write transaction from writing to the database in parallel (recall that at any point in
time Kùzu allows 1 write transaction in the system).

If you call `conn->rollback()` instead of `conn->commit()`, the added (5, 72) node record will not
persist in the database.

# Auto-Committing:
If you send a command without manually beginning a transaction and it will automatically
be wrapped around a transaction. For example, the following `CREATE` command will be
automatically wrapped around a transaction that will be executed in a serializable manner.
```
  // Construct the Database object as above 
  auto conn = make_unique<Connection>(database.get());
  auto result = conn->query("CREATE (a:User {name: 5, age: 72})");
```
Note: All queries/commands sent from [CLI](cli.md) and [Python API](python-api) are in auto-commit mode.
You do not have to commit at the end of auto-committed transactions (and you cannot rollback).

[^1]: We will be addressing these limitations soon.
