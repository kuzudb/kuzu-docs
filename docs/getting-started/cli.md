---
title: CLI
sidebar_position: 1
---

The Kùzu Command Line Interface (CLI) is a unified, dependency-free executable that has been
precompiled for Linux, MacOS, and Windows systems. If you're familiar with command line utilities and
want to begin using Kùzu with no dependencies, the CLI is the best place to start.

## Download

Follow these steps to use the CLI and get started with Kùzu:
1. [Download the latest version](https://kuzudb.com/#download) of the CLI by clicking on the link for your operating system.
2. Extract the `kuzu_cli-xxx.zip` file and give it executable permissions. For Linux/MacOS, you
can run the command shown below.

```bash
# Replace `xxx` with the zip version you downloaded. This will output a file named kuzu.
unzip kuzu_cli-xxx.zip
chmod +x kuzu
```

## Run

You are now ready to run the CLI using `./kuzu <db_path>`, where `<db_path>` is the directory for the database files. This path can point to an existing database or a yet-to-be-created one, in which case Kùzu will automatically initialize an empty database for you in the specified path.

```bash
# Create an empty database named my-kuzu-database in the current directory
./kuzu ./my-kuzu-database
kuzu>

# List available shell commands
kuzu> :help

# Quit shell
kuzu> :quit
```

:::info For Mac OS users
In MacOS, when you download the CLI and try to run it the first time, you'll likely see the following error message:

```
“kuzu” cannot be opened because it is from an unidentified developer.
macOS cannot verify that this app is free from malware.
```

To fix this, you need to give explicit permissions to MacOS to run the CLI binary.
Navigate to **System Settings > Privacy & Security**. Next, depending on your MacOS version, you have to either go 
to the **General** or the **Security** section and you will see a warning: `"kuzu" was blocked from use because it is not from an
identified developer`. Next to this warning will be an **Allow Anyway** button. Click this button to allow the CLI binary to run.
:::



Upon launching the CLI, you can enter a Cypher query and press enter to execute it. The instructions below outline how to load nodes and rels from CSV files and how to run a Cypher query:

## Create schema

```cypher
kuzu> CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name));

-------------------------------------
| NodeTable: User has been created. |
-------------------------------------

kuzu> CREATE REL TABLE Follows(FROM User TO User, since INT64);

---------------------------------------
| RelTable: Follows has been created. |
---------------------------------------
```

## Load data

Be sure enclose the path to your input file with quotation marks to avoid errors.

```bash
kuzu> COPY User FROM "user.csv";

---------------------------------------------------------
| 4 number of nodes has been copied to nodeTable: User. |
---------------------------------------------------------

kuzu> COPY Follows FROM "follows.csv";

----------------------------------------------------------
| 4 number of rels has been copied to relTable: Follows. |
----------------------------------------------------------
```

## Execute Cypher queries

Multi-line queries are allowed in the CLI shell. Kùzu will continue parsing the query until it
encounters the semicolon `;` that denotes the end of the query.

```cypher
kuzu> MATCH (a:User)-[f:Follows]->(b:User)
      RETURN a.name, b.name, f.since;
```

Executing the query returns a table of results in the shell that looks something like this:

```
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
