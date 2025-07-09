---
title: Attach/Detach to External Databases
---
Using the `ATTACH` statement, you can connect to external Kuzu databases as well as several relational DBMSs.
These directories or files of external databases can be either local or in a remote file system.

## Local Kuzu databases

Suppose you are using the Kuzu CLI and have opened a database under local directory `/uw`. In the middle of this
session, you want to query another local Kuzu database, say `/work`, which has a `Manager` node table you want to query.
You can attach to the `/work` database and query the `Manager` nodes in it and then detach:

```cypher
ATTACH '/work' AS work (dbtype kuzu);
MATCH (a:Manager) RETURN *;
DETACH work;
```

## External databases

Attaching external databases requires installing an extension.
- For attaching Kuzu databases, see the documentation [here](/extensions/attach/kuzu)
- For attaching relational databases, see the documentation [here](/extensions/attach/rdbms)
