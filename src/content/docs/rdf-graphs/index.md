---
title: "Motivation for RDF Graphs"
---

Kùzu's **RDFGraphs** can be thought of as a lightweight extension to Kùzu's property graph data model
that allows ingesting triples natively into Kùzu, so that they can be queried using Cypher.

[Resource Description Framework](https://www.w3.org/RDF/) (RDF), along with property graphs,
are the most commonly used graph data models used in practice. Kùzu's _structured_ property graph
model is very close to the relational model:
you structure your records into tables as in the relational model, but
explicitly separate them as node tables and relationship tables.
RDF, instead, is particularly suitable for more flexible knowledge/information representation.[^1]
All information is encoded in the form of `(subject, predicate, object)` statements or facts
that are referred to as _triples_.

[^1]: RDF is more than just a data model as understood by database practitioners. There is a set of
standards around RDF, such as [RDF Schema](https://www.w3.org/TR/rdf-schema/) and [OWL](https://www.w3.org/OWL/),
which contain predefined vocabulary that can be used to describe the "meaning" of
other vocabulary terms used in triples so as to automatically infer new triples (this is called _inference_).

The terms "lightweight" and "extension" are elaborated in the context of Kùzu RDFGraphs below:

* It is a data model _extension_, because along with node and relationship
tables, you can create RDFGraphs and ingest triples into RDFGraphs as a unit.
* It is _lightweight_, because an RDFGraph is simply a wrapper around
two node and two relationship tables that acts as a new object in Kùzu's data model.

As an example, stating `CREATE/DROP RDFGraph <rdfgraph-name>` when creating or dropping an RDFGraph
will create or drop **four** underlying tables
(see [this section](./rdfgraphs-overview/#rdfgraphs-mapping-of-triples-to-property-graph-tables)
for more details on what these tables are).
RDFGraphs are therefore a specific mapping of your triples into
Kùzu's native property graph data model, so you can query
them with Cypher, Kùzu's native query language. This way, you can benefit from Kùzu's easy, scalable and
fast querying capabilities instead of resorting to SPARQL, which is the standard query language to
query over RDF triples in other systems.

---
