---
title: Python
sidebar_position: 2
---

You can easily install the latest Kùzu Python API using pip: `pip install kuzu`. 

Once the Python API is installed, you'll be able to import it in Python and execute Cypher queries. 
Below is a brief demonstration on getting started. 
You can find detailed information on the Python API [here](https://kuzudb.com/api-docs/python).

- Import library:

```python
import kuzu
```

- Create an empty database and connect to it with Python API:

```python
db = kuzu.Database('./test')
conn = kuzu.Connection(db)
```

- Define the schema:

```python
conn.execute("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))")
conn.execute("CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))")
conn.execute("CREATE REL TABLE Follows(FROM User TO User, since INT64)")
conn.execute("CREATE REL TABLE LivesIn(FROM User TO City)")
```

- Load data:

```python
conn.execute('COPY User FROM "user.csv"')
conn.execute('COPY City FROM "city.csv"')
conn.execute('COPY Follows FROM "follows.csv"')
conn.execute('COPY LivesIn FROM "lives-in.csv"')
```

- Execute a simple query:

```python
results = conn.execute('MATCH (u:User) RETURN u.name, u.age;')
while results.has_next():
    print(results.get_next())
```

Output:
```
['Adam', 30]
['Karissa', 40]
['Zhang', 50]
['Noura', 25]
```

Alternatively, the Python API can also output results as a Pandas data frame:
```python
results = conn.execute('MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name;').get_as_df()
print(results)
```

Output:
```
	a.name	f.since	b.name
0	Adam	2020	Karissa
1	Adam	2020	Zhang
2	Karissa	2021	Zhang
3	Zhang	2022	Noura
```

Moreover, you can output results in the Arrow format:
```python
results = conn.execute('MATCH (u:User) RETURN u.name, u.age;')
print(results.get_as_arrow(chunk_size=100))
```

Output:
```
u.name: string
u.age: int64
----
u.name: [["Adam","Karissa","Zhang","Noura"]]
u.age: [[30,40,50,25]]
```

## Colab Notebooks

We've compiled a series of Google Colab notebooks that demonstrate how Kùzu can be used through Python APIs, and integrated with the Python data science ecosystem:

- [General Kùzu Demo](https://colab.research.google.com/drive/15OLPggnRSBmR_K9yzq6iAGE5MDzNwqoN)
- [Cypher in Kùzu](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm)
- [Export Query Results to PyTorch Geometric: Node Property Prediction Example](https://colab.research.google.com/drive/1fzcwBwTY-M19p7OOTIaynfgHFcAQo9NK)
- [Export Query Results to PyTorch Geometric: Link Prediction Example](https://colab.research.google.com/drive/1QdX7CDdajIAb04lqaO5PfJlpKG-ljG28)
- [Export Query Results to NetworkX](https://colab.research.google.com/drive/1NDsnFDWcSGoaOl-mOgG0zrPG2VAr8Q6H)
- [Using Kùzu as PyTorch Geometric Remote Backend](https://colab.research.google.com/drive/12fOSqPm1HQTz_m9caRW7E_92vaeD9xq6)
