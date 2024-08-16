---
title: Import data from CSV files
---

You can bulk import data to node and relationship tables from CSV files
using the `COPY FROM` command. It is **highly recommended** to use `COPY FROM` if you are creating large
databases. You can use `COPY FROM` to import data into an empty table or to append data to an existing table.

The CSV import configuration can be manually set by specifying the parameters inside `( )` at the
end of the the `COPY FROM` clause. The following table shows the configuration parameters supported:

| Parameter | Description | Default Value |
|:-----|:-----|:-----|
| `HEADER` | Whether the first line of the CSV file is the header. Can be true or false. | false |
| `DELIM` | Character that separates different columns in a lines. | `,`|
| `LIST_DELIM` | Character that separates different elements in a list, struct, or map. | `,` |
| `UNBRACED` | Whether list columns are expected to start with `[` and end with `]`. If `true`, braced lists can still be read to allow for nested list scanning | `false` |
| `QUOTE` | Character to start a string quote. | `"` |
| `ESCAPE` | Character within string quotes to escape QUOTE and other characters, e.g., a line break. <br/> See the important note below about line breaks lines below.| `\` |
| `SKIP` | Number of rows to skip from the input file | `0` |
| `PARALLEL` | Read csv files in parallel or not | `true` |
| `SAMPLE_SIZE` | Number of rows to sample to determine column datatypes. If set to zero, all columns are assumed to be `STRING`. | `2048` |

The example below specifies that the CSV delimiter is`|` and also that the header row exists.

```cypher
COPY User FROM "user.csv" (HEADER=true, DELIM="|");
```

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
