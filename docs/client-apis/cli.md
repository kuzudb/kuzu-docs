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
    - [`:logging_level [logging_level]`](#logging_level-logging_level)
    - [`:timeout`](#timeout)
    - [Interrupt](#interrupt)
    - [Non-interactive usage](#non-interactive-usage)
  
Please see the [getting started page](../getting-started/cli.md) for instructions on how
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
Clear shell. Alternatively, you can use `Ctrl + L` to clear the shell.

### `:quit`
Exit from shell. Alternatively, you can use `Ctrl + D` to exit the shell.

### `:thread [num_thread]`
Set maximum number of threads to execute query in current connection.

### `:logging_level [logging_level]`
Set logging level, available options: debug, info, err

### `:timeout`
Set query timeout in ms.

### Interrupt
To interrupt a running query, use `Ctrl + C` in CLI. Note: We currently don't support interrupting `COPY` statement.

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
