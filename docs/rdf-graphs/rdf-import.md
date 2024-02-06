---
title: RDF Data Import
sidebar_position: 3
---

# Overview

Kùzu currently supports bulk importing triples into RDFGraphs through [RDF Turtle (ttl)](https://www.w3.org/TR/turtle/) files.
Triples can also be ingested through `CREATE` statements. See the 
section on CREATE and DELETE statements in the [RDFGraphs Overview and Cypher Clauses](./rdfgraphs-overview#create-and-delete-statements-to-modify-rdfgraphs)
for how to ingest triples through `CREATE` statements.

## RDF Data Import From Turtle Files Using COPY FROM
Turtle files represent triples in the following format: 
```
@prefix ex: <http://example.org/#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rel: <http://www.perceive.net/schemas/relationship/> .

ex:green-goblin
    rel:enemyOf ex:spiderman ;
    rel:enemyOf _:super-character-1 ;
    rel:enemyOf _:super-character-2 ;
    a foaf:Person ;    # in the context of the Marvel universe
    foaf:name "Green Goblin" .

ex:spiderman
    rel:enemyOf ex:green-goblin ;
    rel:friendOf _:super-character-1 ;
    a foaf:Person ;
    foaf:name "Spiderman", "Человек-паук"@ru .
```
This file, copy-pasted from the original [Turtle specification](https://www.w3.org/TR/turtle/) contains 7 triples, 5 with ex:green-goblin as the subject and 
5 with ex:spiderman as the subject. It also demonstrates a few features of RDF and Turtle files:
- `a` predicate is shorthand for `rdf:type`.
- The use of `;` to separate triples with the same subject (e.g., the 4 triples of ex:green-goblin are separated with `;`).
- The use of `,` to separate multiple objects for the same predicate (the last two triples are <ex:spiderman, foaf:name, "Spiderman"> and <ex:spiderman, foaf:name, "Человек-паук"@ru>.

Please see Turtle specification for more details on the formats of Turtle files.

You can bulk-insert Turtle files using COPY FROM command. Assuming the above file is stored in "${PATH-TO-DIR}/turtle-ex.ttl" file
and your RDFGraph is called TurtleEx, you can do this as follows:
```
COPY TurtleEx FROM "${PATH-TO-DIR}/turtle-ex.ttl";
``` 

Similar to importing multiple CSV or Parquet files, you can also import multiple turtle files by specifying a glob pattern. 
For example, you can import all the turtle files in the "${PATH-TO-DIR}" directory as follows:
```
COPY TurtleEx FROM "${PATH-TO-DIR}/*.ttl";
```
Please refer to the [COPY FROM MULTIPLE CSV Files](https://kuzudb.com/docusaurus/data-import/csv-import#copy-from-multiple-csv-files-to-a-single-table) section for details.

#### Full IRIs, Prefixes, and Relative IRIs
TODO(Semih): Complete this section.

#### Malformed Triples
If your Turtle file contains malformed triples, e.g., if the subject, predicate, or object is not a valid IRI,
Kùzu will skip the rest of "chunk" of triples after the first malformed triple. For example:
```
@prefix ex: <http://example.org/#> .
@prefix rel: <http://www.perceive.net/schemas/relationship/> .

ex:spiderman
    rel:enemyOf ex:green-goblin ;
    <foo<bar> _:batman ;
    <foobar> ex:superman .
    
ex:green-goblin
    rel:enemyOf ex:spiderman .
```
In this example the `<foo<bar>` is an invalid IRI, so Kùzu's Turtle parser will 
parse the first triple <`ex:spiderman`, `rel:enemyOf`, `ex:green-goblin`> that comes before it 
but skips the rest of the chunk of triples about `ex:spiderman`. 
The second chunk, which contains the single triple <`ex:green-goblin`, `rel:enemyOf`, `ex:spiderman`> 
will also be inserted. 

### Blank Nodes
Blank nodes in Turtle files appear in the file with the `_:` prefix. For example,
the above example contains 2 blank nodes: "_:super-character-1" and "_:super-character-2". When
Kùzu assigns blank nodes in Turtle files an IRI of the form: `_:b-<generated-hash>`. If you had blank nodes
your triples, you will see such generated IRIs when you query your triples.

### Language Tag for Literals and Size Limitation
RDF Literals consist of a data type, a value, and an optional language tag. Currently,
For example, the above example Turtle file
contains the following triple: (`http://example.org/#spiderman`, foaf:name, "Человек-паук"@ru). The object here
is an RDF Literal with data type string, value "Человек-паук", and language tag @ru, to indicate
that it is Russian. Kùzu ignores the language tags when inserting RDF Literals, so when you query this triple, you will not see the language tag:
```sql
WITH "http://xmlns.com/foaf/0.1/" as foaf, "http://example.org/" as ex
MATCH (s {iri: ex + "spiderman"})-[p:TurtleEx {iri: foaf + "name"}]-(o) 
RETURN s.iri, p.iri, o.val;
Output:
--------------------------------------------------------------------------------
| s.iri                        | p.iri                          | o.val        |
--------------------------------------------------------------------------------
| http://example.org/spiderman | http://xmlns.com/foaf/0.1/name | Spiderman    |
--------------------------------------------------------------------------------
| http://example.org/spiderman | http://xmlns.com/foaf/0.1/name | Человек-паук |
--------------------------------------------------------------------------------
```

Further, there is currently a size limitation that your literal strings can be of size 256KB in characters.
If you are storing longer text, we will truncate them during ingesting your literals.

### Converting Other RDF Files to Turtle and Validating Turtle File

If you have RDF files in formats other than Turtle, such as [NTriples](https://www.w3.org/TR/n-triples/), 
[RDF/XML](https://www.w3.org/TR/rdf-syntax-grammar/), or [JSON-LD](https://www.w3.org/TR/json-ld11/), 
currently you need to convert them to Turtle to ingest them into Kùzu.
Here are just a few pointers to some tools that you can use for this purpose:

- [RDF Tools](https://rdftools.ga.gov.au/convert): A web interface tool that uses RDFLib Python library (see below).
- [RDFLib](https://pypi.org/project/rdflib/): A Python library that can be used to convert RDF files to Turtle.
- [EasyRDF](https://www.easyrdf.org/converter): Another web interface tool.
- [Serd](https://github.com/drobilla/serd): a lightweight C library that supports parsing and writing RDF triples
in several formats.

You can also use this tool by W3C to validate your Turtle files: [Validata](https://www.w3.org/2015/03/ShExValidata/).
This is in fact an advanced tool to validate RDF files against a Shape Expression (ShEx) schema, 
but it can also validate general errors in your Turtle files.

Note that the above information is merely pointers to a few useful tools online for reference only.
Please use them at your own discretion. There are many other tools and libraries you can use for similar purposes.
