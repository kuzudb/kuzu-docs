---
title: Ignoring Erroneous Rows
---

By default, your `COPY FROM` and `LOAD FROM` clauses will fail if there are any erroneous rows
in your input file. You can instead skip these rows by setting the `IGNORE_ERRORS` parameter to `true`.

When `IGNORE_ERRORS` is set to `true`, Kùzu will skip any rows that have errors and continue loading the rest of the rows.
This has some performance costs, so if you think your input files are clean, we recommend keeping `IGNORE_ERRORS` as `false`.

Here is an example of using `IGNORE_ERRORS` when [reading from a CSV file](/import/csv). This feature will work similarly when copying from other file sources (such as [JSON](/import/copy-from-json)) although the set of skippable errors may be different.

Consider the following `User` table:

```cypher
CREATE NODE TABLE User (name String, age INT32, PRIMARY KEY (name));
```

Let the CSV file `user.csv` contain the following rows:
```csv
Alice,4
Bob,2147483650
```
Note that `2147483650` does not fit into an INT32 and will cause an error.
The following statement will load only the first row of `user.csv` into `User` table, skipping the malformed second row.

```cypher
COPY User FROM "user.csv" (header=false, ignore_errors=true);
```

To check that only one `User` node has been inserted, we can run the following query:
```cypher
MATCH (a:User) RETURN count(*)
```
Output:
```
┌──────────┬
│ count(*) │
│ UINT64   │
├──────────┼
│ 1        │
└──────────┴
```

### Warnings Table: Inspecting skipped rows
Information about malformed lines are kept in a system-level Warnings table.
Warnings table is a connection-level table that accumulates warnings that are generated during COPY statements during the
lifetime of a database connection. You can inspect the contents of this table, e.g., to see the warnings
about the malformed rows, or clear this table.

For example, to see the warning messages generated about the malformed line in our `user.csv` import above,
you can run the [`SHOW_WARNINGS`](/cypher/query-clauses/call#show_warnings) function after the `COPY FROM` statement:

```cypher
CALL show_warnings() RETURN *;
```

Output:
```
┌──────────┬─────────────────────────────────────────────────────────────────────────────┬───────────┬─────────────┬────────────────────────┐
│ query_id │ message                                                                     │ file_path │ line_number │ skipped_line_or_record │
│ UINT64   │ STRING                                                                      │ STRING    │ UINT64      │ STRING                 │
├──────────┼─────────────────────────────────────────────────────────────────────────────┼───────────┼─────────────┼────────────────────────┤
│ 1        │ Conversion exception: Cast failed. Could not convert "2147483650" to INT32. │ user.csv  │ 2           │ Bob,2147483650         │
└──────────┴─────────────────────────────────────────────────────────────────────────────┴───────────┴─────────────┴────────────────────────┘
```

At any point in time you can also call the [`CLEAR_WARNINGS`](/cypher/query-clauses/call#clear_warnings) function to clear the Warnings table.

```cypher
CALL clear_warnings();
```

After clearing the warnings, the Warnings table will be empty.

```cypher
CALL show_warnings() RETURN *;
```

Output:
```
┌──────────┬─────────┬───────────┬─────────────┬────────────────────────┐
│ query_id │ message │ file_path │ line_number │ skipped_line_or_record │
│ UINT64   │ STRING  │ STRING    │ UINT64      │ STRING                 │
├──────────┼─────────┼───────────┼─────────────┼────────────────────────┤
└──────────┴─────────┴───────────┴─────────────┴────────────────────────┘
```

By default, Kùzu stores a limited number of warnings per connection, determined by the `warning_limit` connection configuration parameter.
You can change this configuration as follows (see the [Connection Configuration](/cypher/configuration#connection-configuration) section for more details):
```cypher
CALL warning_limit=1024;
```
