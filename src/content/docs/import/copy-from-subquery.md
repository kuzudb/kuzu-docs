---
title: Copy from subquery
---

You can bulk import the results of a subquery like `MATCH ....` by attaching
that query as a subquery of a `COPY FROM` statement. This is useful when you need to transform data
before inserting it into the database, or if you want to copy data from a `LOAD FROM` scan operation
on a data structure that's already in memory, such as Pandas DataFrames.

For example, consider that we have a graph with a `User` node label and a `Follows` relationship type.
We want to create a new `Person` node table and a `Knows` relationship table, where we state that
a Person knows another Person if they follow each other. We can use the `COPY FROM` command with a subquery
to achieve this as follows:

#### Create node/relationship tables

```cypher
CREATE NODE TABLE Person(name STRING, PRIMARY KEY (name));
CREATE REL TABLE Knows(FROM Person TO Person);
```

### `COPY FROM` a `MATCH` subquery

```cypher
COPY Person FROM (MATCH (a:User) RETURN a.name);
COPY Knows FROM (MATCH (a:User)-[r:Follows]->(b:User) RETURN a.name, b.name);
```

### `COPY FROM` a `LOAD FROM` scan subquery

An alternate use case for this feature would be when you want to directly scan data from an existing
object, such as a Pandas DataFrame using `LOAD FROM` and use its results as input to the `COPY FROM`
command. This can be combined with predicate filters as follows:

```python
import kuzu
import pandas as pd

db = kuzu.Database("tmp")
conn = kuzu.Connection(db)

df = pd.DataFrame({
    "name": ["Adam", "Karissa", "Zhang", "Noura"],
    "age": [30, 40, 50, 25]
})

conn.execute("CREATE NODE TABLE Person(name STRING, age INT64, PRIMARY KEY (name))")

# Apply a predicate filter while scanning the DataFrame
# Pass the results of the scan to the COPY FROM command
conn.execute("COPY Person FROM (LOAD FROM df WHERE age < 30 RETURN *)")
```

You can similarly use this approach to subset your data, for example, read only a part of your
DataFrame, Parquet or CSV file, and then copy that subset into Kùzu.

```python
# Load specific columns only
conn.execute("COPY Person FROM (LOAD FROM df RETURN name)")
```
