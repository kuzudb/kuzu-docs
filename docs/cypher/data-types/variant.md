---
title: Variant
sidebar_position: 14
---
Variant is a data type that can store values of various data types (similar to the sql_variant data type of SQLServer).
Currently it can only be used to store [RDF literals](https://www.w3.org/TR/rdf11-concepts/#section-Graph-Literal) in [RDFGraphs](../../rdf-graphs). 
That is, you cannot create a regular node or relationship table that holds a column of type VARIANT.
When working with RDFGraphs, the [Literals node table](../../rdf-graphs/rdfgraphs-overview#rdfgraphs-mapping-of-triples-to-property-graph-tables)'s 
`val` column stores RDF literal values. RDF literals, and Kùzu's Variant data type can store values of different data types.
For example, consider the following triples in a Turtle file:
```
@prefix kz: <http://kuzu.io/rdf-ex#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

kz:Waterloo a kz:City ;
	    kz:name "Waterloo" ;
	    kz:population 10000 ;
	    kz:altitude1 "329.0"^^xsd:decimal .
```
Suppose that you insert these into an RDFGraph named `UniKG`. You will get the following values in the `val` column 
of the Literals node table `UniKG_l`:
```
MATCH (a:UniKG_r)-[p:UniKG_lt]->(o:UniKG_l)
RETURN a.iri, p.iri, o.val;
-------------------------------------------------------------------------------------------------
| a.iri                          | p.iri                                           | o.val      |
-------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#altitude1                 | 329.000000 |
-------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#population                | 10000      |
-------------------------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#name                      | Waterloo   |
-------------------------------------------------------------------------------------------------
```
In the output above the data types of the values in `o.val` are as follows (data types are not rendered in Kùzu cli's output)
- 329.000000 is a double
- 10000 is an integer
- "Waterloo" is a string

These different types are stored under the same column `val` of the `Literals` node table.

## Kùzu Data Types that can be Stored in a Variant Column

The following Kùzu data types can be stored in a Variant column. You can use the `cast` function to cast a value to a 
specific data type before storing it in a Variant column (as will be demonstrated in the `CREATE` statement 
examples momentarily).

| Kùzu Data Type | CAST Function Example |
|----------------|-----------------------|
| INT8           | cast(2, "INT8")       |
| INT16          | cast(2, "INT16")      |
| INT32          | cast(2, "INT32")      | 
| INT64          | cast(2, "INT64")      |
| UINT8          | cast(2, "UINT8")      |
| UINT16         | cast(2, "UINT16")     |
| UINT32         | cast(2, "UINT32")     | 
| UINT64         | cast(2, "UINT64")     |
| DOUBLE         | cast(4.4, "DOUBLE")   |
| FLOAT          | cast(4.4, "FLOAT")    |
| BLOB           | cast("\\xB2", "BLOB") |
| BOOL           | cast("true", "BOOL")  |
| STRING         | cast(123, "STRING")   |
| DATE           | cast("2024-01-01", "DATE") |
| TIMESTAMP      | cast("2024-01-01 11:25:30Z+00:00", "TIMESTAMP") |
| INTERVAL       | cast("1 year", "INTERVAL") |

For example, the below code adds new triples into an RDFGraph with type date and float, respectively:
```
CREATE (a:UniKG_r {iri:"http://kuzu.io/rdf-ex#foo"})-[p:UniKG_lt {iri:"http://kuzu.io/rdf-ex#datepredicate"}]->(o:UniKG_l {val:cast("2024-01-01", "DATE")});
CREATE (a:UniKG_r {iri:"http://kuzu.io/rdf-ex#foo"})-[p:UniKG_lt {iri:"http://kuzu.io/rdf-ex#doublepredicate"}]->(o:UniKG_l {val:4.4});
```
Above, DATE type needs to be cast explicitly as in "cast("2024-01-01", "DATE")" while 4.4, which is of type DOUBLE, 
can be provided as is. This is because DATE is not an automatically inferred data type. The above two CREATE statements will create 
the following two triples:
```
----------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#foo | http://kuzu.io/rdf-ex#doublepredicate | 4.400000   |
----------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#foo | http://kuzu.io/rdf-ex#datepredicate   | 2024-01-01 |
----------------------------------------------------------------------------------
```

## Supported Data Types When Loading From Turtle Files
Although we can store any of the above data types in a Variant column through CREATE statements, 
when loading from a Turtle file, currently only a subset of these data types are supported. 
The data types that can be loaded from Turtle files along with their XML Schema Definition (XSD) tags are as follows:

| Kùzu Data Type | XSD Tag     |
|----------------|-------------| 
| INT64          | xsd:integer |
| UINT64         | xsd:nonNegativeInteger |
| UINT64         | xsd:positiveInteger |
| FLOAT          | xsd:float   |
| DOUBLE         | xsd:double  |
| DOUBLE         | xsd:decimal |
| BOOL           | xsd:boolean |
| DATE           | xsd:date    |
By default any literal that is not tagged explicitly with the above XSD tags will be stored as a Kùzu STRING data type.

## Parsing RDF Literals from Turtle Files
When parsing RDF literals from Turtle files, if you explicitly
type your literals with an XSD tag, then those will be the data types. In other cases,
Kùzu will try to infer the data types. Consider the below Turtle file:
```
@prefix kz: <http://kuzu.io/rdf-ex#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

kz:Waterloo a kz:City ;
	    kz:population 10000 ;
	    kz:altitude1 329.0 ;
	    kz:altitude2 "329.0"^^xsd:decimal ;
	    kz:altitude3 "329.0" .
```
This will result in the following triples:
```
----------------------------------------------------------------------------------
| a.iri                          | p.iri                            | o.val      |
----------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#population | 10000      |
----------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#altitude1  | 329.000000 |
----------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#altitude2  | 329.000000 |
----------------------------------------------------------------------------------
| http://kuzu.io/rdf-ex#Waterloo | http://kuzu.io/rdf-ex#altitude3  | 329.0      |
----------------------------------------------------------------------------------
```
The data types above are as follows (again data types are not rendered in Kùzu cli's output):
- 10000 is an INT64 (automatically inferred)
- 329.000000 (for altitude1 and altitude2) are DOUBLE. Note that altitude1 is automatically inferred, while altitude2 is explicitly typed with an xsd tag.
- 329.0 (for altitude3) is a STRING (automatically inferred)

