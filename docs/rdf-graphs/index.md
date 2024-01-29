# Motivation for RDFGraphs

[RDF](https://www.w3.org/RDF/), along with property graphs, is the other graph-based data model that is commonly used
in practice. RDF is very different than the *structured* property graph data model supported by Kùzu, which is
very close to the relational model: you structure your records into tables as in the relational model but
explicitly separate them as node tables and relationship tables. RDF instead is a graph-based data model
that is particularly suitable for more flexible knowledge/information representation.  
As will be reviewed below, all information is encoded in the form of (subject, predicate, object) statements/fact that are
referred to as triples.

Kùzu's RDFGraphs is a lightweight extension to Kùzu's data model that allows ingesting triples natively into Kùzu, such
that they can be queried using Cypher. It is a data model extension because along with node and relationship
tables, you can create RDF Graphs, e.g., with `CREATE RDFGraph uwaterloo` statement, and buld ingest triples
into these RDFGraphs. It is a lightweight extension because an RDF Graph is simply a collection of
2 node and relationship tables that acts as a new object in Kùzu's data model that
can be created, dropped, and copied data into as a unit. For example you
can `CREATE/DROP RDFGraph universtiy` to create or drop an RDFGraph, which will create or drop four underlying
tables. You can  then query the underlying tables of RDFGraphs with Cypher. Therefore, RDFGraphs are a
specific mapping of your triples into Kùzu's native property graph data model, so you can query
them with Kùzu's native query language (instead of SPARQL, which is the standard
query language to query over RDF triples). This way,
for basic querying of your records, you can benefit from Kùzu's easy, scalable and fast querying capabilities.[^1]

[^1]: RDF and the other semantic web standards around it, such as RDF Schema and OWL are very powerful and
allow features, such as automatic inference, which RDFGraphs do not support.