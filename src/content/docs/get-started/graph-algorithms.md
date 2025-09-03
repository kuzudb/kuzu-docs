---
title: "Run graph algorithms"
---

Network analysis is the process of analyzing the structure relationships in a system
of connected entities to understand patterns in the data. It's incredibly common in a variety
of domains, from finance, to social networks, transportation and healthcare applications.

When working with Kuzu, you can run graph algorithms in one of two ways:

1. `algo` extension: Run graph algorithms natively in Kuzu via the algo extension.
2. NetworkX: Use the [NetworkX](https://networkx.org/documentation/stable/reference/index.html) library
in Python to run almost any graph algorithm on a Kuzu subgraph.

## Dataset

A dataset of Nobel laureates and their mentorship network is provided
[here](https://raw.githubusercontent.com/kuzudb/tutorials/main/src/network_analysis/data.zip).
Download the dataset to your local directory and unzip it.

The nodes in the dataset are scholars who won Nobel prizes (laureates), as well as other
scholars who didn't win prizes but were involved in mentoring them. The edges represent
mentor-mentee relationships between the scholars. Laureates who won prizes in Physics, Chemistry,
Medicine and Economics are in the dataset.

To run the code examples below, you can install the following dependencies:
```bash
pip install kuzu polars pyarrow networkx numpy scipy
```

## Create graph

Once the dataset is downloaded and unzipped, we can create a graph using the code below. First,
we initialize a connection to a new Kuzu database named `example.kuzu`.

```py
from pathlib import Path
import kuzu

db_path = "example.kuzu"

Path(db_path).unlink(missing_ok=True)
db = kuzu.Database(db_path)
conn = kuzu.Connection(db)
```

There will be one node table `Scholar`, and one relationship table `MENTORED` in this graph. The
schema is defined as follows:

```py
# Node table schema
conn.execute(
    """
    CREATE NODE TABLE Scholar(
        name STRING PRIMARY KEY,
        prize STRING,
        year INT64,
        is_laureate BOOLEAN DEFAULT false
    )
    """
)
# Relationship table schema
conn.execute("CREATE REL TABLE MENTORED(FROM Scholar TO Scholar)")
```

The node data can be ingested into Kuzu using `MERGE` commands as follows:
```py
res = conn.execute(
    """
    LOAD FROM './data/scholars.csv' (header=true)
    MERGE (s:Scholar {name: name})
    SET s.prize = category, s.year = year, s.is_laureate = is_laureate
    RETURN COUNT(s) AS num_scholars
    """
)
print(f"Merged {res.get_as_pl()['num_scholars'][0]} scholar nodes into the database")
```

The relationship data can also be ingested using similar means:
```py
res = conn.execute(
    """
    LOAD FROM './data/mentorships.csv' (header=true)
    MATCH (s1:Scholar {name: mentor}), (s2:Scholar {name: mentee})
    MERGE (s1)-[:MENTORED]->(s2)
    RETURN COUNT(*) AS num_mentorships
    """
)
print(f"Merged {res.get_as_pl()['num_mentorships'][0]} mentorship relationships into the database")
```
Once the code is run, the following output will be produced:
```
Merged 3384 scholar nodes into the database
Merged 5657 mentorship relationships into the database
```

The resulting graph can be visualized using [Kuzu Explorer](/visualization/kuzu-explorer),
and shows rich connections between scholars who mentored one another.

<img src="/img/graph-algorithms/mentorship-graph.png" />

Now that the mentorship graph is created, we're ready to run graph algorithms on it!

## Method 1: Kuzu `algo` extension

The first method to run a graph algorithm in Kuzu is using the Kuzu `algo` extension, which
runs algorithms natively on a Kuzu subgraph. First, we create a new connection to the Kuzu
database file `example.kuzu` and install and load the `algo` extension.

#### Install and load the extension

```py
import kuzu

db_path = "example.kuzu"

db = kuzu.Database(db_path)
conn = kuzu.Connection(db)

# Install and load the Kuzu algo extension
conn.execute("INSTALL algo; LOAD algo;")
```

#### Project a subgraph

When using the `algo` extension in Kuzu, graph algorithms run
on a [projected subgraph](/extensions/algo/#projected-graphs).
The parameters to the `project_graph` function include the name of the subgraph,
the node labels to include, and the relationship types to include.

```py
conn.execute("CALL project_graph('MentorshipGraph', ['Scholar'], ['MENTORED']);")
```
#### Run PageRank algorithm

We run the PageRank algorithm on the projected subgraph and collect the results in a Polars DataFrame
(you can do the same via Pandas DataFrames if you wish).
```py
# Run PageRank on the projected graph
res = conn.execute(
    """
    CALL page_rank('MentorshipGraph')
    RETURN node.name AS name, rank AS pagerank
    """
)
# Get the PageRank results in a Polars DataFrame
pagerank_df = res.get_as_pl()
```

#### Write algo results to Kuzu

The above steps computed the PageRank metrics for the nodes, but didn't persist them to the Kuzu database.
To do this, we'll use the `pagerank_df` DataFrame to write the PageRank scores to the `Scholar` node table.

To ingest the data back in, we need to first run the the `ALTER TABLE` command to add a new column
`pagerank` to the `Scholar` node table.

```py
# Update Kuzu database with PageRank metric values
# First, add a new column pagerank to the Scholar node table
conn.execute("ALTER TABLE Scholar ADD IF NOT EXISTS pagerank DOUBLE DEFAULT 0.0")
```

We can then `MERGE` the scholar names from the DataFrame (which will match on the existing `name` value
in the `Scholar` node table) and persist the PageRank scores to the node table.

```py
conn.execute(
    """
    LOAD FROM pagerank_df
    MERGE (s:Scholar {name: name})
    SET s.pagerank = pagerank
    """
)
print("Finished adding graph algorithm metric scores to Kuzu database")
```

We can test that the results were ingested correctly in Kuzu by running the following Cypher
query:

```py
res = conn.execute(
    """
    MATCH (s:Scholar)
    WHERE s.prize = "Physics"
    RETURN s.name, s.pagerank
    ORDER BY s.pagerank DESC LIMIT 5
    """
)
print(res.get_as_pl())
```

The following result is obtained:

```table
┌────────────────────────┬────────────┐
│ s.name                 ┆ s.pagerank │
│ ---                    ┆ ---        │
│ str                    ┆ f64        │
╞════════════════════════╪════════════╡
│ Adam Riess             ┆ 0.00083    │
│ Nicolaas Bloembergen   ┆ 0.000696   │
│ Heike Kamerlingh Onnes ┆ 0.00056    │
│ Claude Cohen-Tannoudji ┆ 0.000456   │
│ Chen-Ning Yang         ┆ 0.000455   │
└────────────────────────┴────────────┘
```

The query below can be run in Kuzu Explorer to visualize the tree structure that led to the
person with the highest PageRank score:

```py
MATCH (a:Scholar)-[r*1..10]-(b) where a.name = "Adam Riess"
RETURN * limit 10
```

<img src="/img/graph-algorithms/pagerank-result.png" />

Adam Reiss, who has the highest PageRank score, has notable academic ancestors such as Kip Thorne,
John Wheeler, Niels Bohr, going all the way back to Ernest Rutherford and J.J. Thomson!
The high PageRank score for Adam Riess can be
attributed to his presence in a part of the network that has a lot of other influential scholars, like
Niels Bohr, Ernest Rutherford, J.J. Thomson, Edward Teller and Linus Pauling.

---

## Method 2: NetworkX

We can also run graph algorithms via NetworkX. This involves transforming a Kuzu subgraph into
a NetworkX graph object, running the algorithm on it, and then writing the results back to Kuzu.

:::note[Note]
Running a graph algorithm in NetworkX will be slower than using Kuzu's `algo` extension, due to
additional overhead in dealing with Python objects, but NetworkX can be a useful fallback when
you want to run a graph algorithm that's not yet supported in Kuzu. It's trivial to transform
a NetworkX algorithm result into a Pandas/Polars DataFrame and write it back to Kuzu.
:::

First, obtain a connection to the existing `example.kuzu` database:

```py
import kuzu

db_path = "example.kuzu"

db = kuzu.Database(db_path)
conn = kuzu.Connection(db)
```

#### Create a NetworkX graph

The first step is to extract a subgraph from Kuzu and convert it to a NetworkX graph object.

```py
# Convert a Kuzu subgraph to a NetworkX graph
res = conn.execute(
    """
    MATCH (a:Scholar)-[b:MENTORED]->(c:Scholar)
    RETURN *
    """
)
nx_graph = res.get_as_networkx()
```

We can then run the PageRank algorithm on the NetworkX graph as follows:

```py
import networkx as nx
import polars as pl

pageranks = nx.pagerank(nx_graph)
# NetworkX prefixes the node label to the results
# This step cleans up the naming so that we can import it back into Kuzu
pagerank_df = (
    pl.DataFrame({"name": k, "metric": v} for k, v in pageranks.items())
    .with_columns(pl.col("name").str.replace("Scholar_", "").alias("name"))
)
```
The results from NetworkX are transformed into a Polars DataFrame and the columns
are renamed appropriately, to match with the node table's columns in Kuzu.

#### Write NetworkX results to Kuzu

To ingest the data back in, we need to first run the the `ALTER TABLE` command to add a new column
`pagerank` to the `Scholar` node table. This is followed by scanning the data from the Polars
DataFrame and merging the results into the `Scholar` node table.

```py
# Update Kuzu database with PageRank metric values
# First, add a new column pagerank to the Scholar node table
conn.execute("ALTER TABLE Scholar ADD IF NOT EXISTS pagerank DOUBLE DEFAULT 0.0")

conn.execute(
    """
    LOAD FROM pagerank_df
    MERGE (s:Scholar {name: name})
    SET s.pagerank = metric
    """
)
print("Finished adding graph algorithm metric scores to Kuzu database")
```

We can test that the results were ingested correctly in Kuzu by running the following Cypher
query:

```py
# Query scholars with the highest PageRank scores who won Nobel prizes in Physics 
res = conn.execute(
    """
    MATCH (s:Scholar)
    WHERE s.prize = "Physics"
    RETURN s.name, s.pagerank
    ORDER BY s.pagerank DESC LIMIT 5
    """
)
print(res.get_as_pl())
```

The same results as [above](#write-algo-results-to-kuzu) (when using the `algo` extension) are obtained.

```table
┌────────────────────────┬────────────┐
│ s.name                 ┆ s.pagerank │
│ ---                    ┆ ---        │
│ str                    ┆ f64        │
╞════════════════════════╪════════════╡
│ Adam Riess             ┆ 0.001657   │
│ Nicolaas Bloembergen   ┆ 0.001402   │
│ Heike Kamerlingh Onnes ┆ 0.001153   │
│ Claude Cohen-Tannoudji ┆ 0.00092    │
│ Chen-Ning Yang         ┆ 0.000913   │
└────────────────────────┴────────────┘
```

#### Run any other algorithm in NetworkX

You can just as easily run any other algorithms supported by NetworkX. The example below shows the results
of a betweenness centrality algorithm run on the same graph.

```py
# Run betweenness centrality
bc_results = nx.betweenness_centrality(nx_graph)
# NetworkX prefixes the node label to the results
# This step cleans up the naming so that we can import it back into Kuzu
betweenness_centrality_df = (
    pl.DataFrame({"name": k, "metric": v} for k, v in bc_results.items())
    .with_columns(pl.col("name").str.replace("Scholar_", "").alias("name"))
)
```

The following command adds a new column `betweenness_centrality` to the `Scholar` node table.
```py
conn.execute("ALTER TABLE Scholar ADD IF NOT EXISTS betweenness_centrality DOUBLE DEFAULT 0.0")
```
We can write the results back to the Kuzu database as before:
```py
conn.execute(
    """
    LOAD FROM betweenness_centrality_df
    MERGE (s:Scholar {name: name})
    SET s.betweenness_centrality = metric
    """
)
print("Finished adding graph algorithm metric scores to Kuzu database")
```

The query below shows the top 5 Physics laureates with the highest betweenness centrality scores, and
the number of mentors and mentees for each of them.
```py
res = conn.execute(
    """
    MATCH (s:Scholar),
          (a:Scholar)-[:MENTORED]->(s)-[:MENTORED]->(b:Scholar)
    WHERE s.prize = "Physics"
    AND a.is_laureate = true
    AND b.is_laureate = true
    RETURN
      s.name,
      s.betweenness_centrality,
      COUNT(DISTINCT a) AS num_mentors,
      COUNT(DISTINCT b) AS num_mentees
    ORDER BY s.betweenness_centrality DESC LIMIT 5
    """
)
print(res.get_as_pl())
```

As can be seen, some well-known Physics Nobel laureates emerge as key players based on their
betweenness centrality scores.

```table
┌─────────────────┬──────────────────────────┬─────────────┬─────────────┐
│ s.name          ┆ s.betweenness_centrality ┆ num_mentors ┆ num_mentees │
│ ---             ┆ ---                      ┆ ---         ┆ ---         │
│ str             ┆ f64                      ┆ i64         ┆ i64         │
╞═════════════════╪══════════════════════════╪═════════════╪═════════════╡
│ Joseph Thomson  ┆ 0.00254                  ┆ 1           ┆ 11          │
│ Max Born        ┆ 0.002367                 ┆ 1           ┆ 8           │
│ Niels Bohr      ┆ 0.00179                  ┆ 2           ┆ 10          │
│ Robert Millikan ┆ 0.00082                  ┆ 2           ┆ 2           │
│ Wolfgang Pauli  ┆ 0.000654                 ┆ 2           ┆ 1           │
└─────────────────┴──────────────────────────┴─────────────┴─────────────┘
```

## Conclusions

By using a centrality metrics like PageRank and betwenness centrality to analyze the neighbourhood of nodes in the mentorship graph of Nobel laureates and scholars, we were able to gain new insights without much prior knowledge of
the data. This demonstrates the power of graph algorithms and network analysis in uncovering insights from
complex data.

For performance and scalability, it's recommended to use Kuzu's native `algo` extension if your algorithm of choice
is available. If not, you can always fall back to using NetworkX, which has a far more extensive suite of
graph algorithms.

To reproduce the analysis shown in this tutorial, see the code
[here](https://github.com/kuzudb/tutorials/tree/main/src/network_analysis).
