---
title: Example UniKG RDFGraph
---

Throughout the documentation on Kùzu's RDFGraph feature, we will use the following 
set of triples about students and faculty at universities, which we call `UniKG`.

<Image src="/src/assets/img/rdfgraphs/rdf-running-example.png" />

The DDL statements to define the RDFGraph, the [Turtle (.ttl) file](https://www.w3.org/TR/turtle/) 
containing the triples, and the data import (`COPY FROM`) commands
are given below. You can copy-paste and type these commands in the Kùzu CLI shell
or [KùzuExplorer](https://kuzudb.com/docusaurus/kuzuexplorer/) to replicate
the examples in this documentation locally.

## Creating the RDFGraph and Importing the Triples

```cypher
CREATE RDFGraph UniKG;
```

We will use the following 14 triples stored in a `uni.ttl` Turtle file:

```turtle
@prefix kz: <http://kuzu.io/rdf-ex#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

kz:Waterloo a kz:City ;
	    kz:name "Waterloo"@en ;
	    kz:population 150000 .

kz:Adam a kz:student ;
	kz:livesIn kz:Waterloo ;
	kz:name "Adam" ;
	kz:age	30 .

kz:student rdfs:subClassOf kz:person .

kz:Karissa a kz:student ;
	   kz:bornIn kz:Waterloo ;
	   kz:name "Karissa" .

kz:Zhang a kz:faculty ;
	 kz:name "Zhang" .

kz:faculty rdfs:subClassOf kz:person .
```

Data import. We assume `${PATH-TO-DIR}` is the directory containing `uni.ttl` file:

```cypher
COPY UniKG FROM "${PATH-TO-DIR}/uni.ttl";
```

You can double check that there are 14 triples with the following query:

```cypher
MATCH (s)-[p:UniKG]->(o) RETURN count(*);
```

Output:

```
----------------
| COUNT_STAR() |
----------------
| 14           |
----------------
```
