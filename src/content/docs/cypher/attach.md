---
title: Attach/Detach to External Databases
---
Using the `ATTACH` statement, you can connect to external Kùzu databases as well as several relational DBMSs.
These directories or files of these external databases can be both local or in a remote file system. Here is a simple
example. Suppose you are in the Kùzu CLI and have opened a database under local directory `/uw`. In the middle of this
session, you want to query another local Kùzu database, say `/work`, which suppose has some `Manager` node table.
You can attach to the `/work` database and query the `Manager` nodes in it and then detach as follows:

```
ATTACH '/work' AS work (dbtype kuzu);
MATCH (a:Manager) RETURN *;
DETACH work;
```
Except for attaching to local Kùzu databases, attaching to external databases requires installing an extension.
That is why we provide detailed documentation about attaching to external databases under the extensions section 
of the documentation:
- For attaching to Kùzu databases, see the documentation [here](/extensions/attach/kuzu)
- For attaching to relational databases, see the documentation [here](/extensions/attach/rdbms)
