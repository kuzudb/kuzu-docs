---
title: JSON extension
---

## Usage

The `json` extension adds support for the `JSON` datatype, including a set of functions for JSON
access and manipulation, scanning from, and copying to JSON files.

You can install the JSON extension by running the following command:

```sql
INSTALL json;
LOAD EXTENSION json;
```

## JSON files

JSON files can be interacted with using [`LOAD FROM`](/cypher/query-clauses/load-from),
[`COPY FROM`](/import/copy-from-query-results), and [`COPY TO`](/export).

### `LOAD FROM`

This feature allows you to scan JSON files, similar to scanning other formats.
Without type information, the structure will be inferred.
To declare type information, you can use `LOAD WITH HEADERS` like you would for CSV files.

```json
[
  {
    "id": 2,
    "name": "Gregory"
  },
  {
    "id": 1,
    "name": "Bob",
    "info": {
      "height": 1.81,
      "age": 71,
      "previous_usernames": [ "the_builder", "the_minion" ]
    }
  },
  {
    "id": 0,
    "name": "Alice",
    "registry_date": "2024-07-31",
    "info": {
      "height": 1.68,
      "age": 45,
      "previous_usernames": [ "alice123", "alice_34425" ]
    }
  }
]
```

To scan the file above, you can do the following:

```cypher
LOAD FROM 'people.json' RETURN *;
```
Output:
```
┌───────┬─────────┬───────────────┬───────────────────────────────────────────────────────────────────────────┐
│ id    │ name    │ registry_date │ info                                                                      │
│ UINT8 │ STRING  │ STRING        │ STRUCT(height DOUBLE, age UINT8, previous_usernames STRING[])             │
├───────┼─────────┼───────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 2     │ Gregory │               │                                                                           │
│ 1     │ Bob     │               │ {height: 1.810000, age: 71, previous_usernames: [the_builder,the_minion]} │
│ 0     │ Alice   │ 2024-07-31    │ {height: 1.680000, age: 45, previous_usernames: [alice123,alice_34425]}   │
└───────┴─────────┴───────────────┴───────────────────────────────────────────────────────────────────────────┘
```

Note that the resulting schema will be the union of the schema of all the objects in the json file.

In the above case, because we loosely scanned the file with no enforcement of types, column `registry_date`
will be interpreted as a `STRING`, and not `DATE` by default. To enforce the datatype during scanning,
use the `LOAD WITH HEADERS` feature.

Example:
```cypher
LOAD WITH HEADERS (id INT64, name STRING, registry_date DATE, info STRUCT(height DOUBLE, age INT64, previous_usernames STRING[])) FROM 'people.json' RETURN *;
```
Output:
```
┌───────┬─────────┬───────────────┬───────────────────────────────────────────────────────────────────────────┐
│ id    │ name    │ registry_date │ info                                                                      │
│ INT64 │ STRING  │ DATE          │ STRUCT(height DOUBLE, age INT64, previous_usernames STRING[])             │
├───────┼─────────┼───────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 2     │ Gregory │               │                                                                           │
│ 1     │ Bob     │               │ {height: 1.810000, age: 71, previous_usernames: [the_builder,the_minion]} │
│ 0     │ Alice   │ 2024-07-31    │ {height: 1.680000, age: 45, previous_usernames: [alice123,alice_34425]}   │
└───────┴─────────┴───────────────┴───────────────────────────────────────────────────────────────────────────┘
```

The following optional parameters are supported:

|Name|Description|
|---|---|
|`format`|`"array"` or `"unstructured"`. Array will read from documents whose roots are arrays, unstructured will read from files with multiple documents. Default value is `"array"`.
|`maximum_depth`|Default value is `10`. Used by the type inference system to determine how "deep" into the json document to go to infer types.
|`sample_size`|Default value `2048`. Used by the type inference system to determine the number of elements used to infer the json type.

#### `format` Parameter

Given a 'people-unstructured.json' file in the following form:
```json
{
    "id": 2,
    "name": "Gregory"
}
{
    "id": 1,
    "name": "Bob",
    "info": {
        "height": 1.81,
        "age": 71,
        "previous_usernames": [ "the_builder", "the_minion" ]
    }
}
{
    "id": 0,
    "name": "Alice",
    "registry_date": "2024-07-31",
    "info": {
        "height": 1.68,
        "age": 45,
        "previous_usernames": [ "alice123", "alice_34425" ]
    }
}
```

