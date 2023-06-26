---
title: CLI
sidebar_position: 0
description: Through CLI, you can issue Cypher queries or call shell commands.
---

# Kùzu CLI

- [Kùzu CLI](#kùzu-cli)
    - [`:help`](#help)
    - [`:clear`](#clear)
    - [`:quit`](#quit)
    - [`:thread [num_thread]`](#thread-num_thread)
    - [`:loggin_level [logging_level]`](#loggin_level-logging_level)
    - [`:timeout`](#timeout)
    - [`:list_nodes`](#list_nodes)
    - [`:list_rels`](#list_rels)
    - [`:show_node [node_name]`](#show_node-node_name)
    - [`:show_rel [rel_name]`](#show_rel-rel_name)
    - [Interrupt](#interrupt)
    - [Non-interactive usage](#non-interactive-usage)
  
Please see the [getting started page](../getting-started/introduction-examples.md#cli) for instructions on how
to install Kùzu's command line interface and its basic usage. Through CLI, you can issue Cypher queries or call shell commands.

### `:help`
Show built-in command list.

```
kuzu> :help
    :help     get command list
    :clear     clear shell
    :quit     exit from shell
    :thread [num_threads]     set number of threads for query execution
    :logging_level [logging_level]     set logging level of database, available options: debug, info, err
    :timeout [query_timeout]     set query timeout in ms
    :list_nodes     list all node tables
    :list_rels     list all rel tables
    :show_node     [table_name] show node schema
    :show_rel     [table_name] show rel schema
```

### `:clear`
Clear shell.

### `:quit`
Exit from shell.

### `:thread [num_thread]`
Set maximum number of threads to execute query in current connection.

### `:loggin_level [logging_level]`
Set logging level, available options: debug, info, err

### `:timeout`
Set query timeout in ms.

### `:list_nodes`
List all node tables.

```
kuzu> :list_nodes
Node tables:
	City
	User
```

### `:list_rels`
List all rel tables.

```
kuzu> :list_rels
Rel tables:
	Follows
	LivesIn
```

### `:show_node [node_name]` 
Show node schema for [node_name]

```
kuzu> :show_node User
User properties:
	name STRING(PRIMARY KEY)
	age INT64
```

### `:show_rel [rel_name]` 
Show rel schema for [rel_name]

```
kuzu> :show_rel Follows
Follows src node: User
Follows dst node: User
Follows properties:
	since INT64
```
### Interrupt
To interrupt a running query, use `ctrl + C` in CLI. Note: currently we don't support interrupting `COPY` statement.

### Non-interactive usage
To read and process a file in non-interactive mode, pipe the file content to CLI.
```
./kuzu_shell testdb < tinysnb/schema.cypher
---------------------------------------
| outputMsg                           |
---------------------------------------
| NodeTable: person has been created. |
---------------------------------------

``` 
