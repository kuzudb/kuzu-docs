---
title: Command Line
sidebar_position: 0
---

The Kùzu Command Line Interface (CLI) is a unified, dependency-free executable, precompiled for Mac, Linux and Windows systems.
The CLI can be downloaded [here](https://github.com/kuzudb/kuzu/releases/latest) (search for `Assets` on the page and download the correct `kuzu_cli-xxx.zip` file for your platform).
After the CLI is downloaded and extracted into a directory, you can navigate the directory via your terminal, and set the execute permissions with `chmod +x kuzu`. 
You are now ready to run the executable using `./kuzu <db_path>`, where `<db_path>` is the directory for the database files. This path can either point to an existing database or a yet-to-be-created directory, in which case Kùzu will automatically create the directory and initialize an empty database for you.
If you input `test` as your `<db_path>`, you should see the following prompt:

```
./kuzu_shell ./test
kuzu> 
```

Upon launching the CLI, you can enter a Cypher query and press enter to execute it. The instructions below outline how to load nodes and rels from CSV files and how to run a Cypher query:
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

- Load data (be sure to replace `"user.csv"` with the full path to your csv file and use quotation marks around the path):

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
