
# Motivation for RDF Graphs

[Resource Description Framework](https://www.w3.org/RDF/) (RDF) along with property graphs 
are the two graph-based data models that are commonly used
in practice. Kùzu's structured property graph model is very close to the relational model: 
you structure your records into tables as in the relational model, but 
explicitly separate them as node tables and relationship tables. 
RDF, instead, is particularly suitable for more flexible knowledge/information representation.[^1] 
All information is encoded in the form of (subject, predicate, object) statements/facts 
that are referred to as *triples*.

[^1]: RDF is more than a data model as understood by database practitioners. There is a set of
standards around RDF, such as [RDF Schema](https://www.w3.org/TR/rdf-schema/) and [OWL](https://www.w3.org/OWL/), 
which contain a predefined set of vocabulary that can be used to describe the "meaning" of 
other vocabulary used in triples and automatically infer new triples (called inference). 

Kùzu's RDFGraphs is a lightweight extension to Kùzu's data model that allows ingesting triples natively into Kùzu, so
that they can be queried using Cypher.

* It is a data model extension, because along with node and relationship
tables, you can create RDFGraphs and ingest triples into RDFGraphs as a unit. 
* It is lightweight, because an RDFGraph is simply a wrapper around
two node and two relationship tables that acts as a new object in Kùzu's data model. 

For example, you can `CREATE/DROP RDFGraph  <rdfgraph-name>` to create or drop an RDFGraph, which will 
create or drop **four** underlying tables
(see [this section](./rdfgraphs-overview#rdfgraphs-mapping-of-triples-to-property-graph-tables)
for more details on what these tables are).
Importantly, you can then query these underlying tables with Cypher. 
RDFGraphs are therefore a specific mapping of your triples into 
Kùzu's native property graph data model, so you can query
them with Cypher, Kùzu's native query language. This way, you can benefit from Kùzu's easy, scalable and
fast querying capabilities (instead of SPARQL, which is the standard query language to query over RDF triples).

