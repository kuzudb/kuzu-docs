---
id: home
title: Home
slug: /
sidebar_position: 0
---

# Documentation

Welcome to the Kùzu docs!

<!-- Insert 3-min intro to Kùzu YT video embed here when it's ready -->

Kùzu is an embedded graph database built for query speed and scalability. It is optimized for
handling complex join-heavy analytical workloads on very large databases, with the following core
feature set:

- Support for two popular graph data models: Property Graph model and RDF model
- Cypher query language
- Embedded (in-process) integration with applications
- Columnar disk-based storage
- Columnar sparse row-based (CSR) adjacency list/join indices
- Vectorized and factorized query processor
- Novel and very fast join algorithms
- Multi-core query parallelism
- Serializable ACID transactions
- High degree of interoperability with other data formats (Arrow, Numpy, DuckDB, etc.)

## Walkthroughs and tutorials

If you're new to Kùzu or graph databases in general, we recommend starting with the following sections:

- [Quickstart](./getting-started/quick-start/index.md): Learn how to work with Kùzu using any of our supported client APIs
- [Tutorials](./tutorials/index.md): Hands-on examples and use cases

## Visualization

Kùzu provides a stand-alone tool called Kùzu Explorer that allows you to interactively explore your
graph and visualize your data. See the following components of Kùzu Explorer to learn more:

- [Shell panel](./visualization/shell-panel.md): Interact with the database using Cypher queries
- [Schema panel](./visualization/schema-panel.md): View and manage the schema of your Kùzu database
- [Settings panel](./visualization/settings-panel.md): Configure and customize the appearance of your graphs

## Deep dive into Cypher

Kùzu implements Cypher, a high-level query language for the property graph data model, though we also
extend it to query RDF graphs as well. For users who have experience with graph data models, it may
be helpful to start with the following sections:

- [Data types](./cypher/data-types/)
- [Data definition](./cypher/data-definition/)
- [Functions and expressions](./cypher/expressions/)
- [Data manipulation clauses](./cypher/data-manipulation-clauses/)
- [Query clauses](/category/query-clauses)
- [RDFGraphs overview and Cypher clauses](./rdf-graphs/rdfgraphs-overview.md)

## Report issues

Kùzu is being actively developed by [Kùzu Inc.](https://kuzudb.com/#team). We track issues, feature
requests and discussions of our upcoming roadmap on GitHub, so enjoy your exploration of Kùzu and
report any bugs or feature requests you may have on [GitHub](https://github.com/kuzudb/kuzu/issues)!