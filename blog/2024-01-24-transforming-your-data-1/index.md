---
slug: transforming-your-data-to-graphs-1
authors: 
  - prashanth
tags: [use-case]
---

import RelationalSchema from './transforming_data_relational_schema.png';
import GraphSchema from './transforming_data_graph_schema.png';
import EdgeTables from './transforming_data_edge_tables.png';
import GraphSchemaViz from './transforming_data_schema_viz.png';
import GraphDataViz from './transforming_data_graph_viz.png';

# Transforming your data to graphs: ETL

Ever since the birth of database management systems (DBMSs), tabular relations and graphs have been
the core data structures used to model application data in two broad classes of systems:
Relational (RDBMS) and Graph (GDBMS).

In this post, we'll look at how to transform data that might exist in a typical relational system
to a graph and load it into a Kùzu database. The aim of this post and the next one is to showcase
"graph thinking"[^1], where you explore existing connections in your data, and how it can potentially
help uncover new insights.

<!-- truncate -->

## When are graphs useful?

A lot of existing enterprise data is in the form of relational tables. In RDBMSs, connections
between entities are often implicitly defined by the schema of the tables via foreign key
constraints.

In many cases, graphs are the most natural data structures to represent structured data by defining
*explicit* relationships between entities. While the relational data model requires strict
schematization of the data, graph models provide more flexibility, especially when storing sparse
data.

SQL is suitable to express a variety of standard data analytics tasks, but it is arguably not as
suitable when it comes to expressing queries with recursive or many-to-many joins. Graph queries
in a well-designed GDBMS like Kùzu contain specialized syntaxes and operators for these types of
query workloads.

:::info Note
It's important to understand that *data itself* doesn't exist as graphs, tables, arrays and so on.
These are just different ways of representing and storing the data. It's completely up to the
developer to choose the right data structure depending on the question being answered.
:::

## Extract, Transform, Load (ETL)

The dataset we'll use in this post involves a set of merchants, customers and transactions[^2]. The
goal is to study the transactions and their relationships using graph queries.

### Relational schema

We can imagine this dataset as it exists in a typical relational system. The schema might look
something like this:

<div class="img-center">
<img src={RelationalSchema}/>
</div>

The client table stores unique client IDs and their metadata. The merchant table stores unique
instances of merchants and what parent company they belong to. Transaction data is stored in the
transaction table, which shows the transaction ID, the client ID, the merchant ID, the amount
of the transaction and when it occurred. Company and city tables exist to store metadata about
the parent companies and cities where the merchants are located. The connectivity between the
tables is expressed via foreign key constraints.

### Graph schema

While the relational schema is useful for rapidly storing transactional data and for performing
aggregate queries, it's not as useful when it comes to answering questions about the relationships
in the data. Some such questions are listed below:

1. What cities have the most merchant transactions?
2. Which companies have the most merchants?
3. Which company does the merchant with the most transactions belong to?

With these in mind, we can proceed to sketch the following graph schema, which is a visual
representation of the data model that considers how the concepts are connected in the real world.

<div class="img-center">
<img src={GraphSchema}/>
</div>

In the above schema, we choose to model the transaction table as an edge rather than as a node,
because it showcases the relationship between a client and a merchant. The transaction amount and
time stamp is stored as a property on the edge.

### Transforming relational data to graphs

One of the key features of Kùzu is that it's a columnar, schema-based graph database, making it
highly convenient to read data that exists in relational systems. Like RDBMSs, Kùzu also relies
on strongly-typed values in columns and uses primary key constraints on tables to model the data.
The only difference is that Kùzu uses separate node and edge tables, which we'll show how to
create below.

For simplicity, we'll assume that the tables shown in the relational schema above are available
as CSV files in the `data` directory. The `load_data.py` script will transform and load the
data into a Kùzu database, while the `query.py` file will run some simple queries to test that
the load was successful.

```bash
.
├── data
│   ├── client.csv
│   ├── city.csv
│   ├── company.csv
│   ├── disputed_transaction.csv
│   ├── merchant.csv
│   └── transaction.csv
├── load_data.py
└── query.py
```

### Node files

The data in the `client.csv`, `city.csv`, `company.csv` and `merchant.csv` files are already in the
right tabular form for Kùzu to load them as node tables. We can create the tables as follows:

```py
import kuzu

def create_client_node_table(conn: kuzu.Connection) -> None:
    conn.execute(
        """
        CREATE NODE TABLE
            Client(
                client_id INT64,
                name STRING,
                age INT64,
                PRIMARY KEY (client_id)
            )
        """
    )

def create_city_node_table(conn: kuzu.Connection) -> None:
    conn.execute(
        """
        CREATE NODE TABLE
            City(
                city_id INT64,
                city STRING,
                PRIMARY KEY (city_id)
            )
        """
    )

def create_company_node_table(conn: kuzu.Connection) -> None:
    conn.execute(
        """
        CREATE NODE TABLE
            Company(
                company_id INT64,
                type STRING,
                company STRING,
                PRIMARY KEY (company_id)
            )
        """
    )

def create_merchant_node_table(conn: kuzu.Connection) -> None:
    conn.execute(
        """
        CREATE NODE TABLE
            Merchant(
                merchant_id INT64,
                company_id INT64,
                city_id INT64,
                PRIMARY KEY (merchant_id)
            )
        """
    )
```

