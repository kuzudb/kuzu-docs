---
title: Command Line
sidebar_position: 0
description: Through the CLI, you can issue Cypher queries or call shell commands.
---

# Kùzu CLI

Kùzu provides a command line interface (CLI) through which you can issue Cypher queries or call shell
commands. See the [getting started page](../getting-started/cli.md) for instructions on how
to install the CLI and its basic usage.

## Start the shell

Navigate to the directory where the Kùzu CLI is located and run the following command:

```bash
./kuzu <db_path>
```

Where `<db_path>` is the directory for the database files. 
This path can point to an existing database or a yet-to-be-created directory, in which case
Kùzu will automatically create the directory and initialize an empty database for you.

You can view the additional shell startup flags by running `./kuzu -h`.

```bash
$ ./kuzu -h
help
  ./kuzu databasePath {OPTIONS}
    KuzuDB Shell

  OPTIONS:

      databasePath                      Database path.
      -h, --help                        Display this help menu
      -d, --defaultBPSize               Size of buffer pool for default and
                                        large page sizes in megabytes
      --nocompression                   Disable compression
      -r, --readOnly                    Open database at read-only mode.
      -p                                Path to directory for shell history
      -v, --version                     Display current database version
      "--" can be used to terminate flag options and force all following
      arguments to be treated as positional options
```

## Shell commands

Once you start the shell, you can issue Cypher queries as shown [here](../getting-started/cli.md#execute-cypher-query), or call
any of the shell commands listed below.

### `:help`
Show built-in command list within the Kùzu shell.

```
kuzu> :help
    :help     get command list
    :clear     clear shell
    :quit     exit from shell
    :thread [num_threads]     set number of threads for query execution
    :logging_level [logging_level]     set logging level of database, available options: debug, info, err
    :timeout [query_timeout]     set query timeout in ms
    :maxrows [max_rows]     set maximum number of rows for display (default: 20)
    :maxwidth [max_width]     set maximum width in characters for display
```

### `:clear`
Clear shell. Alternatively, you can use `Ctrl + L` to clear the shell.

### `:quit`
Exit from shell. Alternatively, you can use `Ctrl + D` to exit the shell.

### `:thread [num_threads]`
Set maximum number of threads to execute query in current connection.

### `:logging_level [logging_level]`
Set logging level, available options: debug, info, err

### `:timeout [query_timeout]`
Set query timeout in ms.

### `:max_rows [max_rows]`
Set maximum number of rows for display. 0 defaults to 20.

### `:max_width [max_width]`
Set maximum width in characters for display. Defaults to terminal width if unable to display first and last columns. 

## Interrupt
To interrupt a running query, use `Ctrl + C` in CLI. Note: We currently don't support interrupting `COPY` statement.

## Non-interactive usage
To read and process a file in non-interactive mode, pipe the file content to the CLI.

```bash
./kuzu testdb < tinysnb/schema.cypher
---------------------------------------
| outputMsg                           |
---------------------------------------
| NodeTable: person has been created. |
```
