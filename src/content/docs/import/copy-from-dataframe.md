---
title: "Copy from DataFrame"
---

You can copy from Pandas or Polars DataFrames directly into Kùzu using the `COPY FROM` command.
This is useful when you are doing your data transformations with either of these libraries and then
want to bulk insert data from the resulting DataFrame into Kùzu.

Because the Polars DataFrame scanner is built on top of the PyArrow layer, you can also copy data
from in-memory Arrow tables directly into Kùzu.

## Pandas

You can directly copy from a Pandas DataFrame into Kùzu. Both numpy-backed and PyArrow-backed Pandas
DataFrames are supported.

```python
import kuzu
import pandas as pd

db = kuzu.Database("tmp")
conn = kuzu.Connection(db)

conn.execute("CREATE NODE TABLE Person(name STRING, age INT64, PRIMARY KEY (name))")

df = pd.DataFrame({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})

conn.execute("COPY Person FROM df")
```

## Polars

You can utilize an existing Polars DataFrame to copy data directly into Kùzu.

```python
import kuzu
import polars as pl

db = kuzu.Database("tmp")
conn = kuzu.Connection(db)

conn.execute("CREATE NODE TABLE Person(name STRING, age INT64, PRIMARY KEY (name))")

df = pl.DataFrame({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})

conn.execute("COPY Person FROM df")
```

## Arrow tables

You can utilize an existing in-memory PyArrow table to copy data directly into Kùzu (in fact, the Polars DataFrame example
above also leverages scanning from PyArrow tables under the hood).

```python
import kuzu
import pyarrow as pa

db = kuzu.Database("tmp")
conn = kuzu.Connection(db)

conn.execute("CREATE NODE TABLE Person(name STRING, age INT64, PRIMARY KEY (name))")

pa_table = pa.table({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})

conn.execute("COPY Person FROM pa_table")
```

## Ignore erroneous rows

When copying from DataFrames, you can ignore rows in DataFrames that contain duplicate, null
or missing primary key errors.

:::note[Note]
Currently, you cannot ignore parsing or type-casting errors when copying from DataFrames (the
underlying data must be parseable and type-castable).
:::

Let's understand this with an example.

```py
import pandas as pd

persons = ["Rhea", "Alice", "Rhea", None]
age = [25, 23, 25, 24]

df = pd.DataFrame({"name": persons, "age": age})
print(df)
```
The given DataFrame is as follows:
```
    name  age
0   Rhea   25
1  Alice   23
2   Rhea   25
3   None   24
```
As can be seen,the Pandas DataFrame has a duplicate name "Rhea", and null value (`None`)
for the `name`, which is the desired primary key field. We can ignore the erroneous rows during import
by setting the `ignore_errors` parameter to `True` in the `COPY FROM` command.

```py
import kuzu

db = kuzu.Database("test_db")
conn = kuzu.Connection(db)

# Create a Person node table with name as the primary key
conn.execute("CREATE NODE TABLE Person(name STRING PRIMARY KEY, age INT64)")
# Enable the `ignore_errors` parameter below to ignore the erroneous rows
conn.execute("COPY Person FROM df (ignore_errors=true)")

# Display results
res = conn.execute("MATCH (p:Person) RETURN p.name, p.age")
print(res.get_as_df())
```
This is the resulting DataFrame after ignoring errors:
```
  p.name  p.age
0   Rhea     25
1  Alice     23
```
If the `ignore_errors` parameter is not set, the import operation will fail with an error.

You can see [Ignore erroneous rows](/import#ignore-erroneous-rows) section for details on
which kinds of errors can be ignored when copying from Pandas or Polars DataFrames.
