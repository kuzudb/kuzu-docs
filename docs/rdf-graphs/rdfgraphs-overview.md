---
title: RDFGraphs Overview & Cypher Clauses
sidebar_position: 2
---

import RDFRunningExample1 from './rdf-running-example.png';

The examples on this page use the below database, whose schema and data import commands are given [here](example-rdfgraph):

<div class="img-center">
<img src={RDFRunningExample1} style={{width: 800}} />
</div>

# RDFGraphs: Creating, Dropping, and Importing Data 

An RDFGraph is a lightweight extension to Kùzu's structured property graph data model
to natively ingest and query RDF triples. You can create an RDFGraph using the following command:

```
CREATE RDFGraph UniKG;
```

You can then ingest data into RDFGraphs using a `COPY FROM` command. For example,
the following will ingest the triples in the `uni.ttl` [Turtle file](https://www.w3.org/TR/turtle/) 
into the `UniKG` RDFGraph:

```
COPY UniKG FROM "${PATH-TO-DIR}/uni.ttl" (in_memory=true);
```
You can drop an RDFGraph using the following command:

```
DROP RDFGraph UniKG;
```

Note that you cannot alter RDFGraphs. You can only create or drop them.

## RDFGraphs Mapping of Triples to Property Graph Tables

Once you have imported your triples, you can query the triples with Cypher, Kùzu's query language. 
However, Cypher is not a query language that was designed for RDF. It assumes an underlying property graph data model. 
When you create an RDFGraph, Kùzu internally creates 2 node and 2 relationship tables.
When you then ingest your triples using the `COPY FROM` command, Kùzu maps the data in these triples into these
4 tables. That is, RDFGraphs are a virtual layer that wraps and gives a common name to these 4 tables.
To query your triples with Cypher, it is important to first understand this mapping.
The specifics of the mapping are as follows:
1. **Resources Node Table** — `UniKG_r(iri STRING, PRIMARY KEY (iri))`: Stores the [Resources](rdf-basics#resources-and-iris) (hence the `_r` suffix) in the triples. 
   Each unique IRI that appears in the subject, predicate, or object of triples is mapped to a separate `UniKG_r` node. 
   Note that even IRIs that appear only as predicates and never as objects or subjects in any triple are mapped to a `UniKG_r` resource node (e.g., 
   `rdf:type` in the example database). Resource nodes have a 
   single property, `iri`, which stores the IRI of the resource as a string.

2. **Literals Node Table** — `UniKG_l(id SERIAL, val VARIANT, PRIMARY KEY (id))`: Stores the [Literals](rdf-basics#rdf-literals) (hence the `_l` suffix) in the triples. 
   Each unique literal that appears in the triples is mapped to a separate `UniKG_l` node. Literals have a 
   single property, `val`, which stores the value of the literal as a [VARIANT data type](../cypher/data-types/variant)
   There is a second `id` property of type [SERIAL](../cypher/data-types/serial) which can be ignored. It is there to provide a primary key for the table. 

3. **Resource-to-Resource Triples Relationship Table** — `UniKG_rt(FROM UniKG_r, TO UniKG_r, iri STRING)`: Stores the triples between UniKG_r resources and 
   UniKG_r resources. `_rt` suffix stands for "**r**esource **t**riples", i.e., triples whose objects are resources. 
   The `FROM` and `TO` columns store the subject and object resources in the triple. The `iri` property stores the IRI of the predicate of the triple.
4. **Resource-to-Literal Triples Relationship Table** — `UniKG_lt(FROM UniKG_r, TO UniKG_l, iri STRING)`: Stores the triples between UniKG_r resources and
   UniKG_l literals. `_lt` suffix stands for "**l**iteral **t**riples", i.e., triples whose objects are literals.
   The `FROM` and `TO` columns store the subject resource and the object literal in the triple. The `iri` property stores the IRI of the predicate of the triple.

The contents of these mapped tables are shown below:

<table>
<tr><th>UniKG_r</th> <th>UniKG_l</th> <th>UniKG_rt</th><th>UniKG_lt</th></tr>
<tr><td>

|_id | iri | 
|--|--|
| 0 | kz:Waterloo |
| 1 | rdf:type |
| 2 | kz:city |
| 3 | kz:name |
| 4 | kz:population |
| 5 | kz:Adam |
| 6 | kz:person |
| 7 | kz:Karissa |
| 8 | kz:bornIn |
| 9 | kz:livesIn |
| 10 | kz:Zhang |
| 11 | rdf:student |
| 12 | kz:age |
| 13 | kz:subClassOf |
| 14 | kz:faculty |

</td><td>

|_id | val |
| -- | -- |
| 0  | Waterloo (string) |
| 1  | 150000 (int64) |
| 2 | Adam (string) |
| 3 | 30 (int64) |
| 4 | Karissa (string) |
| 5 | Zhang (string) |

</td><td>

|from (s) | iri (p) | to (o) |
| -- | -- | -- | 
| 0  | rdf:type | 2 | 
| 5  | rdf:type | 11 |
| 5 | kz:livesIn | 0 |
| 7 | rdf:type | 11 |
| 7 | kz:bornIn | 0 |
| 10 | rdf:type | 14 |
| 11 | kz:bornIn | 6 |
| 14 | kz:bornIn | 6 |
</td><td>

|from (s) | iri (p) | to (o) |
| -- | -- | -- |
| 0 | kz:population | 1 |
| 0 | kz:name | 0 |
| 5 | kz:age | 3 |
| 5 | kz:name | 2 |
| 7 | kz:name | 4 |
| 10 | kz:name | 5 |

</td>

</tr> </table>

For example, the (0, rdf:type, 2) tuple in the `UniKG_rt` table corresponds to the (kz:Waterloo, rdf:type, kz:city) triple,
while the (0, kz:population, 1) tuple in the `UniKG_lt` table corresponds to the (kz:Waterloo, kz:population, 150000) triple.


### Altering the Schemas of the Base Tables of RDFGraphs
You cannot alter the schemas of any of the node and relationship tables of RDFGraphs.
So the schemas of `UniKG_r`, `UniKG_l`, `UniKG_rt`, and `UniKG_lt` tables are immutable. However,
as [discussed below](#modifying-rdfgraphs-using-create-set-merge-and-delete) you can add or delete the records in these tables as if they are
regular tables with several restrictions.

### Mapping of RDF Literals as Separate Nodes
Storing RDF Literals as separate "Literal nodes" may rightly look unintuitive at first. The other natural alternative would be to store literals as node
properties of the resources they are associated with. However, storing them as separate nodes has the advantage that
you can query both types of triples, those between resources and resources as well as between resources and literals
homogeneously with a relationship pattern. As will be discussed momentarily, you can for example use the
`MATCH (s)-[p:UniKG]-(o)` pattern to match all triples. If you were to store literals as node properties, you would
need to use the previous pattern for triples between resources and resources and a different pattern `MATCH (s:UniKG_r)`
and inspect the properties of the mapped resources to match triples between resources and literals.

### Physical Storage of UniKG_rt and UniKG_lt Relationship Tables
If you inspect  the schema of `UniKG_rt` or `UniKG_rl` tables, you will get the following Output:

```
CALL table_info("UniKG_rt") RETURN *;
Output:
------------------------------------
| property id | name | type        |
------------------------------------
| 1           | pid  | INTERNAL_ID |
------------------------------------
```
Instead of storing the "iri" property as a STRING column, Kùzu stores it as an integer property
that stores the system-level id of the resource that corresponds to the IRI of the predicate.
Recall that each IRI that appears in your dataset is mapped to a separate resource node even if it is not
the subject or object of a triple, such as "rdf:type" in our example. Consider
a triple where rdf:type appears as a predicate, such as "<kz:Waterloo, rdf:type, kz:city>". 
This will be stored in the UniKG_rt relationship table as three integers: (0, 1, 2), where 0, 1, and 2, are 
respectively the system-level internal ids of resources kz:Waterloo, rdf:type, and kz:city. However,
you can still query a "virtual" iri property of the `UniKG_rt` relationship table, e.g., `MATCH (s)-[p:UniKG_rt]->(o) RETURN p.iri` will
return among other tuples, the `http://www.w3.org/1999/02/22-rdf-syntax-ns#type` tuple. `

## Querying Triples in RDFGraphs
Given the mapping of RDF triples into node and relationship tables, these tables can be queried using Cypher just like any other node and relationship
table in Kùzu. For example, you can query all the triples between one resource and another using
the following query:

```
MATCH (s)-[p:UniKG_rt]-(o) RETURN s.iri, p.iri, o.iri;
Output:
---------------------------------------------------------------------------------------------------------------------
| s.iri                          | p.iri                                           | o.iri                          |
---------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://www.w3.org/1999/02/22-rdf-syntax-ns#type | http://kuzu.io/rdf-ex#City     |
---------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Adam     | http://www.w3.org/1999/02/22-rdf-syntax-ns#type | http://kuzu.io/rdf-ex#student  |
---------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Adam     | http://kuzu.io/rdf-ex#livesIn                   | http://kuzu.io/rdf-ex#Waterloo |
---------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Karissa  | http://www.w3.org/1999/02/22-rdf-syntax-ns#type | http://kuzu.io/rdf-ex#student  |
---------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Karissa  | http://kuzu.io/rdf-ex#bornIn                    | http://kuzu.io/rdf-ex#Waterloo |
---------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Zhang    | http://www.w3.org/1999/02/22-rdf-syntax-ns#type | http://kuzu.io/rdf-ex#faculty  |
---------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#student  | http://www.w3.org/2000/01/rdf-schema#subClassOf | http://kuzu.io/rdf-ex#person   |
---------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#faculty  | http://www.w3.org/2000/01/rdf-schema#subClassOf | http://kuzu.io/rdf-ex#person   |
---------------------------------------------------------------------------------------------------------------------
```

### Using RDFGraph Name to Query Both Relationship Tables
We have also added syntactic sugar to make it easier to query the triples. Specifically, the RDFGraph name,
which is the prefix of all of the 4 tables, can be used to refer to both relationship table names.
That is, the RDFGraph name acts as a [rel table group](../cypher/data-definition/create-table#create-rel-table-group),
which are syntactic sugars that use a common name to refer to multiple possible relationship tables. In our example,
the RDFGraph's name is UniKG, and instead of using `UniKG_rt` and `UniKG_rl`, you can use UniKG as a relationship name
to query both relationship tables as follows:
```
MATCH (s)-[p:UniKG]->(o) 
RETURN s.iri, p.iri, o.iri, o.val;
Output:
--------------------------------------------------------------------------------------------------------------------------------
| s.iri                          | p.iri                                           | o.iri                          | o.val    |
--------------------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#name                      |                                | Waterloo |
--------------------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#population                |                                | 150000   |
--------------------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Adam     | http://kuzu.io/rdf-ex#name                      |                                | Adam     |
--------------------------------------------------------------------------------------------------------------------------------
|          ...                   |                        ...                      |             ...                |    ...   |
--------------------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Karissa  | http://kuzu.io/rdf-ex#bornIn                    | http://kuzu.io/rdf-ex#Waterloo |          |
--------------------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Adam     | http://kuzu.io/rdf-ex#livesIn                   | http://kuzu.io/rdf-ex#Waterloo |          |
--------------------------------------------------------------------------------------------------------------------------------
|          ...                   |                        ...                      |             ...                |    ...   |
--------------------------------------------------------------------------------------------------------------------------------
```
Note that for the triples whose objects are literals, the `o.iri` field is null and `o.val` is non-null. Similarly,
for the triples whose objects are resources, the `o.val` is null and `o.iri` is non-null.
`[p:UniKG]` is simply a syntactic sugar for the [multi-label relationship pattern](https://kuzudb.com/docusaurus/cypher/query-clauses/match/#match-relationships-with-multi-labels) of `[p:UniKG_rt|UniKG_lt]`. 
That is, the above query is equivalent to the following query:
```
MATCH (s)-[p:UniKG_rt|UniKG_lt]->(o)
RETURN s.iri, p.iri, o.iri, o.val;
```

We do not have a syntactic sugar option for querying both the resource and literal node tables. However, you can simply
omit the label of the nodes as done in the above query. In the above query, variable `o` does not have a label,
and Kùzu resolves it to the  2 labels `(o:UniKG_r:UniKG_l)`, which is the syntax for representing multi label
node variables in Cypher. 

### Use of Namespace Prefixes in Queries
Writing IRI namespaces, which are the prefix strings, such as "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
"http://kuzu.io/rdf-ex#" or "http://xmlns.com/foaf/0.1/", can be verbose. 
In SPARQL, which is the standard query language for RDF, you can define a variable with "PREFIX" keyword,
such as "PREFIX kz: `<http://kuzu.io/rdf-ex#>`" and then use the defined variable as a shorthand, as in
`kz:student` instead of `http://kuzu.io/rdf-ex#student`. In Kùzu, you can use the `WITH` clause 
in the beginning of your queries to define aliases. For example:

```
WITH "http://kuzu.io/rdf-ex#" as kz, 
     "http://www.w3.org/1999/02/22-rdf-syntax-ns#" as rdf
MATCH (s {iri: kz + "Adam"})-[p:UniKG {iri: rdf + "type"}]->(o)
RETURN s.iri, p.iri, o.iri;
Output:
----------------------------------------------------------------------------------------------------------------
| s.iri                      | p.iri                                           | o.iri                         |
----------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Adam | http://www.w3.org/1999/02/22-rdf-syntax-ns#type | http://kuzu.io/rdf-ex#student |
----------------------------------------------------------------------------------------------------------------
```
Note that in the above query if you instead projected every variable in scope with `RETURN *`, the "kz" and "rdf"
aliases, which are also in scope would also be returned as columns in the output.

### Querying of Regular Node and Relationship Tables and RDFGraphs
Since RDFGraphs are simply a set of node and relationship tables, you can link the node tables to other node
tables in your database. This can especially be useful if you would like to enrich some of
the resources with additional information. Suppose you had another source of information about
the phone numbers of students at universities and you stored those in a separate Student node table.
Let's suppose that the Student node table has the following schema and 3 records:
```
CREATE NODE TABLE Student(name String, phone String, primary key(name));
CREATE (:Student {name: "Adam", phone: "123456789"}),
       (:Student {name: "Karissa", phone: "987654321"});
```
You can now link the students in the Student node table to the students in the UniKG RDFGraph,
specifically the Resource nodes that represent students `Adam` and `Karissa`. Let us first create
a relationship table `SameStudent` that links the two node tables:
```
CREATE REL TABLE SameStudent(FROM UniKG_r TO Student);
```
Let us now link the Student node records with name Adam with the resource node with iri
`kz:Adam`. Similarly, let us link the Student node record with name Karissa with the resource node with iri
`kz:Karissa`. We can do this as follows:
```
MATCH (a:UniKG_r {iri: "http://kuzu.io/rdf-ex#Adam"}), (b:Student {name: "Adam"})
CREATE (a)-[:SameStudent]->(b);

MATCH (a:UniKG_r {iri: "http://kuzu.io/rdf-ex#Karissa"}), (b:Student {name: "Karissa"})
CREATE (a)-[:SameStudent]->(b);
```
Now, we can query the RDFGraph and the Student node table together as follows:
```
MATCH (a:Student {name:"Adam"})-[:SameStudent]-(s)-[p:UniKG]->(o) 
RETURN a.phone, s.iri, p.iri, o.val, o.iri, a.phone;

Output:
-------------------------------------------------------------------------------------------------------------------------------------
| a.phone   | s.iri                      | p.iri                                           | o.val | o.iri                          |
-------------------------------------------------------------------------------------------------------------------------------------
| 123456789 | http://kuzu.io/rdf-ex#Adam | http://kuzu.io/rdf-ex#name                      | Adam  |                                |
-------------------------------------------------------------------------------------------------------------------------------------
| 123456789 | http://kuzu.io/rdf-ex#Adam | http://kuzu.io/rdf-ex#age                       | 30    |                                |
-------------------------------------------------------------------------------------------------------------------------------------
| 123456789 | http://kuzu.io/rdf-ex#Adam | http://kuzu.io/rdf-ex#livesIn                   |       | http://kuzu.io/rdf-ex#Waterloo |
-------------------------------------------------------------------------------------------------------------------------------------
| 123456789 | http://kuzu.io/rdf-ex#Adam | http://www.w3.org/1999/02/22-rdf-syntax-ns#type |       | http://kuzu.io/rdf-ex#student  |
-------------------------------------------------------------------------------------------------------------------------------------
```
Above, a is a node table record from the Student node table, s is a resource node from the `UniKG_r` node table, 
`p` is either a relationship record from the `UniKG_rt` or `UniKG_lt` relationship tables, and `o` is either a resource or literal
record from the `UniKG_r` or `UniKG_l` node tables.

## Modifying RDFGraphs Using `CREATE`, `SET`, `MERGE` and `DELETE` 

Similar to how you can query the base 4 tables in RDFGraphs, you can also manipulate the base tables of RDFGraphs 
through the regular [CREATE](../cypher/data-manipulation-clauses/create), 
[MERGE](../cypher/data-manipulation-clauses/merge),
[DELETE](../cypher/data-manipulation-clauses/delete) and [DETACH DELETE](../cypher/data-manipulation-clauses/delete#detach-delete) 
statements of Cypher with some restrictions: 
- **Restriction 1:** `SET` operations, including those used after `MERGE`, such as
`ON MATCH/ON CREATE SET` are not supported. For example, you cannot change the `iri` property of a Resource node or
the `val` property of a Literal node.
- **Restriction 2:** `DELETE` operations on Resource node tables are not allowed.

In short, we support inserting and deleting of records from the relationship tables, inserting records into Resource node tables,
and inserting and deleting Literal node tables. We provide a few examples below and discuss some of the restrictions. 
For details please see the documentation of the respective clauses.


Here is an example of how you can create a new resource node in the `UniKG_r` node table.
```
WITH "http://kuzu.io/rdf-ex#" as kz 
CREATE (r:UniKG_r {iri: kz+"Nour"}) 
RETURN r;
```
Here is an example of how you can create a new triple in the UniKG_rt relationship table:
```
WITH "http://kuzu.io/rdf-ex#" as kz, "http://www.w3.org/1999/02/22-rdf-syntax-ns#" as rdf
MATCH (s:UniKG_r {iri: kz+"Nour"})
CREATE (s)-[p1:UniKG_rt {iri: rdf + "type"}]->(o1:UniKG_r {iri: kz + "student"})
CREATE (s)-[p2:UniKG_lt {iri: kz + "lastName"}]->(o2:UniKG_l {val: "Salah"});

WITH "http://kuzu.io/rdf-ex#" as kz 
MATCH (s:UniKG_r {iri: kz+"Nour"})-[p:UniKG]->(o) 
RETURN s.iri, p.iri, o.iri, o.val;
Output:
------------------------------------------------------------------------------------------------------------------------
| s.iri                      | p.iri                                           | o.iri                         | o.val |
------------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Nour | http://kuzu.io/rdf-ex#lastName                  |                               | Salah |
------------------------------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Nour | http://www.w3.org/1999/02/22-rdf-syntax-ns#type | http://kuzu.io/rdf-ex#student |       |
------------------------------------------------------------------------------------------------------------------------
```
Note that the second CREATE statement creates a new `UniKG_r` resource node with IRI `http://kuzu.io/rdf-ex#lastName`,
which was not present in our example RDFGraph before. Recall that every unique IRI that appears in an RDFGraph, whether as a subject,
predicate or object, gets a corresponding node in the `UniKG_r` node table (see item 1. in the [section above](#rdfgraphs-mapping-of-triples-to-property-graph-tables)
describing the mapping of triples to node and relationship tables).

Finally, here is an example of how you can delete the last literal nodes with val 150000 and all its relationships/triples.

```
MATCH (l:UniKG_l {val: 150000})
DETACH DELETE l;
```
Only the literal node in the <`kz:Waterloo`, `kz:population`, 150000> triple will match `l`. So `l` and the
triple <`kz:Waterloo`, `kz:population`, 150000> will be deleted.

### Restrictions for Deleting Resource Nodes
As listed among the above restrictions, Resource node table is append only, i.e., you cannot delete resource nodes. 
The reason for this restriction is that
deleting a resource node correctly requires deleting all the relationships and triples that "refer" to it.
Recall that every IRI in an RDF dataset is modeled as a resource node, including those IRIs that appear in the
predicates of some triples (see item 1. in the [section above](#rdfgraphs-mapping-of-triples-to-property-graph-tables)
describing the mapping of triples to node and relationship tables). For example, in our running example, we have the following triple:
< `kz:Waterloo`, `rdf:type`, `kz:City` >. 
The IRI `rdf:type` is a resource node in the `UniKG_r` node table. Specifically, it is the 2nd row above 
in the `UniKG_r` table where we show the mapping of triples to node and relationship tables. 
To correctly delete this node, we would have to delete all triples/relationships in the `UniKG_rt` and `UniKG_lt` relationship tables
that have `rdf:type` as their `iri`. For example, there are 4 such relationships in `UniKG_rt`. 
This is a non-trivial operation and we have not yet implemented it in Kùzu.

### Malformed IRI Behavior In CREATE Statements vs Turtle Files
Kùzu does not require that the values stored in the `iri` property of the Resource node table is a valid IRI
according to the [official IRI standard](https://www.ietf.org/rfc/rfc3987.txt). From Kùzu's perspective they can be arbitrary strings. 
They only need be unique because `iri` is a primary key of the Resource node table. For example, you can insert a Resource node table 
with the following `<http://full IRI/#ex>` string, which is not a valid IRI for two reasons, first it starts with
angle bracket and second because it contains the space character. However, you can insert it and the `iri` that will
be stored would be the "<http://full IRI/#ex>" string. However, when doing bulk data ingestion from Turtle files, 
triples with malformed IRIs will be ignored and not inserted into Kùzu. That is a side effect of the parser
[Serd](https://github.com/drobilla/serd) that Kùzu uses, which skips such triples (in fact it may skip an 
entire "chunk" of triples in the Turtle file; see the [documentation](./rdf-import#behavior-during-importing-malformed-triples-in-turtle-files) on this behavior here).

### Using Blank Node IDs in CREATE Statements
Kùzu has the convention that during bulk data import from Turtle or N-Triples files, 
blank nodes are replaced with specific IRIs of the form `_:ibj`, where i and j are some integers.
If you use IRIs of this form, say `_:7b4`, in your CREATE statements for Resource nodes,
Kùzu will interpret these as simple strings. For example, if
a blank node with IRI `_:7b4` already exists, Kùzu will not CREATE a new Resource node and instead error.
Further, you cannot have predicates whose IRIs of the form `_:ibj` (as in Turtle files).
Kùzu will error on CREATE statements that try to create a relationship
record in the `_rt` or `_lt` relationship tables with a predicate
whose IRI is of the form `_:ibj`.

## Duplicate Triples
Some RDF stores do not allow duplicate triples to be inserted into a database.
In Kùzu, because each triple is a relationship record, and Kùzu supports multiple relationships between
the same pair of nodes, it is possible to insert duplicate triples into Kùzu RDFGraphs.
