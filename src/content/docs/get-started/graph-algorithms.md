---
title: "Run graph algorithms"
---

One of the overarching goals of Kùzu is to function as the go-to graph database for data science
use cases. NetworkX is a popular library in Python for graph algorithms and data science. In this
section, we demonstrate Kùzu's ease of use in exporting subgraphs to the NetworkX format using the
`get_as_networkx()` function in the Python API. In addition, the following two capabilities are
demonstrated.

- Graph Visualization: We visualize subgraphs of interest via Kùzu explorer
- PageRank: We compute PageRank on an extracted subgraph, store these values back in Kùzu's node
tables and query them.

The dataset we will use for this exercise is the MovieLens dataset, available [here](https://github.com/kuzudb/kuzudb.github.io/tree/main/data/movielens-sm).
The small version of the dataset is used, which contains 610 user nodes, 9724 movie nodes, 100863
 rates edges, and 3684 tags edges. The schema of the dataset is shown below.

![](/src/assets/img/graph-algorithms/movie-schema.png)

You can download the dataset locally via wget.

```bash
wget https://kuzudb.com/data/movie-lens/movies.csv
wget https://kuzudb.com/data/movie-lens/users.csv
wget https://kuzudb.com/data/movie-lens/ratings.csv
wget https://kuzudb.com/data/movie-lens/tags.csv
```

Place the CSV files in a directory named `movie_data` in the same directory in which you want the
database to be stored.

## Insert data to Kùzu

The data is copied to a Kùzu database via the Python API as follows:

```py
import shutil

db_path = './ml-small_db'
shutil.rmtree(db_path, ignore_errors=True)

def load_data(connection):
    connection.execute('CREATE NODE TABLE Movie (movieId INT64, year INT64, title STRING, genres STRING, PRIMARY KEY (movieId))')
    connection.execute('CREATE NODE TABLE User (userId INT64, PRIMARY KEY (userId))')
    connection.execute('CREATE REL TABLE Rating (FROM User TO Movie, rating DOUBLE, timestamp INT64)')
    connection.execute('CREATE REL TABLE Tags (FROM User TO Movie, tag STRING, timestamp INT64)')

    connection.execute('COPY Movie FROM "./movies.csv" (HEADER=TRUE)')
    connection.execute('COPY User FROM "./users.csv" (HEADER=TRUE)')
    connection.execute('COPY Rating FROM "./ratings.csv" (HEADER=TRUE)')
    connection.execute('COPY Tags FROM "./tags.csv" (HEADER=TRUE)')

db = kuzu.Database(db_path)
conn = kuzu.Connection(db)
load_data(conn)
```

## Visualize subgraphs in Kùzu Explorer

You can visualize the data in Kùzu Explorer as shown in the [previous section](./cypher-intro.mdx).
An example is shown below.

```cypher
// Return the first two users, their movies and their ratings
MATCH (u:User)-[r:Rating]->(m:Movie)
WHERE u.userId IN [1, 2]
RETURN u, r, m LIMIT 100;
```

![](/src/assets/img/graph-algorithms/movie-subgraph.png)

## Export subgraph to NetworkX

You can extract only the subgraph between users and movies (ignoring tags) and convert it to a
NetworkX graph `G`. This assumes that the `network` package is installed via pip.

```py
# pip install networkx
res = conn.execute('MATCH (u:User)-[r:Rating]->(m:Movie) RETURN u, r, m')
G = res.get_as_networkx(directed=False)
```
We output an undirected graph as the direction doesn't matter for the PageRank algorithm.

## Compute PageRank

We can compute the PageRank of the subgraph `G` using NetworkX's `pagerank` function.

```py
pageranks = nx.pagerank(G)
```

The movie nodes' PageRanks along with their IDs can then be put into a Pandas DataFrame as follows:

```py
pagerank_df = pd.DataFrame.from_dict(pageranks, orient="index", columns=["pagerank"])
movie_df = pagerank_df[pagerank_df.index.str.contains("Movie")]
movie_df.index = movie_df.index.str.replace("Movie_", "").astype(int)
movie_df = movie_df.reset_index(names=["id"])
print(f"Calculated pageranks for {len(movie_df)} nodes\n")
print(movie_df.sort_values(by="pagerank", ascending=False).head())
```

```sh
Calculated pageranks for 9724 nodes

    id   pagerank
20  356  0.001155
232 318  0.001099
16  296  0.001075
166 2571 0.001006
34  593  0.000987
```

Similarly, we can store the PageRanks for the user nodes in a Pandas DataFrame the same way:

```py
user_df = pagerank_df[pagerank_df.index.str.contains("User")]
user_df.index = user_df.index.str.replace("User_", "").astype(int)
user_df = user_df.reset_index(names=["id"])
user_df.sort_values(by="pagerank", ascending=False).head()
```

## Write PageRank values back to Kùzu

To write the values back to Kùzu, first update the node table schemas to include a new property
`pagerank`.

```py
try:
  # Alter original node table schemas to add pageranks
  conn.execute("ALTER TABLE Movie ADD pagerank DOUBLE DEFAULT 0.0;")
  conn.execute("ALTER TABLE User ADD pagerank DOUBLE DEFAULT 0.0;")
except RuntimeError:
  # If the column already exists, do nothing
  pass
```

An important feature of Kùzu is its ability to natively scan Pandas DataFrames in a zero-copy
manner. This allows for efficient data transfer between your data in Python and Kùzu. The following
code snippet shows how this is done for the movie nodes.

```py
# Copy pagerank values to movie nodes
x = conn.execute(
  """
  LOAD FROM movie_df
  MERGE (m:Movie {movieId: id})
  ON MATCH SET m.pagerank = pagerank
  RETURN m.movieId AS movieId, m.pagerank AS pagerank;
  """
)
```

```sh
   movieId  pagerank
0  1        0.000776
1  3        0.000200
2  6        0.000368
3  47       0.000707
4  50       0.000724
```

The same can be done for the user nodes.

```py
# Copy user pagerank values to user nodes
y = conn.execute(
  """
  LOAD FROM user_df
  MERGE (u:User {userId: id})
  ON MATCH SET u.pagerank = pagerank
  RETURN u.userId As userId, u.pagerank AS pagerank;
  """
)
```

```sh
   userId  pagerank
0  1      0.000867
1  2      0.000134
2  3      0.000254
3  4      0.000929
4  5      0.000151
```

## Query PageRank values in Kùzu

You can run a query to print the top 20 pagerank movies to test that the upload worked:

```py
res1 = conn.execute(
    """
    MATCH (m:Movie)
    RETURN m.title, m.pagerank
    ORDER BY m.pagerank DESC LIMIT 5
    """
)
print(res1.get_as_df())
```

```sh
   m.title                           m.pagerank
```

```sh
     m.title                           m.pagerank
0    Forrest Gump (1994)               0.001155
1    Shawshank Redemption, The (1994)  0.001099
2    Pulp Fiction (1994)               0.001075
3    Matrix, The (1999)                0.001006
4    Silence of the Lambs, The (1991)  0.000987
```

And similarly, for the user nodes:

```py
res2 = conn.execute(
    """
    MATCH (u:User)
    RETURN u.userId, u.pagerank
    ORDER BY u.pagerank DESC LIMIT 5
    """
)
print(res2.get_as_df())
```

```sh
     u.userId  u.pagerank
0    599       0.016401
1    414       0.014711
2    474       0.014380
3    448       0.012942
4    610       0.008492
```

## Further work

You've now seen how to use NetworkX to run algorithms on a Kùzu graph, and move data back and
forth between Kùzu and Python.

There are numerous additional computations you can perform in NetworkX and store these results
in Kùzu. See the [tutorial notebook](https://colab.research.google.com/drive/1_AK-CHELz0fLAc2RCPvPgD-R7-NGyrGu)
on Google Colab to try it for yourself!