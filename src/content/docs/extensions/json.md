---
title: JSON
---

The `json` extension adds support for the `JSON` datatype, a set of functions for JSON access and manipulation, scanning json files, and copying to json files.

# Data Type

A column can be declared to be JSON data in the exact same way that any other datatype is specified.
```sql
CREATE NODE TABLE tab(JSON col0, JSON col1, JSON col2, PRIMARY KEY col0);
```

Values can be inserted in the way you might expect

```cypher
CREATE (:tab {col0: "123", col1: '{"a": [1, 2, 3]}', col2: '[9.5, 10.5, 11.5]'});
```

> Note that the json datatype is physically stored as a `STRING`, meaning the validity of individual values is not enforced.

# JSON File Support

JSON files can be interacted with using [`LOAD FROM`](/cypher/query-clauses/load-from), [`COPY FROM`](/import/copy-from-query-results), and `COPY TO`

### `LOAD FROM`

Used when there is no need to load into a table. Without type information, the structure will be inferred through the same mechanism that the `json_structure` function described later uses. To declare type information, use `LOAD WITH HEADERS`

Example:

`data.json`:
```json
[
    {"a": 1, "b": [1, 2, 3], "c": "2024-07-18"},
    {"a": -324, "b": [-10], "c": "2000-01-01"},
    {"a": 222222, "b": null}
]
```

Query:
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

Note that column `c` will be interpreted as a STRING. To enforce the outputted datatype, use `LOAD WITH HEADERS`

Example:
```cypher
LOAD WITH HEADERS (a INT128, b STRING[], c DATE) FROM 'data.json' RETURN *;
```

For more loading options, see `COPY FROM`


### `COPY FROM`

Used when there is a need to load into a table.

Example Usage:
```
CREATE NODE TABLE tab(a INT64, b STRING[], c DATE, PRIMARY KEY (a));

COPY tab FROM 'data.json';
```

Copy from supports the following parameters:

|Name|Description|
|-|-|
|`format`|`"array"` or `"unstructured"`. Array will read from documents whose roots are arrays, unstructured will read from files with multiple documents. Default value is `"array"`|
|`maximum_depth`|Default value is `-1`. Used by the type inference system to determine how "deep" into the json document to go to infer types. Give a value of `-1` to declare no limit|
|`sample_size`|Default value `-1`. Used by the type inference system to determine the number of elements used to infer the json type. Give a value of `-1` to declare no limit|

### `COPY TO`

Used to copy from a table to a json file.

Example usage:
```
CREATE NODE TABLE tab(a INT64, b STRING[], c DATE, PRIMARY KEY(a));
CREATE (:tab {a: 1, b: ["a", "b", "c"], c: date("2024-07-18")});
CREATE (:tab {a: -10000, b: ["asdf"], c: NULL});
COPY (match (t:tab) return t.*) TO 'data2.json';
```
`data2.json`:
```json
[
{"t.a":1,"t.b":["a","b","c"],"t.c":"2024-07-18"},
{"t.a":-10000,"t.b":["asdf"],"t.c":null}
]
```

# Functions

### `to_json`

Signature: `ANY -> JSON`

Converts any Kuzu value to a JSON document

### `json_merge_patch`

Signature: `JSON, JSON -> JSON`

Merges two JSON documents. Applies [RFC 7386](https://datatracker.ietf.org/doc/html/rfc7386)

### `json_extract`

Signatures: `JSON, STRING -> JSON`, `JSON, INTEGER -> JSON`

Extracts a path from a JSON document. `STRING` paths are delimited by `'/'`, while `INTEGER` paths are only used to index JSON arrays

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
```
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

