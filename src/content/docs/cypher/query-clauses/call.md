---
title: Call
description: The CALL clause is used for executing schema functions.
---

The `CALL` clause is used for executing schema functions.

Note that the `CALL` clause defined here is different from the standalone [`CALL`](/cypher/configuration) **statement** used for changing
the database configuration. This way of using `CALL` must be followed
by other query clauses, such as `RETURN` or `YIELD`.

The following sections list the built-in functions you can use with the `CALL` clause.

## Functions

The following schema is used in the examples below:

<!-- auto-check id=call-1 -->
```cypher
CREATE NODE TABLE User(name STRING PRIMARY KEY, age INT64);
CREATE NODE TABLE City(name STRING PRIMARY KEY, population INT64 DEFAULT 0);
CREATE REL TABLE Follows(FROM User TO User, since INT64);
CREATE REL TABLE LivesIn(FROM User TO City);
```

### `CURRENT_SETTING`

Returns the value of the given database configuration.

Example:

<!-- auto-check id=call-2 -->
```cypher
CALL current_setting('threads') RETURN *;
```
```
┌─────────┐
│ threads │
│ STRING  │
├─────────┤
│ 12      │
└─────────┘
```

### `DB_VERSION`

Returns the current database version.

Returned columns:

- `version`: the current database version
    - type: `STRING`

Example:

<!-- auto-check id=call-3 -->
```cypher
CALL db_version() RETURN *;
```
```
┌──────────┐
│ version  │
│ STRING   │
├──────────┤
│ 0.11.0   │
└──────────┘
```

### `SHOW_TABLES`

Returns information about all tables in the database.

Returned columns:

- `id`: the id of the table
    - type: `UINT64`
- `name`: the name of the table
    - type: `STRING`
- `type`: the type of the table
    - type: `STRING`
- `comment`: the comment of the table
    - type: `STRING`

Example:

<!-- auto-check id=call-4 -->
```cypher
CALL show_tables() RETURN *;
```
```
┌────────┬─────────┬────────┬───────────────┬─────────┐
│ id     │ name    │ type   │ database name │ comment │
│ UINT64 │ STRING  │ STRING │ STRING        │ STRING  │
├────────┼─────────┼────────┼───────────────┼─────────┤
│ 0      │ User    │ NODE   │ local(kuzu)   │         │
│ 3      │ Follows │ REL    │ local(kuzu)   │         │
│ 1      │ City    │ NODE   │ local(kuzu)   │         │
│ 5      │ LivesIn │ REL    │ local(kuzu)   │         │
└────────┴─────────┴────────┴───────────────┴─────────┘
```

### `TABLE_INFO`

Returns the metadata information of a given table.

Returned columns:

- `property id`: the internal identifier of the property within the table
    - type: `INT32`
- `name`: the name of the property
    - type: `STRING`
- `type`: the data type of the property
    - type: `STRING`
- `default expression`: the default value of the property when none is specified
    - type: `STRING`
- `primary key`: whether the property is a primary key
    - type: `BOOL`

Example:

<!-- auto-check id=call-5 -->
```cypher
CALL TABLE_INFO('City') RETURN *;
```
```
┌─────────────┬────────────┬────────┬────────────────────┬─────────────┐
│ property id │ name       │ type   │ default expression │ primary key │
│ INT32       │ STRING     │ STRING │ STRING             │ BOOL        │
├─────────────┼────────────┼────────┼────────────────────┼─────────────┤
│ 0           │ name       │ STRING │ NULL               │ True        │
│ 1           │ population │ INT64  │ 0                  │ False       │
└─────────────┴────────────┴────────┴────────────────────┴─────────────┘
```

### `SHOW_CONNECTION`

Returns the source and destination nodes for a given relationship.

Returned columns:

- `source table name`: the name of the source node table
    - type: `STRING`
- `destination table name`: the name of the destination node table
    - type: `STRING`
- `source table primary key`: the primary key of the source node table
    - type: `STRING`
- `destination table primary key`: the primary key of the destination node table
    - type: `STRING`

Example:

<!-- auto-check id=call-6 -->
```cypher
CALL SHOW_CONNECTION('LivesIn') RETURN *;
```
```
┌───────────────────┬────────────────────────┬──────────────────────────┬───────────────────────────────┐
│ source table name │ destination table name │ source table primary key │ destination table primary key │
│ STRING            │ STRING                 │ STRING                   │ STRING                        │
├───────────────────┼────────────────────────┼──────────────────────────┼───────────────────────────────┤
│ User              │ City                   │ name                     │ name                          │
└───────────────────┴────────────────────────┴──────────────────────────┴───────────────────────────────┘
```

### `SHOW_ATTACHED_DATABASES`

Returns the name and database type of all attached databases.

Returned columns:

- `name`: the name of the attached database
    - type: `STRING`
- `database type`: the type of the attached database
    - type: `STRING`

Example:

<!-- auto-check id=call-7 check_only -->
```cypher
CALL SHOW_ATTACHED_DATABASES() RETURN *;
```
```
┌─────────────┬────────────────┐
│ name        │ database type  │
│ STRING      │ STRING         │
├─────────────┼────────────────┤
│ tinysnb     │ DUCKDB         │
│ anotherdb   │ POSTGRES       │
└─────────────┴────────────────┘
```

