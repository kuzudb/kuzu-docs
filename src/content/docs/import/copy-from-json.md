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
