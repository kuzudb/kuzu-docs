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

You can utilize an existing Polars DataFrame to copy data directly into Kùzu. This leverages
the underlying PyArrow interface, so you can also use Arrow tables as shown in the next section.

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

You can utilize an existing in-memory PyArrow table to copy data directly into Kùzu. This is what
the Polars DataFrame example above leverages under the hood.

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
