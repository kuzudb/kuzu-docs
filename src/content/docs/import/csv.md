---
title: Import data from CSV files
---

You can bulk import data to node and relationship tables from CSV files
using the `COPY FROM` command. It is **highly recommended** to use `COPY FROM` if you are creating large
databases. You can use `COPY FROM` to import data into an empty table or to append data to an existing table.

There are a set of CSV configurations you can set during `COPY FROM` (as well as `LOAD FROM`). We will cover
these parameters below in the [CSV Configurations](#csv-configurations) section. This page first covers
examples of loading into node and relationship tables. Please see the section about [Ignoring Erroneous Rows](#ignoring-erroneous-rows)
on how to skip erroneous CSV rows during the import.

:::caution[Guidelines]
- **Copy nodes before relationships:** In order to copy a relationship table `R` from a csv file `RFile`, the nodes that appear in `RFile` need to
  already exist in the database (either imported in bulk or inserted through Cypher data manipulation commands).
- **Wrap strings inside quotes:** Kùzu will accept strings in string columns both with and without quotes, though it's recommended to wrap strings in quotes to avoid any ambiguity with delimiters.
- **Avoid leading and trailing spaces**: As per the CSV standard, Kùzu does not ignore leading and trailing spaces (e.g., if you input `   213   ` for
  an integer value, that will be read as malformed integer and the corresponding node/rel property will be set to NULL.
  :::

## Import to node table

Create a node table `User` as follows:

```cypher
CREATE NODE TABLE User(name STRING, age INT64, reg_date DATE, PRIMARY KEY (name))
```

The CSV file `user.csv` contains the following fields:
```csv
name,age,reg_date
Adam,30,2020-06-22
Karissa,40,2019-05-12
...
```

The following statement will load `user.csv` into User table.

```cypher
COPY User FROM "user.csv" (header=true);
```

## Import to relationship table

When loading into a relationship table, Kùzu assumes the first two columns in the file are:

- `FROM` Node Column: The primary key of the `FROM` nodes.
- `TO` Node Column: The primary key of the `TO` nodes.

The rest of the columns correspond to relationship properties.

Create a relationship table `Follows` using the following Cypher query:

```cypher
CREATE REL TABLE Follows(FROM User TO User, since DATE)
```

This reads data from the below CSV file `follows.csv`:
```csv
Adam,Karissa,2010-01-30
Karissa,Michelle,2014-01-30
...
```

The following statement loads the `follows.csv` file into a `Follows` table.

```cypher
COPY Follows FROM "follows.csv";
```

Note that the header wasn't present in the CSV file, hence the `header` parameter is not set.

To skip the first 3 lines of the CSV file, you can use the `SKIP` parameter as follows:

```cypher
COPY Follows FROM "follows.csv" (SKIP=3);
```

## Import multiple files to a single table

It is common practice to divide a large CSV file into several smaller files for cleaner data management.
Kùzu can read multiple files with the same structure, consolidating their data into a single node or relationship table.
You can specify that multiple files are loaded in the following ways:

### Glob pattern

This is similar to the Unix [glob](https://man7.org/linux/man-pages/man7/glob.7.html) pattern, where you specify
file paths that match a given pattern. The following wildcard characters are supported:

| Wildcard | Description |
| :-----------: | ----------- |
| `*` | match any number of any characters (including none) |
| `?` | match any single character |
| `[abc]` | match any one of the characters enclosed within the brackets |
| `[a-z]` | match any one of the characters within the range |

```cypher
COPY User FROM "User*.csv"
```

### List of files

Alternatively, you can just specify a list of files to be loaded.

```cypher
COPY User FROM ["User0.csv", "User0.csv", "User2.csv"]
```

## CSV Configurations
There are a set of configurations that can be set when importing CSV files, such as
whether the CSV file has a header that should be skipped during loading or what the delimiter character
between the columns of the CSV is. See below for the list of all supported configurations. These
configurations can be manually set by specifying parameters inside `( )` at the
end of the `COPY FROM` clause. Several of the supported configurations, such as the header and delimiter characters,
are automatically detected if they are not manually specified at the end of  `COPY FROM` clause.
See the [Auto Detecting Configurations](#auto-detecting-configurations) section for more details
how Kùzu automatically detects these configurations.

The following table shows the configuration parameters supported:

| Parameter              | Description                                                                                                                                                                                                                                                                                                                                          | Default Value |
|:-----------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------|
| `HEADER`               | Whether the first line of the CSV file is the header. Can be true or false.                                                                                                                                                                                                                                                                          | false         |
|  <span style="text-wrap: nowrap;"> `DELIM` or `DELIMITER` </span> | Character that separates different columns in a lines.                                                                                                                                                                                                                                                                                               | `,`           |
| `QUOTE`                | Character to start a string quote.                                                                                                                                                                                                                                                                                                                   | `"`           |
| `ESCAPE`               | Character within string quotes to escape QUOTE and other characters, e.g., a line break. <br/> See the important note below about line breaks lines below.                                                                                                                                                                                           | `\`           |
| `SKIP`                 | Number of rows to skip from the input file                                                                                                                                                                                                                                                                                                           | `0`           |
| `PARALLEL`             | Read CSV files in parallel or not                                                                                                                                                                                                                                                                                                                    | `true`        |
| `IGNORE_ERRORS`        | Skips malformed rows in CSV files if set to true. Use [`SHOW_WARNINGS`](/cypher/query-clauses/call#show_warnings) function to view information about malformed rows. Also see [`CLEAR_WARNINGS`](/cypher/query-clauses/call#clear_warnings) function. See more on [Warnings table](#warnings-table-inspecting-skipped-rows) to inspect skipped rows. | `false`       |
| `auto_detect`          | Turn ON/OFF the auto detection of configurations (more details below)                                                                                                                                                                                                                                                                                | `true`        |
| `sample_size`          | The number of sample CSV lines to use when auto detecting CSV configurations (more details below)                                                                                                                                                                                                                                                    | 256          |

For example, the query below specifies that the CSV delimiter is `|` and also that the header row exists.

```cypher
COPY User FROM "user.csv" (HEADER=true, DELIM="|");
```

**Note on Boolean options:** Any option that is a `Boolean` can be enabled or disabled in multiple ways. You can write `true`, or `1` to enable the option (e.g., `(HEADER=true)` or `(HEADER=1)`) , and `false` or `0` to disable it (e.g., `(HEADER=false)` or `(HEADER=0)`).
The `Boolean` value can also be omitted (e.g., by only passing `(HEADER)`), in which case `true` is assumed.
Finally, the assignment operator `=` can also be omitted and replaced with space (e.g., `(HEADER true)` is equivalent to `(HEADER=true)`).



### Auto Detecting Configurations
If any of the following configuration options are not manually specified at the end of the `COPY FROM` statement,
by default Kùzu will try to automatically detect them:
- HEADER
- DELIM
- QUOTE
- ESCAPE

If you specify a subset of these manually but not the others, then only those that have not been specified will be automatically detected.
You can turn off auto-detection by setting `(auto_detect=false)` as a parameter, in which case Kùzu will default to using the default values
for any of the unspecified configurations. For example, consider the example from above again:
```cypher
COPY User FROM "user.csv" (HEADER=true, DELIM="|");
```
In this case (which is equivalent to `COPY User FROM "user.csv" (HEADER=true, DELIM="|", auto_detect=true)`),
Kùzu will try to automatically detect the `QUOTE` and `ESCAPE` characters.
It will not try to automatically detect if the first line is a header line or the `DELIM` character,
since those configurations are manually specified in the query.
If instead the query was:
```cypher
COPY User FROM "user.csv" (HEADER=true, DELIM="|", auto_detect=false);
```
Then, Kùzu will use the default values of `QUOTE` and `ESCAPE`, which are `"` and `\` respectively (and use
the manually specified configurations for `HEADER` and `DELIM`).

**sample_size**: By default, Kùzu will use the first 256 lines of the CSV file to auto-detect unspecified configurations.
If you want to use a different number of lines, you can specify the `sample_size` parameter.

For interested users, below are more details of how Kùzu automatically tries to detect these configurations.

**HEADER auto detection** parses the first line of the CSV into columns and
checks if each column can be cast to the data type of the target column in the node or rel table that is being copied into.
If so, the line is assumed to be a valid "data" line and inserted as a record into the target table. Otherwise, it is assumed to be
a header line and skipped.

**DELIM, QUOTE, ESCAPE auto detection**
Kùzu uses the `sample_size` many lines to auto detect any configuration that has not been manually specified.
The possible configurations for different configurations are:
- DELIM: `,`, `|`, `;`, `\t`.
- QUOTE: `"`, `'` and (no quote character)
- ESCAPE: `"`, `'`, '\' and (no escape character) (ensuring in any configuration QUOTE and ESCAPE are different characters or are  "no quote" and "no escape" characters)

For the unspecified configurations, Kùzu considers parsing the samples lines it scans (see the `sample_size` parameter)
for each possible configuration combination and then picks the configuration combination that successfully parses the most lines.

## Ignoring Erroneous Rows

By default, your `COPY FROM` and `LOAD FROM` clauses will fail if there is an erroneous rows 
in your CSV file. You can instead skip these rows by setting the `IGNORE_ERRORS` parameter to `true`.
When `IGNORE_ERRORS` is set to `true`, Kùzu will skip any rows that have errors and continue loading the rest of the rows.
This has some performance costs, so if you think your CSV files are clean, we recommend keeping `IGNORE_ERRORS` as `false`.

Here is an example. Consider the simplified version of the `User` table from above:

```cypher
CREATE NODE TABLE User (name String, age INT32, PRIMARY KEY (ID));
```

Let the CSV file `user.csv` contain the following rows:
```csv
0,4
2,2147483650
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

For example, to see the warning messages generated about the malformed line in our 'user.csv' import above,
you can run the [`SHOW_WARNINGS`](/cypher/query-clauses/call#show_warnings) function after the `COPY FROM` statement:

```cypher
CALL show_warnings() RETURN *;
```

Output:
```
┌──────────┬─────────────────────────────────────────────────────────────────────────────┬─────────────┬─────────────┬────────────────────────┐
│ query_id │ message                                                                     │ file_path   │ line_number │ skipped_line_or_record │
│ UINT64   │ STRING                                                                      │ STRING      │ UINT64      │ STRING                 │
├──────────┼─────────────────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼────────────────────────┤
│ 1        │ Conversion exception: Cast failed. Could not convert "2147483650" to INT32. │ vPerson.csv │ 2           │ 2,2147483650           │
└──────────┴─────────────────────────────────────────────────────────────────────────────┴─────────────┴─────────────┴────────────────────────┘
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
┌──────────┬─────────────────────────────────────────────────────────────────────────────┬─────────────┬─────────────┬────────────────────────┐
│ query_id │ message                                                                     │ file_path   │ line_number │ skipped_line_or_record │
│ UINT64   │ STRING                                                                      │ STRING      │ UINT64      │ STRING                 │
└──────────┴─────────────────────────────────────────────────────────────────────────────┴─────────────┴─────────────┴────────────────────────┘
```

By default, Kùzu stores a limited number of warnings per connection, determined by the [`warning_limit`](/cypher/configuration#connection-configuration) connection configuration parameter.
You can change this configuration as follows (see the [Connection Configuration](/cypher/configuration#connection-configuration) section for more details):
```cypher
CALL warning_limit=1024;
```
