---
title: Export Parquet
---

The `COPY TO` clause can export query results to a Parquet file. It can be combined with a subquery
and used as shown below.

```cypher
COPY (MATCH (u:User) return u.*) TO 'user.parquet';
```

The `LOAD FROM` clause can used to scan the Parquet file and to verify that the export worked:

```cypher
> LOAD FROM 'user.parquet' RETURN *;
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

:::caution[Notes]
- Exporting [Fixed List](../cypher/data-types#list) or [Variant](../../cypher/data-types/variant) data type to Parquet is not yet supported.
- The [Union](../../cypher/data-types/union) data type is exported as a struct, which is the internal representation of `Union` data type.
- Currently, only snappy compression is supported for exports.
:::
