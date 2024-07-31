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
      "previousUsernames": [ "theBuilder", "theMinion" ]
    }
  },
  {
    "id": 0,
    "name": "Alice",
    "registryDate": "2024-07-31",
    "info": {
      "height": 1.68,
      "age": 45,
      "previousUsernames": [ "obviouslyAlice", "definitelyNotAlice" ]
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
┌───────┬─────────┬──────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
│ id    │ name    │ registryDate │ info                                                                                │
│ UINT8 │ STRING  │ STRING       │ STRUCT(height DOUBLE, age UINT8, previousUsernames STRING[])                        │
├───────┼─────────┼──────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ 2     │ Gregory │              │                                                                                     │
│ 1     │ Bob     │              │ {height: 1.810000, age: 71, previousUsernames: [theBuilder,theMinion]}              │
│ 0     │ Alice   │ 2024-07-31   │ {height: 1.680000, age: 45, previousUsernames: [obviouslyAlice,definitelyNotAlice]} │
└───────┴─────────┴──────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

Note that the resulting schema will be the union of the schema of all the objects in the json file.

In the above case, because we loosely scanned the file with no enforcement of types, column `registryDate`
will be interpreted as a `STRING`, and not `DATE` by default. To enforce the datatype during scanning,
use the `LOAD WITH HEADERS` feature.

Example:
```cypher
LOAD WITH HEADERS (id INT64, name STRING, registryDate DATE, info STRUCT(height DOUBLE, age INT64, previousUsernames STRING[])) FROM 'people.json' RETURN *;
```
Output:
```
┌───────┬─────────┬──────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
│ id    │ name    │ registryDate │ info                                                                                │
│ INT64 │ STRING  │ DATE         │ STRUCT(height DOUBLE, age INT64, previousUsernames STRING[])                        │
├───────┼─────────┼──────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ 2     │ Gregory │              │                                                                                     │
│ 1     │ Bob     │              │ {height: 1.810000, age: 71, previousUsernames: [theBuilder,theMinion]}              │
│ 0     │ Alice   │ 2024-07-31   │ {height: 1.680000, age: 45, previousUsernames: [obviouslyAlice,definitelyNotAlice]} │
└───────┴─────────┴──────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
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
        "previousUsernames": [ "theBuilder", "theMinion" ]
    }
}
{
    "id": 0,
    "name": "Alice",
    "registryDate": "2024-07-31",
    "info": {
        "height": 1.68,
        "age": 45,
        "previousUsernames": [ "obviouslyAlice", "definitelyNotAlice" ]
    }
}
```

That is, the file contains multiple json objects instead of objects wrapped in an array, then the
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
┌────────┬─────────┬──────────────────────────────────────────────────────────────────────────────────────┬──────────────┐
│ id     │ name    │ info                                                                                 │ registryDate │
│ STRING │ STRING  │ STRING                                                                               │ STRING       │
├────────┼─────────┼──────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ 2      │ Gregory │                                                                                      │              │
│ 1      │ Bob     │ {"height":1.81,"age":71,"previousUsernames":["theBuilder","theMinion"]}              │              │
│ 0      │ Alice   │ {"height":1.68,"age":45,"previousUsernames":["obviouslyAlice","definitelyNotAlice"]} │ 2024-07-31   │
└────────┴─────────┴──────────────────────────────────────────────────────────────────────────────────────┴──────────────┘
```

### `COPY FROM`

This feature allows you to copy data from a JSON file into a node or relationship table.

Example:
```sql
CREATE NODE TABLE Person (id SERIAL, name STRING, info STRUCT(height DOUBLE, age INT64, registryDate DATE previousUsernames STRING[]), PRIMARY KEY(id));
COPY Person FROM 'people.json';
```

Optional parameters in `COPY FROM` are identical to the [`LOAD FROM`](#load-from) feature, shown above.

### `COPY TO`

This feature allows you to copy data from an existing table in Kùzu to a JSON file.

Example usage:
```sql
CREATE NODE TABLE Person (id SERIAL, name STRING, info STRUCT(height DOUBLE, age INT64, previousUsernames STRING[]), PRIMARY KEY(id));
CREATE (:Person {name: "Alice", info: {height: 1.68, age: 45, previousUsernames: ["obviouslyAlice", "definitelyNotAlice"]}});
CREATE (:Person {name: "Bob", info: {height: 1.81, age: 71, previousUsernames: ["theBuilder", "theMinion"]}});
CREATE (:Person {name: "Gregory", info: {height: 1.73, age: 22, previousUsernames: ["gregory7"]}});
COPY (match (p:Person) return p.*) to 'people-output.json';
```

The output in the file `people.json-output` looks like the following:
```json
[
{"p.id":0,"p.name":"Alice","p.info":{"height":1.68,"age":45,"previousUsernames":["obviouslyAlice","definitelyNotAlice"]}},
{"p.id":1,"p.name":"Bob","p.info":{"height":1.81,"age":71,"previousUsernames":["theBuilder","theMinion"]}},
{"p.id":2,"p.name":"Gregory","p.info":{"height":1.73,"age":22,"previousUsernames":["gregory7"]}}
]
```
