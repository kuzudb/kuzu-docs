---
title: RDF basics
---

RDF is part of a set of *[semantic web standards](https://www.w3.org/2001/sw/wiki/Main_Page)* by W3C consortium,
such as [RDF Schema](https://www.w3.org/TR/rdf-schema/) and [OWL](https://www.w3.org/OWL/) that form
a well-founded knowledge representation system. The [W3C website](https://www.w3.org/), and several books, such as the one
by Allemang and Hendler, [Semantic Web for the Working Ontologist](http://www.acad.bg/ebook/semantic/0123735564%20-%20Morgan%20Kaufmann%20-%20Semantic%20Web%20for%20the%20Working%20Ontologist%20Effective%20Modeling%20in%20RDFS%20and%20OWL%20-%20(2008).pdf)
(see [this](https://www.amazon.com/Semantic-Web-Working-Ontologist-Effective/dp/0123859654) more recent but paid edition), contain a
wealth of information about RDF and semantic web. Here we give a brief overview of RDF covering
the following elements of the data model:

- Resources and IRIs
- Literals
- Blank nodes
- Triples and RDF/Knowledge Graphs
- RDF Schema and OWL (covered very briefly)

At the end, we provide a note about when RDF is likely a better choice 
for data modeling compared to property graphs.

## Resources and IRIs

The basic elements of data in RDF are "Resources",
which are identified by
unique *internationalized resource identifiers* (IRIs). IRIs are similar to URLs
and are strings of the form: `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`,
`http://www.w3.org/2000/01/rdf-schema#subClassOf` or `http://kuzu.io/rdf-ex#livesIn`.
IRIs are broadly in the form of <prefix-namespace:local-identifier>, where the prefix
namespace, such as `http://www.w3.org/1999/02/22-rdf-syntax-ns#`,
`http://www.w3.org/2000/01/rdf-schema#` and `http://kuzu.io/rdf-ex#`,
are repositories of vocabularies/elements about a specific domain.
In examples about RDF as well as in file representations of RDF,
prefix namespaces are often abbreviated, such as:
- `rdf` for `http://www.w3.org/1999/02/22-rdf-syntax-ns#`
- `rdfs` for `http://www.w3.org/2000/01/rdf-schema#`
- `kz` for `http://kuzu.io/rdf-ex#`.

Using the namespace abbreviations, full IRIs are written 
in the `abbreviated-prefix:local-identifier` form and stand for the concatenation of the prefix namespace 
and the local identifier. For example:

- `rdf:type` is shorthand for `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`
- `kz:Adam` is shorthand for `http://kuzu.io/rdf-ex#Adam`.

IRIs uniquely identify things, objects or concepts in the application that is being modeled. 

As an example, consider a database of information about a university
and let `http://kuzu.io/rdf-ex#` (`kz`) be a namespace to identify
things in the application. We can model the following as resources
with the following IRIs:

- `kz:Adam`: An object that represents a student in the university.
- `kz:student`: A schema concept that represents a student.
- `kz:person`: A schema concept that represents people.
- `kz:name`: A schema concept that represents the names of people.
- `kz:age`: A schema concept that represents the ages of people.

RDF and the standards around RDF, such as RDF Schema (RDFS) contain
standardized vocabulary that we can also use in our database (and often these are widely
used in practice). The ones we'll use are the following
(see here for [full RDF vocabulary](https://www.w3.org/1999/02/22-rdf-syntax-ns) 
and [full RDFS vocabulary](http://www.w3.org/2000/01/rdf-schema)):

- `rdf:type`: A schema concept that represents the type of a resource.
- `rdfs:subClassOf`: A schema concept that represents the sub-class relationship between two classes.

We will describe other IRIs to identify other resources throughout the
Kùzu RDFGraphs documentation. For the purpose of covering RDF basics, 
we'll use the above resources/IRIs.

## RDF literals

Some properties of resources are not other resources but primitive values.
For example the age of the student Adam, identified by `kz:Adam`, is 30.
This is not modeled as a resource but as a literal. Similarly, the name
of `kz:Adam` is the string "Adam". These are called literals and literals
do not have IRIs. String literals can have an optional language tag indicated 
with the "@" symbol at their ends. For example, consider two triples with strings
literal values about the Resource `ex:spiderman`: 
(`ex:spiderman`, `foaf:name`, `"Spiderman"@en`), (`ex:spiderman`, `foaf:name`, `"Человек-паук"@ru`).
The first triple has tag `@en` to indicate that the string is in English, and the second
one has tag `@ru` to indicate that the string is in Russian.

## RDF blank nodes

[Blank nodes](https://www.w3.org/TR/rdf11-concepts/#section-blank-nodes) are RDF resources
whose IRIs are not known. These may appear in some RDF file formats, e.g.,
in Turtle files, their IRIs appear with prefix `_:<some-label>` or inside `[ ]`. As many systems
that support RDF, when loading RDF data into Kùzu, Kùzu will generate
a specific IRI for blank nodes. See [here](/rdf-graphs/rdf-import#blank-nodes) for more details.

## RDF triples and RDF/Knowledge Graphs

Now we can describe how to express the information in the database.
All information in RDF is expressed as a set of <subject, predicate, object>
triples. We give several examples:

- `<kz:Adam, kz:name, "Adam">`: Data information that Adam's name is "Adam".
- `<kz:Adam, kz:age, 30>`: Data information that Adam's age is 30.
- `<kz:Adam, rdf:type, kz:student>`: Schema information that Adam is an instance of student.
- `<kz:student, rdfs:subClassOf, kz:person>`: Schema information that student is a subclass of person.

A set of triples is called an RDF graph, aka a *knowledge graph*. The following shows the 
above RDF graph that consists of 4 triples pictorially. In the figure, each triple
is an edge, each resource is a node, and each literal appears simply as a value without
an ellipse around it.

<Image src="/img/rdfgraphs/rdf-basics-example.png" />

## RDF schema and OWL

RDF is part of larger set of standards to model knowledge.
For example, `rdf:type` is a common IRI that is used universally
across many RDF datasets. RDF Schema and OWL contain additional
standardized vocabulary to describe schemas of RDF graphs. For example,
`rdfs:subClassOf`, which is used to form class hierarchies,
or `owl:sameAs`[^1],  which is used to
identify that two resources are the same resource, 
are additional common vocabularies you might see across many datasets. 
These vocabularies have well-defined, clear semantics and enables
information systems to be developed that can do automatic inference/reasoning.
For example, even in our small example, a system that understands
the meanings of these vocabularies can return `kz:Adam` if a query
asks for all `kz:person` resources (because `kz:Adam` is a `kz:student`,
which is an `rdfs:subClassOf` `kz:person`). For now, the goal of Kùzu RDFGraphs
is not to provide automatic inference capabilities over RDF triples.
Therefore, when you query Kùzu RDFGraphs, you will not get the system
to do automatic inference.
Instead, they aim to provide a means to query RDF triples
natively in Kùzu using Cypher.

[^1]: `owl` is the abbreviation for `http://www.w3.org/2002/07/owl` namespace.

## When to use RDF vs. Property Graphs

Questions about the choice of data models are at some level, a user decision. 
A rule of thumb is that if you have sufficient structure over your 
records and want to model them as a graph (e.g., to find paths, patterns, ask for 
recursive and/or arbitrary connections between records), you should
structure them as property graphs. 
The general principle is that DBMSs provide fast query performance over 
large sets of records by exploiting structure. Outside of this, some common
scenarios for using RDF are the following:

1. When your data is very heterogeneous and hard to tabulate.
2. You want to homogeneously represent and query both your data and metadata/schema information
   in the same format of triples. For the example above, we 
   represented both data and schema information homogeneously as triples.
3. You need some automatic reasoning/inference capabilities.[^2]

[^2]: RDFS or OWL-based inference is currently not supported in Kùzu.

## Reification

One of the major differences between RDF and property graph models is that in property
graphs you can add properties on edges (as well as nodes). This is not possible in RDF.
Suppose you had a database with information about a person Karissa and a person Zhang
and you wanted to model that Karissa follows Zhang (e.g., on Twitter) since 01-01-2021. In a property graph, you could
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
to attach to the reified statement. In the above example, we attached the `kz:since` property to the reified statement.
The following figure shows these triples pictorially.

<Image src="/img/rdfgraphs/reification-example.png" />

Note that this is similar to a strategy that property graph model
users apply to represent n-ary relationships. In a property graph model,
relationships can only be between two nodes. To represent a ternary relationship,
for example, an "Enrollment" relationship in a university database 
between a student, class, and a section of the class, 
a standard technique is to have a new placeholder node of type "Enrollment" and 
from each Enrollment node connect to a Student node, a Class node, and a Section node.

Note further that you do not have to follow the standardized reification strategy and vocabulary, 
so use `rdf:subject`, `rdf:predicate`, `rdf:object`. You could have also made `kz:KfollowsZ` a new Resource of 
`rdf:type` `kz:follows` and then have only two triples <`kz:KfollowsZ`, `kz:follower`, `kz:Karissa`> and
<`kz:KfollowsZ`, `kz:followee`, `kz:Zhang`> and keep the other two triple about the `since` property as before.
This is an alternative representation that omits the `rdf:predicate` triple (the predicate is implicit 
in the type `kz:follows` of `kz:KfollowsZ`). 

### Note on RDF-Star

[RDF-star](https://w3c.github.io/rdf-star/cg-spec/editors_draft.html) is an extension to RDF standard that allows reification in serialized files (e.g., `.ntx` files).
Kùzu currently does not support storing RDF-star statements, e.g., you cannot load `.ntx` files into Kùzu.
You have to explicitly reify those statements to import them into Kùzu.
