---
title: Load From
sidebar_position: 12
description: Load
---

# LOAD FROM

`LOAD FROM` clause performs a direct scan over input file without loading it into the database. This can be useful when performing quick testing over a small sample of the file. `LOAD FROM` can be used in the exact same way as `MATCH`, meaning it can be followed by arbitrary clauses like `WHERE, RETURN, CREATE, ...`. Some example usage are as following.

E.g. Filtering and aggregating over input file.
```
LOAD FROM "test.csv"
WHERE 
RETURN COUNT(*)
```

E.g. Create nodes from input file.
```
LOAD FROM "test.csv"
CREATE (:Person {ID: id, name:})
```


## Schema Information

### CSV Detection
When loading from a CSV file, user can specify the same set of configuration as [importing from CSV through COPY](../../data-import/csv-import.md).

If no header information is available, Kùzu will use the default cofiguration and parse each column as `STRING` type with name `column0, column1, ...`. E.g.
```
TODO: fill me.
```

If header information is available in the file, Kùzu will parse the header and use data types and names as specified in the header. E.g.
```
TODO fill me.
```

### Parquet Detection

Since parquet file contains schema, Kùzu will always use parquet schema information. 


### Manually Speficy
To specify the schema information, user can use `LOAD FROM <file> WITH HEADER (<schema information>)`

E.g.
```
TODO fill me.
```
