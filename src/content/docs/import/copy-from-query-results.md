---
title: Copy FROM subquery
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

### `COPY FROM` a Pandas DataFrame

An alternate use case for this feature would be when you want to directly scan data from an existing
object, such as a Pandas DataFrame using `LOAD FROM` and use its results as input to the `COPY FROM`
command. This can be combined with predicate filters as follows:

```python
# Assumes that you have a Kùzu connection object named `conn`
# Also assumes that you created a node table named `Person` with columns `name` and `age`
import pandas as pd

df = pd.DataFrame({
    "name": ["Adam", "Karissa", "Zhang", "Noura"],
    "age": [30, 40, 50, 25]
})

conn.execute("COPY Person FROM (LOAD FROM df WHERE age < 30 RETURN *")
```

Using `COPY FROM` with subqueries in this manner opens up a wider
range of possibilities for data manipulation and transformation prior to doing bulk-insertion into Kùzu.
