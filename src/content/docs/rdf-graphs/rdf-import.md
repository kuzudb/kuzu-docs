---
title: RDF bulk data import
---

Kùzu currently supports bulk importing triples into RDFGraphs through [RDF Turtle (ttl)](https://www.w3.org/TR/turtle/) 
and [N-Triples (.nt)](https://www.w3.org/TR/n-triples/) files, which are a subset of Turtle files. Specifically,
N-Triples files are uncompressed versions of Turtle files where each triple is written out as a separate line
and without any prefix or base abbreviations in the IRIs. Triples can also be ingested through `CREATE` statements. See the 
section on CREATE and DELETE statements in the [previous page](/rdf-graphs/rdfgraphs-overview#modifying-rdfgraphs-using-create-set-merge-and-delete)
for how to ingest triples through `CREATE` statements.

**Note on importing N-Triples files:** N-Triples can be ingested
with the same `COPY FROM` commands and options as Turtle files, and do not require special handling.
That is why below we only cover the `COPY FROM` statement for importing triples from Turtle files.

## RDF Data import from Turtle files using `COPY FROM`

Turtle files represent triples in the following format:

```turtle
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

This file, copy-pasted from the original [Turtle specification](https://www.w3.org/TR/turtle/) contains 7 triples, 5 with `ex:green-goblin` as the subject and 
5 with `ex:spiderman` as the subject. It also demonstrates a few features of RDF and Turtle files:

- The predicate `a` is shorthand for `rdf:type`.
- The use of `;` to separate triples with the same subject (e.g., the 4 triples of `ex:green-goblin` are separated with `;`).
- The use of `,` to separate multiple objects for the same predicate (the last two triples are <`ex:spiderman`, `foaf:name`, `"Spiderman"`> and <`ex:spiderman`, `foaf:name`, `"Человек-паук"@ru`>.

Please see [official Turtle specification](https://www.w3.org/TR/turtle/) for more details on the format of Turtle files.

You can bulk-insert Turtle files using the COPY FROM command. Assuming the above file is stored in `${PATH-TO-DIR}/turtle-ex.ttl` file
and your RDFGraph is called TurtleEx, you can call:

```cypher
COPY TurtleEx FROM "${PATH-TO-DIR}/turtle-ex.ttl" (IN_MEMORY=true);
```

### Turtle configuration

Similar to CSV configuration, Turtle import configuration can be manually changed by specifying them inside `( )` at the end of the the `COPY FROM` command. 
Currently we support these options:

| Parameter           | Description                                                        | Default Value |
|:--------------------|:-------------------------------------------------------------------|:-----|
| IN_MEMORY           | Whether the entire file should be cached in memory during loading  | false|
| STRICT              | Whether malformed lines should be ignored                          | false| 

Setting `IN_MEMORY` to true makes loading faster because we currently go over the triples multiple times
during bulk loading. If you have enough memory to load all of the Turtle file into memory plus 
the additional memory that Kùzu will use during loading, you should set this option to true.
If you are ingesting a large Turtle file and you are running into memory issues, you can set `IN_MEMORY=false` or
leave it out of the `COPY FROM` command.

By default, Kùzu will ignore malformed lines during loading. Setting `STRICT=true` will make the system throw a runtime exception 
when a malformed line is encountered and stop loading.

### Importing multiple Turtle files

Similar to importing multiple CSV or Parquet files, you can also import multiple Turtle files by specifying a glob pattern. 
For example, you can import all the Turtle files in the `${PATH-TO-DIR}` directory as follows:

```cypher
COPY TurtleEx FROM "${PATH-TO-DIR}/*.ttl";
```

Refer to the [COPY FROM MULTIPLE CSV Files](https://docs.kuzudb.com/import/csv/#import-multiple-files-to-a-single-table) section for details.

### Full IRIs, prefixes and relative IRIs

IRIs in Turtle files can be specified in one of 3 ways:

- Full IRIs: are enclosed between angle brackets `<` and `>`: e.g., `<http:://fullIRI/#ex>`
- Relative IRIs: are also enclosed between angle brackets but start with "#" e.g., `<#baseIRIEx>`. These will resolve to `${baseIRI}#baseIRI`,
where `${baseIRI}` is the base IRI specified in the Turtle file with BASE or @base directives.
- Prefixed names: are not enclosed between angle brackets and are in the form of prefixlabel:localname, e.g., `kz:prefixIRIEx`, 
where the prefixlabel is prefixed with a prefix defined in the Turtle file with the PREFIX or @prefix directives.

The following example shows three triples. Only the first one will be ingested because the second and third triples 
contain malformed IRIs.

```turtle
@base <http://base-prefix/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<#baseIRIEx> foaf:prefixIRIEx <http://fullIRI/#ex>  .

#baseIRIEx foaf:prefixIRIEx <http://fullIRI/#ex> .

<#baseIRIEx> foo:prefixIRIEx <http://fullIRI/#ex> .
```

This will insert only the first triple as follows: < `http://base-prefix/#baseIRIEx`, `http://xmlns.com/foaf/0.1/prefixIRIEx`, `http://fullIRI/#ex` >.
In the second triple `#baseIRI` is malformed because it is not enclosed between angle brackets. 
In the third triple `foo:prefixIRIEx` is malformed because `foo` is not defined as a prefix in the Turtle file.

### Behavior during importing malformed triples in Turtle files

If your Turtle file contains malformed triples, e.g., if the subject, predicate, or object is not a valid IRI,
Kùzu will skip the rest of "chunk" of triples after the first malformed triple. A chunk is a set of
triples spearated by ";" grouped with the same subject. In the below example there are 2 chunks,
one for `ex:spiderman` and the other for `ex:goblin`. For example:

```turtle
@prefix ex: <http://example.org/#> .
@prefix rel: <http://www.perceive.net/schemas/relationship/> .

ex:spiderman
    rel:enemyOf ex:green-goblin ;
    <foo<bar> _:batman ;
    <foobar> ex:superman .
    
ex:green-goblin
    rel:enemyOf ex:spiderman .
```

In this example the `<foo<bar>` is an invalid IRI, so the Kùzu Turtle parser
parses the first triple <`ex:spiderman`, `rel:enemyOf`, `ex:green-goblin`> that comes before it
but skips the rest of the chunk of triples about `ex:spiderman`.
The second chunk, which contains the single triple <`ex:green-goblin`, `rel:enemyOf`, `ex:spiderman`>
will also be inserted.

You can also set copy configuration `(strict=true)` to throw exceptions and stop loading when a malformed line is detected
as described [above](#turtle-configuration).

### Blank nodes

Blank nodes in Turtle files can appear in one of two formats:

- Labeled Blank Nodes: appear in the file with the `_:opt-label` prefix. For example,
the example in the beginning of this page contains 2 blank nodes: `_:super-character-1` and `_:super-character-2`.
Kùzu assigns labeled blank nodes in Turtle files an IRI of the form: `_:iopt-label`, where i is an integers, 
such as `_:3super-character-1`. If you have blank nodes in
your triples, you will see such generated IRIs, which may not exist in the original Turtle files, when you query your triples.
- Unlabeled Blank Nodes: appear in the file with the `[]` syntax. assigns unlabeled blank nodes an IRI of the form `_:ibj`.
For example, the following example (copy-pasted from the original Turtle specification) 
contains two unlabeled blank nodes `_:0b1` and `_:0b2`:

```turtle
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

# Someone knows someone else, who has the name "Bob".
[] foaf:knows [ foaf:name "Bob" ] .
```

`_:0b2` is the nested blank node's IRI with triple`<_:0b2, foaf:name, "Bob">` and `_:0b1` is the IRI of 
the blank node that knows `_:0b2`:`<_:0b1, foaf:knows, _:0b2>`.

:::caution[Note]
You cannot use blank nodes as predicates in Turtle files according to Turtle standards. If you do, Kùzu will skip the triple.
:::

### Language tag for literals and size limitation
RDF Literals consist of a data type, a value, and an optional language tag.
For example, the example in the beginning of this page contains the following triple: (`http://example.org/#spiderman`, `foaf:name`, `"Человек-паук"@ru`). The object here
is an RDF Literal with data type string, value "Человек-паук", and language tag @ru indicating
that it is Russian. Kùzu loads the language tag into a separate `lang` property column.

```cypher
WITH "http://xmlns.com/foaf/0.1/" as foaf, "http://example.org/" as ex
MATCH (s {iri: ex + "spiderman"})-[p:TurtleEx {iri: foaf + "name"}]-(o) 
RETURN s.iri, p.iri, o.val, o.lang;
```

Output:
```
-----------------------------------------------------------------------------------------
| s.iri                        | p.iri                          | o.val        | o.lang |
-----------------------------------------------------------------------------------------
| http://example.org/spiderman | http://xmlns.com/foaf/0.1/name | Spiderman    |        |
-----------------------------------------------------------------------------------------
| http://example.org/spiderman | http://xmlns.com/foaf/0.1/name | Человек-паук | ru     |
-----------------------------------------------------------------------------------------
```

Further, there is currently a size limitation that your literal strings can be of size at most 256KB in characters.
If you are storing longer text, we will truncate them while ingesting your literals.

### Converting other RDF files to Turtle files and validating them

If you have RDF files in formats other than Turtle and N-Triples, such as 
[RDF/XML](https://www.w3.org/TR/rdf-syntax-grammar/) or [JSON-LD](https://www.w3.org/TR/json-ld11/), 
currently you need to convert them to Turtle to ingest them into Kùzu.
Below are several pointers to a few useful tools online for reference only.
Please use them at your own discretion. There are many other tools and libraries you can use for similar purposes.

- [RDF Tools](https://rdftools.ga.gov.au/convert): a web interface tool that uses RDFLib Python library (see below).
- [RDFLib](https://pypi.org/project/rdflib/): a Python library that can be used to convert RDF files to Turtle.
- [EasyRDF](https://www.easyrdf.org/converter): another web interface tool.
- [Serd](https://github.com/drobilla/serd): a lightweight C library that supports parsing and writing RDF triples
in several formats.

You can also use the [Validata](https://www.w3.org/2015/03/ShExValidata/) tool by W3C to validate your Turtle files.
This is an advanced tool to validate RDF files against a Shape Expression (ShEx) schema, 
but it can also validate general errors in your Turtle files.
