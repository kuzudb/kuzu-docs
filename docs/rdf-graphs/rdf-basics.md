---
title: RDF Basics
sidebar_position: 0
---

import RDFBasicsExample from './rdf-basics-example.png';
import ReificationExample from './reification-example.png';

# RDF Basics
RDF is part of a set of *[semantic web standards](https://www.w3.org/2001/sw/wiki/Main_Page)* by W3,
such as [RDF Schema](https://www.w3.org/TR/rdf-schema/) and [OWL](https://www.w3.org/OWL/) that form
a well-founded knowledge representation system. The W3 website, and several books, such as 
[this](https://www.amazon.com/Semantic-Web-Working-Ontologist-Effective/dp/0123859654), contain a 
wealth of information about RDF and semantic web. Here we give a brief overview of RDF covering
the following elements of the data model:
- Resources and IRIs
- Literals
- Blank nodes
- Triples and "RDF/Knowledge Graphs"
- RDF Schema and OWL (covered very briefly)

At the end, we provide a note about when RDF is likely a good choice 
for data modeling compared to property graphs.

## Resources and IRIs

The basic element of data in RDF are "Resources", 
which are identified by
unique *internationalized resource identifiers* (IRIs). IRIs are similar to URLs
and are strings of the form: `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`,
`http://www.w3.org/2000/01/rdf-schema#subClassOf` or `http://kuzu.io/rdf-ex#livesIn`.
IRIs are broadly in the form of <prefix-namespace:local-identifier>, where the prefix
namespace, such as `http://www.w3.org/1999/02/22-rdf-syntax-ns`,
`http://www.w3.org/2000/01/rdf-schema` and `http://kuzu.io/rdf-ex`,
are repositories of vocabularies/elements about a specific domain.
In examples about RDF as well as in file representations of RDF,
prefix namespaces are often abbreviated, such as:
- `rdf` for `http://www.w3.org/1999/02/22-rdf-syntax-ns`
- `rdfs` for `http://www.w3.org/2000/01/rdf-schema`
- `kz` for `http://kuzu.io/rdf-ex`.

Using the namespace abbreviations, full IRIs are written 
in the `abbreviated-prefix:local-identifier` to stand for: `prefix#local-identifier`.
For example:
- `rdf:type` is shorthand for `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`
- `kz:Adam` is shorthand for `http://kuzu.io/rdf-ex#Adam`.

These are however conventions and IRIs can be any strings that uniquely identifies "things" and "concepts"
in the application that is being modeled. 

As an example, consider a database of information about a university
and let `http://kuzu.io/rdf-ex` (`kz`) as our namespace to identify
things in this application. We can model the following "things" as resources
that we identify with the following IRIs:
- `kz:Adam`: A data concept that represents a student in the university.
- `kz:student`: A schema concept that represents a student.
- `kz:person`: A schema concept that represents people.
- `kz:name`: A schema concept that represents the names of people.
- `kz:age`: A schema concept that represents the ages of people.

RDF and the standards around RDF, such as RDF Schema (RDFS) contain
standardized vocabulary that we can also use (and often these are widely
used in practice) in our database. The one's we'll use are the following
(see here for [RDF full vocabulary](https://www.w3.org/1999/02/22-rdf-syntax-ns) 
and [RDFS full vocabulary](http://www.w3.org/2000/01/rdf-schema)):
- `rdf:type`: A schema concept that represents the type of a resource.
- `rdfs:subClassOf`: A schema concept that represents the sub-class relationship between two classes.

We will describe other IRIs to identify other resources throughout the
Kùzu RDFGraphs documentation. For the purpose of covering RDF basics, 
we'll use the above resources/IRIs.

## RDF Literals
Some properties of resources are not other resources but primitive values.
For example the age of the student Adam, identified by `kz:Adam`, is 30.
This is not modeled as a resource but as a literal. Similarly, the name
of `kz:Adam` is the string "Adam". These are called literals and literals
are not given IRIs.


## RDF Blank Nodes
[Blank nodes](https://www.w3.org/TR/rdf11-concepts/#section-blank-nodes) are RDF resources
whose IRIs are not known. These may appear in some RDF file formats, e.g.,
in Turtle files, their IRIs appear with prefix `_:<some-label>`. As many systems
that support RDF, when loading RDF data into Kùzu, Kùzu will generate
a specific IRI for blank nodes. See [here](./rdf-import#blank-nodes) for more details.

## RDF Triples and RDF/Knowledge Graphs
Now we can describe how to express the information in the database.
All information in RDF is expressed as a set of <subject, predicate, object>
triples. We give several examples:
- `<kz:Adam, kz:name, "Adam">`: Data information that Adam's name is "Adam".
- `<kz:Adam, kz:age, 30>`: Data information that Adam's age is 30.
- `<kz:Adam, rdf:type, kz:student>`: Schema information that Adam is an instance of student.
- `<kz:student, rdfs:subClassOf, kz:person>`: Schema information that student is a subclass of person.

A set of triples is called an RDF graph, aka a *knowledge graph*. The following shows the 
above RDF graph that consists of 4 triples pictorially. In the figure, each triple
is an edge, each resource is a node, and each literal appears simple as a value without
an ellipse around it.

<img src={RDFBasicsExample} style={{width: 800}} />

## RDF Schema and OWL

RDF is part of larger set of standards to model knowledge.
For example, `rdf:type` is a common IRI that is used universally
across many RDF datasets. RDF Schema and OWL contain additional
standardized vocabulary to describe schemas of RDF graphs. For example,
`rdfs:subClassOf`, which is used to form class hierarchies,
or `owl:sameAs` (`owl` is the abbreviation for 
`http://www.w3.org/2002/07/owl` namespace) which is used to
identify that two resources are the same resource, 
are additional common vocabulary you might see across many datasets. 
These vocabulary have very well-defined clear semantics and enables
information systems to be developed that can do automatic reasoning.
For example, even in our small example, a system that understands
the meanings of these vocabulary can return `kz:Adam` if a query
asks for all `kz:person` resources (b/c `kz:Adam` is a `kz:student`,
which is an `rdfs:subClassOf` `kz:person`). The goal of Kùzu RDFGraphs,
for now, is not to provide automatic inference capabilities over RDF triples.
Therefore, when you query Kùzu RDFGraphs, you will not get the system
to do automatic inference.
Instead, they aim to provide a means to query RDF triples
natively in Kùzu using Cypher.

## When to Use RDF vs Property Graphs

Questions about the choice of data models are at some level a user choice. 
A rough rule of thumb is that if you have sufficient structure over your 
records and want to model them as a graph (e.g., to find paths, patterns, ask for 
recursive and/or arbitrary connections between records), you should
structure them as property graphs. 
The general principle is that DBMSs provide fast query performance over 
large sets of records by exploiting structure. Instead, some common
scenarios for using RDF are the following:
1. When your data is very heterogeneous and hard to tabulate.
2. You want to homogeneously represent and query both your data and metadata, i.e., schema information,
   in the same format of triples. Note that in the above example, we 
   represented both data and schema information in the same format of triples.
3. You need some automatic reasoning/inference capabilities.[^1]

[^1]: Note that Kùzu does not currently support automatic reasoning and inference, e.g., based on RDFS or OWL standards.


## Reification
One of the major differences as graph models between RDF and property graphs is that in property
graphs you can add properties on edges (as well as nodes). This is not possible in RDF.
Suppose you had a database with information about a person Karissa and a person Zhang
and you wanted to model that Karissa follows (e.g., on Twitter) Zhang since 01-01-2021. In a property graph, you could
do this by having a Person node table with, say a name property, and a Follows relationship table 
from Person to Person with a `since` property. Your tables would look as follows:


<table>
<tr><th>Person Node Table</th> <th>Follows Relationship Table</th></tr>
<tr><td>

|_id | name | 
|--| -- |
| 0 | Karissa |
| 1 | Zhang |

</td><td>

| from | to | since |
| -- | -- | -- | 
| 0  | 1 | 01-01-2021 |

</td></tr> 
</table>

In RDF, you can have a triple in the form of <kz:Karissa, kz:follows, kz:Zhang>
to represent that Karissa follows Zhang, 
but then you cannot represent some information about this specific follow triple
with additional triples. That is you cannot attach information to the
`<kz:Karissa, kz:follows, kz:Zhang>` triple/statement with additional triples. A standard solution to
achieve this is called [reification](https://www.w3.org/wiki/RdfReification), where you make the fact of "Karissa following
Zhang" a Resource itself, say with IRI `kz:KfollowsZ`, and type rdf:Statement.
Then we have the following triples about `kz:KfollowsZ`:
- `<kz:KfollowsZ, rdf:type, rdf:Statement>`: r is a statement.
- `<kz:KfollowsZ, rdf:subject, kz:Karissa>`: The subject of r is Karissa.
- `<kz:KfollowsZ, rdf:predicate, kz:follows>`: The predicate of r is follows.
- `<kz:KfollowsZ, rdf:object, kz:Zhang>`: The object of r is Zhang.
- `<kz:KfollowsZ, kz:since, 01-01-2021>`: The since property of r is 2024.

So you have at least 4 triples, one with predicate `rdf:type`, the other 3 with predicates
`rdf:subject`, `rdf:predicate`, `rdf:object`, and then additional triples, one for each property you want
to attach to the reified statement. In the above example, we attached the kz:since property to the reified statement.
The following figure shows these triples pictorially.

<img src={ReificationExample} style={{width: 800}} />


Note that this is similar to a strategy that users of property graph model
use to represent non-binary relationships. In property graph model,
relationships can be between two nodes. To represent non-binary relationships,
say an "Enrollment" relationship in a university database 
between a student, class, and a section of the class, 
a standard technique is to have a new placeholder node of type "Enrollment" and 
from each Enrollment node connect to a Student node, a Class node, and a Section node.
