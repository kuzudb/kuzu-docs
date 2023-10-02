---
title: Drop
sidebar_position: 2
description: Drop
---

# DROP TABLE
You can drop tables from the database with the `DROP TABLE` command.<br />

#### Notes
- To drop a node table X, you need to first drop all of the relationship tables 
     that refer to X in its FROM or TO first.
- You can drop any relationship table at any time.

E.g. consider a database defined as following.
```
CREATE NODE TABLE User(name STRING, age INT64, reg_date DATE, PRIMARY KEY (name));
CREATE REL TABLE Follows(FROM User TO User, since DATE);
```

Directly dropping User table will fail.
```
DROP TABLE User
Binder exception: Cannot delete a node table with edges. It is on the edges of rel: Follows.
```
But you can first delete Follows and the User as follows:
```
DROP TABLE Follows
---------------------------------------
| RelTable: Follows has been dropped. |
---------------------------------------
DROP TABLE User
-------------------------------------
| NodeTable: User has been dropped. |
-------------------------------------
```
