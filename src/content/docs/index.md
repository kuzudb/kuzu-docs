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

- Supports property graphs and automatic mapping of RDF datasets to property graphs
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

### Performance and scalability

Kùzu is a state-of-the-art graph DBMS and is built by a core team of database experts who spent many years
doing academic research. Its design and implementation are based on a relentless focus towards
scalability and performance, with the founding engineers having co-authored several cutting-edge
technical papers and articles on managing and querying large-scale graphs.

### Usability

Kuzu is built for industry, and implements a suite of features that lower the barrier of entry
to modeling your records as a graph, so you can query those records in an expressive graph query
language (Cypher). Because Kùzu is an embedded database, it runs in-process with your application,
allowing for simplicity in setup with no external dependencies and no hassles in managing DBMS servers.

### Interoperability

Kùzu is designed to be highly interoperable with a variety of external formats and columnar or relational stores,
including Parquet, Arrow, DuckDB and more. This allows you to easily move your existing data to and from Kùzu,
making it a great choice for graph data science, machine learning and analytics use cases.

### Structured property graph model

The data model in Kùzu is based on the property graph model, with the addition of structure (including
node/edge tables and a pre-defined schema). This makes it flexible and intuitive to model your existing
data as a graph, while also being strict enough to optimize query performance and perform vectorized
operations at scale.

### Open source

Kùzu is open source and has a permissive MIT license, allowing you to easily get started building
your commercial and proprietary applications on top of it. While you check out
[the repo](https://github.com/kuzudb/kuzu) and try out Kùzu, consider giving us a star and spreading the word!
