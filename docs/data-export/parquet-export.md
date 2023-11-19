---
title: PARQUET
---

# Data Export to Parquet

`COPY TO` clause can export query result into a PARQUET file. 
```
copy (match (u:User) return u.*) to 'user.parquet';
```
The parquet file can then be validated by using the load from clause:
```
Query: load from 'user.parquet' return *;
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

**Note** 
- Export fixedList to parquet is not supported yet.
- Union will be exported as struct which is the internal representation of union datatype.
- Only snappy compression is currently supported.
