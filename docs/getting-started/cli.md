---
title: Command Line
sidebar_position: 1
---

Kùzu CLI (Command Line Interface) is a single, dependency free executable. It is precompiled for Mac, Linux and Windows. The CLI can be downloaded [here](https://github.com/kuzudb/kuzu/releases/latest). After the CLI is downloaded and extracted into a directory, you can navigate the directory from your terminal, and set the execute permissions with `chmod +x kuzu`. Then you can run the executable with `./kuzu <db_path>` where `<db_path>` is the directory for the database files. This path can point to an existing database or to a directory that does not yet exist and Kùzu will create the directory and initialize an empty database for you. You will see a prompt as below if you pass `test` as you `<db_path>`:

```
./kuzu_shell ./test
kuzu> 
```

Once the CLI has opened, enter a Cypher query then hit the enter key to execute it. Instructions of how to load nodes and rels from CSV files 
and run a Cypher query is shown below:
- Create the schema:

```
kuzu> CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name));

-------------------------------------
| NodeTable: User has been created. |
-------------------------------------

kuzu> CREATE REL TABLE Follows(FROM User TO User, since INT64);

---------------------------------------
| RelTable: Follows has been created. |
---------------------------------------
```

- Load data (replace `"user.csv"` with the full path to your csv and use quotation marks around the path):

```
kuzu> COPY User FROM "user.csv";

---------------------------------------------------------
| 4 number of nodes has been copied to nodeTable: User. |
---------------------------------------------------------

kuzu> COPY Follows FROM "follows.csv";

----------------------------------------------------------
| 4 number of rels has been copied to relTable: Follows. |
----------------------------------------------------------
```

- Execute a simple query:

```
kuzu> MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, b.name, f.since;
>> Number of output tuples: 4

-------------------------------
| a.name  | b.name  | f.since |
-------------------------------
| Adam    | Karissa | 2020    |
-------------------------------
| Adam    | Zhang   | 2020    |
-------------------------------
| Karissa | Zhang   | 2021    |
-------------------------------
| Zhang   | Noura   | 2022    |
-------------------------------
```
