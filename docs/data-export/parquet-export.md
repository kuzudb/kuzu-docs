---
title: PARQUET
---

# Data Export to Parquet

`COPY TO` clause can export query results into a Parquet file. 
```
COPY (MATCH (u:User) return u.*) TO 'user.parquet';
```
As an example, you can see the contents of the exported Parquet file with a `LOAD FROM` clause:
```
Query: LOAD FROM 'user.parquet' RETURN *;
-------------------
| u.name  | u.age |
-------------------
| Adam    | 30    |
-------------------
| Karissa | 40    |
-------------------
| Zhang   | 50    |
-------------------
| Noura   | 25    |
-------------------
```

**Notes**
- Exporting [Fixed List](../cypher/data-types/list.md) data type to Parquet is not supported yet.
- The [Union](../cypher/data-types/union.md) data type is exported as a struct, which is the internal representation of Union datatype.
- Currently, only snappy compression is supported.