### `SHOW_WARNINGS`

Returns the contents of the [warnings table](/import#warnings-table-inspecting-skipped-rows).

This is a feature related to [ignoring errors](/import#ignore-erroneous-rows) when running `COPY`/`LOAD FROM` statements to scan files. 
They will only be reported if the [`IGNORE_ERRORS`](/import#ignore-erroneous-rows) setting is enabled. 

Note that the number of warnings that are stored is limited by the [`warning_limit` parameter](/cypher/configuration#configure-warning-limit).
After the `warning_limit` is reached, any new warnings generated will not be stored.

Returned columns:

- `query_id`: the query that triggered the warning
    - type: `UINT64`
- `message`: a description of what triggered the warning
    - type: `STRING`
- `file_path`: the path to the file that triggered the warning
    - type: `STRING`
- `line_number`: the line number in the file that triggered the warning
    - type: `UINT64`
- `skipped_line_or_record`: the line (e.g. for CSV files) or record (e.g. for JSON files) containing the actual value that triggered the warning
    - type: `STRING`

Example:

<!-- auto-check id=call-8 check_only -->
```cypher
CALL SHOW_WARNINGS() RETURN *;
```
```
┌──────────┬─────────────────────────────────────────────────────────────────────────────┬─────────────┬─────────────┬────────────────────────┐
│ query_id │ message                                                                     │ file_path   │ line_number │ skipped_line_or_record │
│ UINT64   │ STRING                                                                      │ STRING      │ UINT64      │ STRING                 │
├──────────┼─────────────────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼────────────────────────┤
│ 1        │ Conversion exception: Cast failed. Could not convert "2147483650" to INT32. │ vPerson.csv │ 2           │ 2,2147483650           │
└──────────┴─────────────────────────────────────────────────────────────────────────────┴─────────────┴─────────────┴────────────────────────┘
```

### `CLEAR_WARNINGS`

Clears the contents of the [warnings table](/import#warnings-table-inspecting-skipped-rows).
This function has no output.

<!-- auto-check id=call-9 -->
```cypher
CALL clear_warnings();
```

### `SHOW_OFFICIAL_EXTENSIONS`

Returns a list of all official [extensions](/extensions) available in Kuzu.

Returned columns:

- `name`: the name of the extension
    - type: `STRING`
- `description`: the description of the extension
    - type: `STRING`

Example:

<!-- auto-check id=call-10 -->
```cypher
CALL SHOW_OFFICIAL_EXTENSIONS() RETURN *;
```
```
┌───────────────┬─────────────────────────────────────────────────────────────────────────┐
│ name          │ description                                                             │
│ STRING        │ STRING                                                                  │
├───────────────┼─────────────────────────────────────────────────────────────────────────┤
│ ALGO          │ Adds support for graph algorithms                                       │
│ AZURE         │ Adds support for reading from azure blob storage                        │
│ DELTA         │ Adds support for reading from delta tables                              │
│ DUCKDB        │ Adds support for reading from duckdb tables                             │
│ FTS           │ Adds support for full-text search indexes                               │
│ HTTPFS        │ Adds support for reading and writing files over a HTTP(S)/S3 filesystem │
│ ICEBERG       │ Adds support for reading from iceberg tables                            │
│ JSON          │ Adds support for JSON operations                                        │
│ LLM           │ Adds support for LLM operations                                         │
│ NEO4J         │ Adds support for migrating nodes and rels from neo4j to kuzu            │
│ POSTGRES      │ Adds support for reading from POSTGRES tables                           │
│ SQLITE        │ Adds support for reading from SQLITE tables                             │
│ UNITY_CATALOG │ Adds support for scanning delta tables registered in unity catalog      │
└───────────────┴─────────────────────────────────────────────────────────────────────────┘
```

### `SHOW_LOADED_EXTENSIONS`

Returns information about the currently loaded extensions in Kuzu.

Returned columns:

- `extension name`: the name of the extension
    - type: `STRING`
- `extension source`: whether the extension is officially supported by the Kuzu team or is developed by a third-party
    - type: `STRING`
- `extension path`: the path to the extension
    - type: `STRING`

Example:

<!-- auto-check id=call-11 check_only -->
```cypher
CALL SHOW_LOADED_EXTENSIONS() RETURN *;
```
```
┌────────────────┬──────────────────┬─────────────────────────────────────────────────────────────────────────────┐
│ extension name │ extension source │ extension path                                                              │
│ STRING         │ STRING           │ STRING                                                                      │
├────────────────┼──────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ ALGO           │ USER             │ extension/algo/build/libalgo.kuzu_extension                                 │
│ NEO4J          │ OFFICIAL         │ /home/user/.kuzu/extension/0.11.0/linux_arm64/neo4j/libneo4j.kuzu_extension │
└────────────────┴──────────────────┴─────────────────────────────────────────────────────────────────────────────┘
```

### `SHOW_INDEXES`

Returns information about the indexes built in Kuzu.

Returned columns:

- `table name`: the table which the index is built on
    - type: `STRING`
- `index name`: the name of the index
    - type: `STRING`
- `index type`: the type of the index (e.g. FTS, HNSW)
    - type: `STRING`
- `property names`: the properties which the index is built on
    - type: `STRING[]`
- `extension loaded`: whether the depended extension has been loaded
    - type: `BOOL`
- `index definition`: the cypher query to create the index
    - type: `STRING`

Note: Some indexes are implemented within extensions. If a required extension is not loaded, the extension loaded field will display false, and the index definition field will be null.

Example:

<!-- auto-check id=call-12 -->
```cypher
CALL SHOW_INDEXES() RETURN *;
```
```
┌────────────┬───────────────────┬────────────┬───────────────────┬──────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ table name │ index name        │ index type │ property names    │ extension loaded │ index definition                                                                                                                                             │
│ STRING     │ STRING            │ STRING     │ STRING[]          │ BOOL             │ STRING                                                                                                                                                       │
├────────────┼───────────────────┼────────────┼───────────────────┼──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Book       │ book_fts_index    │ FTS        │ [title]           │ True             │ CALL CREATE_FTS_INDEX('Book', 'book_fts_index', ['title'], stemmer := 'porter', stopWords := 'default');                                                     │
│ Book       │ book_vector_index │ HNSW       │ [title_embedding] │ True             │ CALL CREATE_VECTOR_INDEX('Book', 'book_vector_index', 'title_embedding', mu := 30, ml := 60, pu := 0.050000, metric := 'l2', alpha := 1.100000, efc := 200); │
└────────────┴───────────────────┴────────────┴───────────────────┴──────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### `SHOW_PROJECTED_GRAPHS`

Returns a list of all current projected graphs in the database.

Returned columns:

- `name`: the name of the projected graph
    - type: `STRING`
- `type`: the type of the projected graph
    - type: `STRING`

Example:

<!-- auto-check id=call-15 -->
```cypher
CALL SHOW_PROJECTED_GRAPHS() RETURN *;
```
```
┌────────────────┬────────┐
│ name           │ type   │
│ STRING         │ STRING │
├────────────────┼────────┤
│ student        │ CYPHER │
│ social-network │ NATIVE │
└────────────────┴────────┘
```

### `PROJECTED_GRAPH_INFO`

Returns detailed information about a given projected graph.

There are two types of projected graphs:

#### Native projected graph

Returned columns:

- `table type`: the type of the table (NODE/REL)
    - type: `STRING`
- `table name`: the name of the table
    - type: `STRING`
- `predicate`: the predicates defined on the table
    - type: `STRING`

Example:

<!-- auto-check id=call-13 -->
```cypher
CALL PROJECTED_GRAPH_INFO('student-social-network') RETURN *;
```
```
┌────────────┬────────────┬────────────────┐
│ table type │ table name │ predicate      │
│ STRING     │ STRING     │ STRING         │
├────────────┼────────────┼────────────────┤
│ NODE       │ person     │ n.age < 18     │
│ REL        │ knows      │ r.since > 1997 │
└────────────┴────────────┴────────────────┘
```

#### Cypher projected graph

Returned columns:
- `cypher statement`: the cypher statement used to create the projected graph
    - type: `STRING`

Example:

<!-- auto-check id=call-14 -->
```cypher
CALL PROJECTED_GRAPH_INFO('student') RETURN *;
```
```
┌─────────────────────────────────────┐
│ cypher statement                    │
│ STRING                              │
├─────────────────────────────────────┤
│ MATCH (n) WHERE n.age < 18 RETURN n │
└─────────────────────────────────────┘
```

## Yielding columns

You can use the `YIELD` clause to rename the return columns of a `CALL` function to avoid naming conflicts and improve readability.

```cypher
CALL <FUNC>()
YIELD <COLUMN0> AS <ALIAS0>, <COLUMN1> AS <ALIAS1>
RETURN <ALIAS0>, <ALIAS1>
```

For example, to rename an output column name from `threads` to `threads_count`:

<!-- auto-check id=call-16 -->
```cypher
CALL CURRENT_SETTING('threads')
YIELD threads as threads_count
RETURN *;
```
```
┌───────────────┐
│ threads_count │
│ STRING        │
├───────────────┤
│ 12            │
└───────────────┘
```

#### All columns must appear in the `YIELD` clause

If the `YIELD` clause is used after a `CALL` function, **all** return columns of the function must appear in the `YIELD` clause. Using `YIELD *` is not allowed in Kuzu.

<!-- auto-check id=call-17 -->
```cypher
CALL TABLE_INFO('User')
YIELD `property id` as user_id
RETURN user_id;
```
```
Error: Binder exception: Output variables must all appear in the yield clause.
```

#### Column names must match the original names

The column names to yield must match the original return column names of the function.

For example, the following query throws an exception since the column name to yield is `thread` which doesn't match the return column name(`threads`) of the function:

<!-- auto-check id=call-18 -->
```cypher
CALL CURRENT_SETTING('threads')
YIELD thread as threads_count
RETURN *;
```
```
Error: Binder exception: Unknown table function output variable name: thread.
```
