---
title: "Copy from JSON"
---

You can copy from JSON directly into Kùzu using the `COPY FROM` command. To use this feature,
you have to install the `JSON` extension using the instructions shown [here](/extensions/json).

Consider the following JSON file:

```json
// people.json
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
    "registryDate": "2024-07-31",
    "info": {
        "height": 1.68,
        "age": 45,
        "previous_usernames": [ "alice123", "alice_34425" ]
    }
}
```

## Import to node table

The following example creates a node table `Person` and copies data from a JSON file `people.json` into it:

```sql
CREATE NODE TABLE Person (id SERIAL, name STRING, info STRUCT(height DOUBLE, age INT64, registry_date DATE, previous_usernames STRING[]), PRIMARY KEY(id));
COPY Person FROM 'people.json';
```

See the [`JSON`](/extensions/json) extension documentation for more related features on working with JSON files.

### Ignoring Erroneous Rows

By specifying the `ignore_errors` option to `true`, we can ignore erroneous rows in JSON files. Consider the following example:

The file `vPerson.json` contains the following fields (note that `2147483650` does not fit into an INT32):
```json
0,4
2,2147483650
```

The following statement will load only the first row of `vPerson.json`, skipping the erroneous second row.

```cypher
LOAD EXTENSION "${KUZU_ROOT_DIRECTORY}/extension/json/build/libjson.kuzu_extension";
LOAD WITH HEADERS (ID INT16, age INT32) FROM "vPerson.json" (header=false, ignore_errors=true) RETURN *;
```

We can call `show_warnings` to show any errors that caused rows to be skipped during the copy.

```cypher
CALL show_warnings() RETURN *;
```

Output:
```
┌──────────┬─────────────────────────────────────────────────────────────────────────────┬─────────────┬───────────────────────┬────────────────────────┐
│ query_id │ message                                                                     │ file_path   │ line_or_record_number │ skipped_line_or_record │
│ UINT64   │ STRING                                                                      │ STRING      │ UINT64                │ STRING                 │
├──────────┼─────────────────────────────────────────────────────────────────────────────┼─────────────┼───────────────────────┼────────────────────────┤
│ 0        │ Conversion exception: Cast failed. Could not convert "2147483650" to INT32. │ vPerson.json │ 2                     │ 2,2147483650           │
└──────────┴─────────────────────────────────────────────────────────────────────────────┴─────────────┴───────────────────────┴────────────────────────┘
```