Note that `PRIMARY KEY` constraints are required on every node table in Kùzu, as they are used to
ensure that edges are always created on unique node pairs. In this case, we use the `client_id`,
`city_id`, `company_id` and `merchant_id` columns as the primary keys for each respective table.

### Edge files

The graph schema we designed above requires us to add new CSV files that represent the edges in
the graph. We'll create the following edge files:

- `transacted_with.csv`: connects a client to a merchant
- `has_instance.csv`: connects a company to a merchant
- `located_in.csv`: connects a merchant to a city

We first define the empty table schemas using the `FROM` and `TO` keywords that indicate the
direction of the edge. The names of the tables: `TransactedWith`, `HasInstance` and `LocatedIn`
are the relationship type.

```py
def create_edge_tables(conn: kuzu.Connection) -> None:
    conn.execute(
        """CREATE REL TABLE TransactedWith(
                FROM Client TO Merchant,
                amount_usd FLOAT,
                timestamp TIMESTAMP
            )
        """)
    conn.execute("CREATE REL TABLE LocatedIn(FROM Merchant TO City)")
    conn.execute("CREATE REL TABLE HasInstance(FROM Company TO Merchant)")
```

In the above code, only `TransactedWith` edges have metadata associated with them, namely the
transaction amount and the timestamp. The other two edges don't have metadata and are simply
used to connect the nodes based on the values that match a primary key constraint.

An example is shown below. Consider the node tables `client.csv` and `transaction.csv` as follows:

<div class="img-center">
<img src={EdgeTables}/>
</div>

A simple transformation function can convert the transaction table into the `TransactedWith` edge
table as follows:

```py
def create_transaction_edge_file(data_path: str | Path) -> None:
    """
    Transform transaction.csv into transacted_with.csv edge file
    with the correct headers.
    """
    data_path = format_path(data_path)
    with open(data_path / "transaction.csv") as transaction:
        transaction_reader = csv.reader(transaction)
        next(transaction_reader, None)  # skip the headers
        with open(data_path / "transacted_with.csv", "w") as transaction_edges:
            
            transaction_edges_writer = csv.writer(transaction_edges)
            colnames = ["from", "to", "amount_usd", "timestamp"]
            transaction_edges_writer.writerow(colnames)

            for row in transaction_reader:
                transaction_edges_writer.writerow(row[1:])
    print(f"Created edge file '{data_path}/transacted_with.csv'")
```

We create a new CSV file `transacted_with.csv` with the headers `from`, `to`, `amount_usd` and
`timestamp`. We can apply similar functions to create the `located_in.csv` and `has_instance.csv`
files as well.

This completes the transformation of the relational data model to a graph data model!

## Building the graph

Collecting all the above functions, we can write a script that performs the following:

1. Transform node/edge tables as needed
1. Create the node tables
1. Create edge tables
2. Load the node tables into the database
3. Load the edge tables into the database

In Python, it would look something like this:

```py
def main() -> None:
    data_path = "./data"
    conn = kuzu.connect("transaction_db")
    # Create edge table files from existing data
    create_transaction_edge_file(data_path)
    create_merchant_instance_edge_file(data_path)
    create_merchant_city_edge_file(data_path)

    # Ingest nodes
    create_node_tables(conn)
    conn.execute(f"COPY Client FROM '{data_path}/client.csv' (header=true);")
    conn.execute(f"COPY City FROM '{data_path}/city.csv' (header=true);")
    conn.execute(f"COPY Company FROM '{data_path}/company.csv' (header=true);")
    conn.execute(f"COPY Merchant FROM '{data_path}/merchant.csv' (header=true);")
    print("Successfully loaded nodes into KùzuDB!")

    # Ingest edges
    create_edge_tables(conn)
    conn.execute(f"COPY TransactedWith FROM '{data_path}/transacted_with.csv' (header=true);")
    conn.execute(f"COPY LocatedIn FROM '{data_path}/located_in.csv' (header=true);")
    conn.execute(f"COPY HasInstance FROM '{data_path}/has_instance.csv' (header=true);")
    print("Successfully loaded edges into KùzuDB!")
```

The empty tables are first created, following which the `COPY <edge_table> FROM <file>` statement
writes the data into Kùzu's storage layer. Running the `main` function via a file named `load_data.py`
results in the graph being saved to a local directory named `transaction_db`.

```bash
$ python load_data.py
Created edge file 'data/transacted_with.csv'
Created edge file 'data/has_instance.csv'
Created edge file 'data/located_in.csv'
Successfully loaded nodes into KùzuDB!
Successfully loaded edges into KùzuDB!
```