That is, the file contains multiple JSON objects instead of objects wrapped in an array, then the
`format='unstructured'` option should be used to scan the file.

```cypher
LOAD FROM 'people-unstructured.json' (format='unstructured') RETURN *;
```

The results remain the same.

#### `maximum_depth` and `sample_size` Parameters 

If the types aren't explicitly declared, the type inference system will only go through the first
`sample_size` objects, and only reach a depth of `maximum_depth` to infer the schema. If we write

```cypher
LOAD FROM 'people-unstructured.json' (format='unstructured', sample_size=1) RETURN *;
```

Then the type inference system will only look at
```json
{
    "id": 2,
    "name": "Gregory"
}
```

And conclude that the schema is `(ID UINT8, NAME STRING)`, therefore giving the result
```
┌───────┬─────────┐
│ id    │ name    │
│ UINT8 │ STRING  │
├───────┼─────────┤
│ 2     │ Gregory │
│ 1     │ Bob     │
│ 0     │ Alice   │
└───────┴─────────┘
```

Likewise, if we set the `maximum_depth` to `2`

```cypher
LOAD FROM 'people-unstructured.json' (format='unstructured', sample_size=2) RETURN *;
```

Then the type inference system will give up after the second level of type inference,
and assume everything is a `STRING`

```
┌────────┬─────────┬────────────────────────────────────────────────────────────────────────────┬───────────────┐
│ id     │ name    │ info                                                                       │ registry_date │
│ STRING │ STRING  │ STRING                                                                     │ STRING        │
├────────┼─────────┼────────────────────────────────────────────────────────────────────────────┼───────────────┤
│ 2      │ Gregory │                                                                            │               │
│ 1      │ Bob     │ {"height":1.81,"age":71,"previous_usernames":["the_builder","the_minion"]} │               │
│ 0      │ Alice   │ {"height":1.68,"age":45,"previous_usernames":["alice123","alice_34425"]}   │ 2024-07-31    │
└────────┴─────────┴────────────────────────────────────────────────────────────────────────────┴───────────────┘
```

### `COPY FROM`

This feature allows you to copy data from a JSON file into a node or relationship table.

Example:
```sql
CREATE NODE TABLE Person (id SERIAL, name STRING, info STRUCT(height DOUBLE, age INT64, registry_date DATE, previous_usernames STRING[]), PRIMARY KEY(id));
COPY Person FROM 'people.json';
```

Optional parameters in `COPY FROM` are identical to the [`LOAD FROM`](#load-from) feature, shown above.

### `COPY TO`

This feature allows you to copy data from an existing table in Kùzu to a JSON file.

Example usage:
```sql
CREATE NODE TABLE Person (id SERIAL, name STRING, info STRUCT(height DOUBLE, age INT64, previous_usernames STRING[]), PRIMARY KEY(id));
CREATE (:Person {name: "Alice", info: {height: 1.68, age: 45, previous_usernames: ["alice123", "alice_34425"]}});
CREATE (:Person {name: "Bob", info: {height: 1.81, age: 71, previous_usernames: ["the_builder", "the_minion"]}});
CREATE (:Person {name: "Gregory", info: {height: 1.73, age: 22, previous_usernames: ["gregory7"]}});
COPY (match (p:Person) return p.*) to 'people-output.json';
```

The output in the file `people.json-output` looks like the following:
```json
[
{"p.id":0,"p.name":"Alice","p.info":{"height":1.68,"age":45,"previous_usernames":["alice123","alice_34425"]}},
{"p.id":1,"p.name":"Bob","p.info":{"height":1.81,"age":71,"previous_usernames":["the_builder","the_minion"]}},
{"p.id":2,"p.name":"Gregory","p.info":{"height":1.73,"age":22,"previous_usernames":["gregory7"]}}
]
```

## Experimental Datatype

> Note: The following datatype and functions has known issues
> Implicit casts and exporting JSON types does not work correctly at the moment.

A column can be declared to be JSON data in the exact same way that any other datatype is specified.
```sql
CREATE NODE TABLE tab(JSON col0, JSON col1, JSON col2, PRIMARY KEY col0);
```

Values can be inserted in the way you might expect

```cypher
CREATE (:tab {col0: "123", col1: '{"a": [1, 2, 3]}', col2: '[9.5, 10.5, 11.5]'});
```

> Note that the json datatype is physically stored as a `STRING`, meaning the validity of individual values is not enforced.

## Experimental Functions

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

