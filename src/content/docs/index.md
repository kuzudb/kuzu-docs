---
title: Documentation
description: Documentation for Kùzu, an open source, embedded graph database that supports
template: doc
---

Welcome to the Kùzu docs!

<!-- Insert 3-min intro to Kùzu YT video embed here when it's ready -->

Kùzu is an embedded graph database built for query speed and scalability. It is optimized for
handling complex join-heavy analytical workloads on very large graphs, with the following core
feature set:

- Support for the two most popular graph data models: **Property Graph** and **RDF**
- Cypher query language
- Embedded (in-process) integration with applications
- Columnar disk-based storage
- Columnar, compressed sparse row-based (CSR) adjacency list/join indices
- Vectorized and factorized query processor
- Novel and very fast join algorithms
- Multi-core query parallelism
- Serializable ACID transactions

## Why Kùzu

Although there are many graph database management systems (GDBMSs) in the market today,
Kùzu stands apart because it addresses specific trade-offs via its design and implementation that
make it a compelling choice for analytical query workloads on large graphs.
Below, we list some of the key reasons why you may want to consider using Kùzu.

### Structured property graph model

The data model in Kùzu is based on the property graph model, with the addition of structure (including
node/edge tables and a pre-defined schema). This makes it flexible and intuitive to model your existing
data as a graph, while being highly suitable for vectorized operations.

### Cypher query language

Kùzu's query engine implements the Cypher query language and is based on the [openCypher](https://opencypher.org/) standard.
Cypher is a powerful and expressive query language that is easy to learn and use, and is designed
from the ground up to support a range of graph query patterns.

### Embedded (in-process) architecture

Because Kùzu is an embedded database, it runs in-process with the application layer, allowing for
simplicity in setup with no external dependencies and no hassles in managing DBMS servers.

### Interoperability

Kùzu is designed to be interoperable with a variety of external formats and columnar or relational stores,
including Parquet, Arrow, DuckDB and more. This allows you to easily move your existing data to and from Kùzu,
making it a great choice for graph data science, machine learning and analytics use cases.

### Performance

Kùzu is fast, efficient, and is built for query speed and scalability. It is optimized for
handling complex join-heavy analytical (OLAP) workloads on very large graphs. To achieve this, Kùzu uses a
variety of state-of-the-art techniques from database systems research, such as worst-case optimal joins and
factorization.

### Open source

Kùzu is open source and has a permissive [MIT license](https://github.com/kuzudb/kuzu?tab=MIT-1-ov-file#readme),
allowing you to easily get started building your commercial and proprietary applications on top of it.
