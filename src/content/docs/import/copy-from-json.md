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

Create a node table `Person` as follows:

```cypher
CREATE NODE TABLE Person (ID INT32, age INT32, PRIMARY KEY (ID));
```

The file `vPerson.json` contains the following fields (note that there are two entries with the same primary key `ID=2`):
```json
{"ID": 0, "age": 4}
{"ID": 2, "age": 3}
{"ID": 2, "age": 6}
{"ID": 5, "age": 10}
```

The following statement will skip one of the duplicate rows of `vPerson.json`, copying the remaining rows into the `Person` table.

```cypher
COPY person FROM "vPerson.json" (ignore_errors=true);
```

We can call `show_warnings` to show any errors that caused rows to be skipped during the copy.

```cypher
CALL show_warnings() RETURN *;
```

Output:
```
┌──────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────┬─────────────┬────────────────────────┐
│ query_id │ message                                                                                                   │ file_path    │ line_number │ skipped_line_or_record │
│ UINT64   │ STRING                                                                                                    │ STRING       │ UINT64      │ STRING                 │
├──────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┼─────────────┼────────────────────────┤
│ 2        │ Found duplicated primary key value 2, which violates the uniqueness constraint of the primary key column. │ vPerson.json │ 3           │ {"ID": 2, "age": 6}    │
└──────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────┴─────────────┴────────────────────────┘
```
