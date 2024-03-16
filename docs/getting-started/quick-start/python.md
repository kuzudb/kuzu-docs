---
title: Python
sidebar_position: 1
---

This page provides a walkthrough on how to get started using the Kùzu [Python API](https://kuzudb.com/api-docs/python).

## Installation

Install the latest Kùzu Python API using pip:

```bash
pip install kuzu
``` 

## Walkthrough

Once the Python API is installed, you"ll be able to import `kuzu` in your Python script and execute
Cypher queries.

Import Kùzu, create a new database and connect to it:

```python
import kuzu
db = kuzu.Database("./test")
conn = kuzu.Connection(db)
```

### Schema definition

```python
conn.execute("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))")
conn.execute("CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))")
conn.execute("CREATE REL TABLE Follows(FROM User TO User, since INT64)")
conn.execute("CREATE REL TABLE LivesIn(FROM User TO City)")
```

### Load data

This step assumes that the following CSV files exist in the local directory. The commands listed
below will load the data from the CSV files into the database.

```python
conn.execute("COPY User FROM "user.csv"")
conn.execute("COPY City FROM "city.csv"")
conn.execute("COPY Follows FROM "follows.csv"")
conn.execute("COPY LivesIn FROM "lives-in.csv"")
```

### Return results as a list of tuples

```python
results = conn.execute("MATCH (u:User) RETURN u.name, u.age;")
while results.has_next():
    print(results.get_next())

# Output
["Adam", 30]
["Karissa", 40]
["Zhang", 50]
["Noura", 25]
```

### Return Pandas DataFrame

```python
results = conn.execute(
    """
    MATCH (a:User)-[f:Follows]->(b:User)
    RETURN a.name, f.since, b.name;
    """
    ).get_as_df()
print(results)
```

```bash
	a.name	f.since	b.name
0	Adam	2020	Karissa
1	Adam	2020	Zhang
2	Karissa	2021	Zhang
3	Zhang	2022	Noura
```

### Return PyArrow table

```python
results = conn.execute("MATCH (u:User) RETURN u.name, u.age;")
print(results.get_as_arrow(chunk_size=100))
```

```bash
u.name: string
u.age: int64
----
u.name: [["Adam","Karissa","Zhang","Noura"]]
u.age: [[30,40,50,25]]
```

### Return Polars DataFrame

```python
results = conn.execute(
    """
    MATCH (a:User)-[f:Follows]->(b:User)
    RETURN a.name, f.since, b.name;
    """
    ).get_as_pl()
print(results)
```

```bash
shape: (4, 3)
┌───────────┬─────────┬───────────┐
│ a.name    │ f.since │ b.name    │
│ ---       │ ---     │ ---       │
│ str       │ i64     │ str       │
├───────────┼─────────┼───────────┤
│ "Adam"    │ 2020    │ "Karissa" │
│ "Adam"    │ 2020    │ "Zhang"   │
│ "Karissa" │ 2021    │ "Zhang"   │
│ "Zhang"   │ 2022    │ "Noura"   │
└───────────┴─────────┴───────────┘
```

Similarly, you can also return the results as a NetworkX graph or a PyTorch Geometric graph.

## Python API Documentation

The Python API documentation can be found [here](https://kuzudb.com/api-docs/python).

## Colab Notebooks

We"ve compiled a series of Google Colab notebooks that demonstrate how Kùzu can be used through Python APIs, and integrated with the Python data science ecosystem:

- [Kùzu Quick Start](https://colab.research.google.com/drive/1r9Yay6hUvrcxLrnmh3mz8uXHFKs12xUZ)
- [Cypher in Kùzu: Intro](https://colab.research.google.com/drive/1zgTCEOFdskYRQ45COYRww7sA6fTXE66S)
- [Export Query Results to NetworkX](https://colab.research.google.com/drive/1_AK-CHELz0fLAc2RCPvPgD-R7-NGyrGu)
- [Export Query Results to PyTorch Geometric: Node Property Prediction Example](https://colab.research.google.com/drive/1ijFoPN4USr4umUzRoCfRPFNZfbhKKLcC)
- [Export Query Results to PyTorch Geometric: Link Prediction Example](https://colab.research.google.com/drive/1OxlDLUYZL8jTkqKdVebFtek7yZ5of7FK)
- [Using Kùzu as PyTorch Geometric Remote Backend](https://colab.research.google.com/drive/1OKohp9SlRNe0EO5HrLcNqyqi4XsLFdrV)