## Querying the graph

We can now run some simple queries to test that the data was loaded correctly. Either create
a standalone script `query.py`, or fire up a [Kùzu CLI](https://kuzudb.com/docusaurus/getting-started/cli)
shell and run some Cypher queries.

We can run the following queries.

```sql
--- Which cities have the most merchant transactions?
MATCH (:Client)-[t:TransactedWith]->(m:Merchant)-[:LocatedIn]->(city:City)
RETURN city.city as city, COUNT(t) AS numTransactions
ORDER BY numTransactions DESC LIMIT 5;
```

The result looks correct, if you inspect the raw data.

city | numTransactions
:---: | :---:
Boston | 3
Miami | 1

We can also aggregate on node properties to answer questions like the following:

```sql
--- Which company type does the merchant with the most transactions belong to?
MATCH (:Client)-[t:TransactedWith]->(:Merchant)<-[:HasInstance]-(co:Company)
RETURN co.type as companyType, COUNT(t) AS numTransactions
ORDER BY numTransactions DESC LIMIT 1;
```

Restaurants are the most popular company type that people transact with in this small dataset.

companyType | numTransactions
:---: | :---:
restaurant | 3

Finally, we can answer a question at the company/merchant level with the following query:

```sql
--- Which companies have the most clients in Boston, and what is their average age?
MATCH (ci:City)<-[:LocatedIn]-(m:Merchant)
WHERE ci.city = "Boston"
WITH ci, m
MATCH (client:Client)-[:TransactedWith]-(m)<-[:HasInstance]-(co:Company)
RETURN co.company as company, AVG(client.age) AS avgAge
ORDER BY avgAge
```

company | avgAge
:---: | :---:
Starbucks | 31.00

Looks good!

## Visualization

Running Cypher queries in a shell editor is great for testing, but on occasion, obtaining visual
feedback is very useful in refining your data model. In a recent blog post, we introduced
[Kùzu Explorer](../2023-10-25-kuzuexplorer/index.md), a browser-based frontend that allows
you to visualize your graph data and run queries interactively.

It's currently only accessible via Docker, but a standalone application is on the way. To visualize
the graph you just created, ensure you have Docker installed, and run the following command:

```bash
# Ensure you use absolute paths when mounting the database
docker run -p 8000:8000 \
        -v /absolute/path/to/transaction_db:/database \
        --rm kuzudb/explorer:latest
```

You can then see a query editor in your browser at `http://localhost:8000`.

### Verify schema

In the Kùzu explorer window on the browser, click on the `Schema` tab on the top right.

<div class="img-center">
<img src={GraphSchemaViz}/>
</div>

The above schema is very similar to the one we designed earlier, which is a good sign!

### Visualize nodes and edges

The following query can be entered to visualize the graph.

```sql
MATCH (a)-[b]->(c)
RETURN * LIMIT 50;
```

The `RETURN *` keyword passes all the named variables in the query to the visualization engine which
then renders the graph as follows.

<div class="img-center">
<img src={GraphDataViz}/>
</div>

You can customize the visual style of the graph by clicking on the `Settings` tab on the top right.

## Conclusions

The aim of this blog post was to show how to transform data that might exist in a typical relational
system to a graph and load it into a Kùzu database. We also showed how to visualize the graph and
run some simple queries to test our data model.

What's important to take away from this exercise is that using a graph database like Kùzu for the
kinds of queries we ran above makes a **lot** of sense. The raw transaction data that may have been
sitting in an RDBMS system wasn't simple to reason about when it came to answering questions
about connected entities. Doing so in SQL would have required multiple joins and subqueries, whereas
the Cypher queries we wrote were more intuitive and easier to read. That being said, not all queries
benefit from a graph data model, and there are many cases where SQL and RDBMS are right tools for the job.

Another key takeaway is that designing a graph data model is an
*iterative* exercise. You may not get it right the first time, and that's okay! The key is to have
a good understanding of the data and the questions you want to answer, and to keep refining the
model as you learn more about the data. Using an embeddable solution like Kùzu is really helpful
in this regard, as you can quickly load the data and test your queries without having to worry
about setting up servers or authentication.

In the next post, we'll look at a larger dataset of a similar nature, to answer more complex
questions about disputed transactions. In the meantime, give [Kùzu](https://github.com/kuzudb/kuzu)
a try out on your own data, and begin thinking about whether knowledge graphs are a good fit for
your use case!

## Further reading

[^1]: *The Practitioners Guide to Graph Data*,
[Ch. 1](https://www.oreilly.com/library/view/the-practitioners-guide/9781492044062/ch01.html#ch1).
By Denise Gosnell & Matthias Broecheler, O'Reilly Media, Inc., 2020.
[^2]: *Graph Powered Machine Learning*,
[Ch. 2](https://livebook.manning.com/concept/graphs/transaction), By Alessandro Negro, Manning
Publications, 2021.
