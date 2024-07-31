---
title: JSON
---

## Usage

The `json` extension adds support for the `JSON` datatype, including a set of functions for JSON
access and manipulation, scanning from, and copying to JSON files.

You can install the JSON extension by running the following command:

```sql
INSTALL json;
LOAD EXTENSION json;
```

## JSON strings

A column can be declared to be JSON data in the exact same way that any other datatype is specified.
```sql
CREATE NODE TABLE Example (col0 INT64, col1 JSON, col2 JSON, PRIMARY KEY(col0));
```

Values can be inserted via the `CREATE` statement and passing in JSON documents as a JSON string:

```cypher
CREATE (:Example {col0: 123, col1: '{"a": [1, 2, 3]}', col2: '[9.5, 10.5, 11.5]'});
```

:::caution[Note]
Note that the JSON datatype is physically stored in Kùzu as a `STRING`, meaning the type signature of
individual values is not enforced.
:::

## JSON files

JSON files can be interacted with using [`LOAD FROM`](/cypher/query-clauses/load-from),
[`COPY FROM`](/import/copy-from-query-results), and [`COPY TO`](/export).

### `LOAD FROM`

This feature allows you to scan JSON files, similar to how your would do with other formats.
Without type information, the structure will be inferred through the same mechanism that the
`json_structure` function described later uses. To declare type information, you can use `LOAD WITH HEADERS`
like you would for CSV files.

```json
// data.json
[
    {"a": 1, "b": [1, 2, 3], "c": "2024-07-18"},
    {"a": -324, "b": [-10], "c": "2000-01-01"},
    {"a": 222222, "b": null}
]
```

To scan the file above, you can do the following:

```cypher
LOAD FROM 'data.json' RETURN *;
```
Output:
```
---------------------------------
| a      | b       | c          |
---------------------------------
| 1      | [1,2,3] | 2024-01-18 |
---------------------------------
| -324   | [-10]   | 2000-01-01 |
---------------------------------
| 222222 |         |            |
---------------------------------
```

Note that column `c` will be interpreted as a `STRING`, and not `DATE` by default. To enforce the
datatype, use `LOAD WITH HEADERS` feature.

Example:
```cypher
LOAD WITH HEADERS (a INT128, b STRING[], c DATE) FROM 'data.json' RETURN *;
```

For more loading options, see [`COPY FROM`](#copy-from) below.

### `COPY FROM`

This feature allows you to copy data from a JSON file into a table.

Example Usage:
```sql
CREATE NODE TABLE tab(a INT64, b STRING[], c DATE, PRIMARY KEY (a));

COPY tab FROM 'data.json';
```

Copy from supports the following parameters:

|Name|Description|
|-|-|
|`format`|`"array"` or `"unstructured"`. Array will read from documents whose roots are arrays, unstructured will read from files with multiple documents. Default value is `"array"`.
|`maximum_depth`|Default value is `-1`. Used by the type inference system to determine how "deep" into the json document to go to infer types. Give a value of `-1` to declare no limit.
|`sample_size`|Default value `-1`. Used by the type inference system to determine the number of elements used to infer the json type. Give a value of `-1` to declare no limit.

### `COPY TO`

This feature allows you to copy data from an existing table in Kùzu to a JSON file.

Example usage:
```sql
CREATE NODE TABLE tab(a INT64, b STRING[], c DATE, PRIMARY KEY(a));
CREATE (:tab {a: 1, b: ["a", "b", "c"], c: date("2024-07-18")});
CREATE (:tab {a: -10000, b: ["asdf"], c: NULL});
COPY (match (t:tab) return t.*) TO 'data2.json';
```

The output in the file `data2.json` looks like the following:
```json
[
    {"t.a":1,"t.b":["a","b","c"],"t.c":"2024-07-18"},
    {"t.a":-10000,"t.b":["asdf"],"t.c":null}
]
```

## Functions

### `to_json`

Signature: `ANY -> JSON`

Converts any Kuzu value to a JSON document.

### `json_merge_patch`

Signature: `JSON, JSON -> JSON`

Merges two JSON documents. Applies [RFC 7386](https://datatracker.ietf.org/doc/html/rfc7386).

### `json_extract`

Signatures: `JSON, STRING -> JSON`, `JSON, INTEGER -> JSON`

Extracts a path from a JSON document. `STRING` paths are delimited by `'/'`, while `INTEGER` paths are only used to index JSON arrays.

If the path does not exist, returns an empty JSON document.

### `json_array_length`

Signature: `JSON -> UINT32`

If the JSON document is an array, returns the array length. Otherwise returns 0

### `json_contains`

Signature: `JSON, JSON -> BOOL`

Determines whether or not the second JSON document (the needle) is contained within the first (the haystack).

### `json_keys`

Signature: `JSON -> STRING[]`

Gives the keys of the root JSON object. If the root is not an object, returns an empty list

### `json_structure`

Signature: `JSON -> STRING`

Returns the structure of the JSON document in Kuzu type notation. Will give smaller integer widths for smaller numbers

Example:
```cypher
RETURN json_structure('[{"a": -1, "b": [1000, 2000, 3000]}, {"a": 2, "c": "hi"}]');
```
Output:
```cypher
STRUCT(a INT16, b UINT16[], c STRING)[]
```

### `json_valid`

Signature: `JSON -> BOOL`

Determines whether or not the provided JSON document is valid.

### `json`

Signature: `JSON -> JSON`

Parses and minifies the JSON document.

Example:
```cypher
UNWIND ['[        {"a":  [1],     "b": 2,"c": 1}, 1,    5, 9]', '[1, 2, 3]', '"ab"'] AS ARR RETURN json(ARR);
```
Output:
```
[{"a":[1],"b":2,"c":1},1,5,9]
[1,2,3]
"ab"
```

