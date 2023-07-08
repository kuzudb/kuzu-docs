---
title: Match
sidebar_position: 1
description: MATCH is the clause where you define a graph pattern", i.e., a join of node or relationship records, to find in the database.
---

import RunningExample from '../running-example.png';

# Database
We will use the database, whose schema and data import commands are given [here](example-database.md):

<img src={RunningExample} style={{width: 800}} />

You can import this database by copy pasting the commands on that page. 

# MATCH
MATCH is the clause where you define a "graph pattern", i.e., a join of node or relationship records,
to find in the database.[^1]. There are several different ways to match patterns and we go through them
below. MATCH is often accompanied by [WHERE](where.md) (equivalent to SQL's WHERE clause) to define more predicates on the patterns that are matched.

- [Match Nodes](#match-nodes)
  - [Match Nodes With a Single Label](#match-nodes-with-a-single-label)
  - [Match Nodes With Multiple Labels](#match-nodes-with-multiple-labels)
  - [Match Nodes With Any Label](#match-nodes-with-any-label)
- [Match Relationships](#match-relationships)
  - [Match Directed Relationships With a Label](#match-directed-relationships-with-a-label)
  - [Match Relationships With Multi Labels](#match-relationships-with-multi-labels)
  - [Match Relationships With Any Label](#match-relationships-with-any-label)
  - [Match Undirected Relationships](#match-undirected-relationships)
  - [Omit Binding Variables to Nodes or Relationships](#omit-binding-variables-to-nodes-or-relationships)
  - [Match Multiple Patterns](#match-multiple-patterns)
  - [Equality Predicates on Node/Rel Properties](#equality-predicates-on-noderel-properties)
  - [Match Variable Length Relationships](#match-variable-length-relationships)
  - [Returning Variable Length Relationships](#returning-variable-length-relationships)
  - [Single Shortest Path](#single-shortest-path)

## Important Notes: 
- Similar to other high-level database query languages, nodes and relationships in the patterns 
are bound to variables, which can be referenced in other clauses (e.g., WHERE or RETURN) of the query.
openCypher allows you to omit these variables, if you do not need to reference them.
- Node/Rel table names in Kùzu are case sensitive. So you need to specify the labels of nodes/rels
using the same letter cases you used in your node/rel table schema definitions. 

## Match Nodes

### Match Nodes With a Single Label
The query below matches variable "a" to nodes with label User and returns "a", which 
is a shortcut in openCypher to return all properties of the node together with label and internal ID that variable "a" matches.
```
MATCH (a:User)
RETURN a;
```
Output:
```
----------------------------------------------------
| a                                                |
----------------------------------------------------
| {_ID: 0:0, _LABEL: User, name: Adam, age: 30}    |
----------------------------------------------------
| {_ID: 0:1, _LABEL: User, name: Karissa, age: 40} |
----------------------------------------------------
| {_ID: 0:2, _LABEL: User, name: Zhang, age: 50}   |
----------------------------------------------------
| {_ID: 0:3, _LABEL: User, name: Noura, age: 25}   |
----------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=xjiF39SzeCb7).

### Match Nodes With Multiple Labels
The query below matches variable "a" to nodes with label User or label City. "Return a" will return all properties of the node together with label and internal ID. Properties not exist in a label will be returned as NULL value (e.g. "population" not exists in "User"). Properties exists in multiple labels are expected to have the same data type (e.g. "name" has STRING data type in "User" and "City" ).
```
MATCH (a:User:City)
RETURN a;
```
Output:
```
-----------------------------------------------------------------
| a                                                             |
-----------------------------------------------------------------
| {_ID: 1:0, _LABEL: City, name: Waterloo, population: 150000}  |
-----------------------------------------------------------------
| {_ID: 1:1, _LABEL: City, name: Kitchener, population: 200000} |
-----------------------------------------------------------------
| {_ID: 1:2, _LABEL: City, name: Guelph, population: 75000}     |
-----------------------------------------------------------------
| {_ID: 0:0, _LABEL: User, name: Adam, age: 30, }               |
-----------------------------------------------------------------
| {_ID: 0:1, _LABEL: User, name: Karissa, age: 40, }            |
-----------------------------------------------------------------
| {_ID: 0:2, _LABEL: User, name: Zhang, age: 50, }              |
-----------------------------------------------------------------
| {_ID: 0:3, _LABEL: User, name: Noura, age: 25, }              |
-----------------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=3yO3HHwNeBy3).

### Match Nodes With Any Label
Below query matches variable "a" to nodes with any label. In example database, it is equivalent to `MATCH (a:User:City) RETURN a;`.
```
MATCH (a)
RETURN a;
```
Output:
```
-----------------------------------------------------------------
| a                                                             |
-----------------------------------------------------------------
| {_ID: 1:0, _LABEL: City, name: Waterloo, population: 150000}  |
-----------------------------------------------------------------
| {_ID: 1:1, _LABEL: City, name: Kitchener, population: 200000} |
-----------------------------------------------------------------
| {_ID: 1:2, _LABEL: City, name: Guelph, population: 75000}     |
-----------------------------------------------------------------
| {_ID: 0:0, _LABEL: User, name: Adam, age: 30, }               |
-----------------------------------------------------------------
| {_ID: 0:1, _LABEL: User, name: Karissa, age: 40, }            |
-----------------------------------------------------------------
| {_ID: 0:2, _LABEL: User, name: Zhang, age: 50, }              |
-----------------------------------------------------------------
| {_ID: 0:3, _LABEL: User, name: Noura, age: 25, }              |
-----------------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=4NBsUUP_evvh).

## Match Relationships

### Match Directed Relationships With a Label
Similar to binding variables to node records, you can bind variables to relationship records and return them. You can specificy the direction of relationship by `<-` or `->`. The following query finds all "a" Users that follow a "b" User through an outgoing relationship from "a", and returns name of "a", relationship "e", and name of "b", where "e" will match the relationship from "a" to "b".
```
MATCH (a:User)-[e:Follows]->(b:User)
RETURN a.name, e, b.name;
```
Output:
```
-----------------------------------------------------------------------------
| a.name  | e                                                     | b.name  |
-----------------------------------------------------------------------------
| Adam    | (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) | Karissa |
-----------------------------------------------------------------------------
| Adam    | (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) | Zhang   |
-----------------------------------------------------------------------------
| Karissa | (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) | Zhang   |
-----------------------------------------------------------------------------
| Zhang   | (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) | Noura   |
-----------------------------------------------------------------------------
```

The following query matches all the relationships through an incoming relationship from "a" (so "a" and "b" are swapped in output):
```
MATCH (a:User)<-[e:Follows]-(b:User)
RETURN a.name, e, b.name;
```
Output:
```
-----------------------------------------------------------------------------
| a.name  | e                                                     | b.name  |
-----------------------------------------------------------------------------
| Karissa | (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) | Adam    |
-----------------------------------------------------------------------------
| Zhang   | (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) | Adam    |
-----------------------------------------------------------------------------
| Zhang   | (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) | Karissa |
-----------------------------------------------------------------------------
| Noura   | (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) | Zhang   |
-----------------------------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=Djpu4aDafG5U).

### Match Relationships With Multi Labels
Similar to matching nodes with multiple labels, you can bind variables to relationships with multiple labels. Below query finds all "a" User that Follows "b" User or LivesIn "b" City.
```
MATCH (a:User)-[e:Follows|:LivesIn]->(b:User:City)
RETURN a.name, e, b.name;
```
Output:
```
-------------------------------------------------------------------------------
| a.name  | e                                                     | b.name    |
-------------------------------------------------------------------------------
| Adam    | (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) | Karissa   |
-------------------------------------------------------------------------------
| Adam    | (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) | Zhang     |
-------------------------------------------------------------------------------
| Adam    | (0:0)-{_LABEL: LivesIn, _ID: 3:0, }->(1:0)            | Waterloo  |
-------------------------------------------------------------------------------
| Karissa | (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) | Zhang     |
-------------------------------------------------------------------------------
| Karissa | (0:1)-{_LABEL: LivesIn, _ID: 3:1, }->(1:0)            | Waterloo  |
-------------------------------------------------------------------------------
| Zhang   | (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) | Noura     |
-------------------------------------------------------------------------------
| Zhang   | (0:2)-{_LABEL: LivesIn, _ID: 3:2, }->(1:1)            | Kitchener |
-------------------------------------------------------------------------------
| Noura   | (0:3)-{_LABEL: LivesIn, _ID: 3:3, }->(1:2)            | Guelph    |
-------------------------------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=ylYHrLeQfLao).

### Match Relationships With Any Label
Similar to matching nodes with any label, you can bind variables to relationships with any label by not specifying a label. Below query finds all relationships in the database.
```
MATCH ()-[e]->()
RETURN e;
```
Output:
```
-------------------------------------------------------
| e                                                   |
-------------------------------------------------------
| (0:0)-[label:Follows, {_id:2:0, since:2020}]->(0:1) |
-------------------------------------------------------
| (0:0)-[label:Follows, {_id:2:1, since:2020}]->(0:2) |
-------------------------------------------------------
| (0:0)-[label:LivesIn, {_id:3:0, since:}]->(1:0)     |
-------------------------------------------------------
| (0:1)-[label:Follows, {_id:2:2, since:2021}]->(0:2) |
-------------------------------------------------------
| (0:1)-[label:LivesIn, {_id:3:1, since:}]->(1:0)     |
-------------------------------------------------------
| (0:2)-[label:Follows, {_id:2:3, since:2022}]->(0:3) |
-------------------------------------------------------
| (0:2)-[label:LivesIn, {_id:3:2, since:}]->(1:1)     |
-------------------------------------------------------
| (0:3)-[label:LivesIn, {_id:3:3, since:}]->(1:2)     |
-------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=lEZAboFLfLku).

### Match Undirected Relationships
User can match a relationship in both directions by not specifiying a relationship direction (i.e. `-`). The following query finds all "b" users who either follows or being followed by "Karissa". 

```
MATCH (a:User)-[e:Follows]-(b:User) Where a.name = 'Karissa' RETURN b.name;
```
Output:
```
----------
| b.name |
----------
| Adam   |
----------
| Zhang  |
----------
```

### Omit Binding Variables to Nodes or Relationships
You can also omit binding a variable to a node or relationship in your graph patterns if 
you will not use them in somewhere else in your query (e.g., WHERE or RETURN). For example, below, we query for 2-hop paths searching for "the cities that Users that "a" Users follows".
Because we do not need to return the Users that "a" Users follows or the properties
of the Follows and LivesIn edges that form these 2-paths, we can omit giving variable names to them.

```
MATCH (a:User)-[:Follows]->(:User)-[:LivesIn]->(c:City)
WHERE a.name = "Adam"
RETURN a, c.name, c.population;
```
```
---------------------------------------------------------------------
| a                                      | c.name    | c.population |
---------------------------------------------------------------------
| (label:User, 0:0, {name:Adam, age:30}) | Waterloo  | 150000       |
---------------------------------------------------------------------
| (label:User, 0:0, {name:Adam, age:30}) | Kitchener | 200000       |
---------------------------------------------------------------------
```

### Match Multiple Patterns
Although paths can be matched in a single pattern, some patterns, in particular
cyclic patterns, require specifying multiple patterns/paths that form the pattern.
These multiple paths are separated by a comma. The following is a (directed) triangle
query and returns the only triangle in the database between Adam, Karissa, and Zhang.

```
MATCH (a:User)-[:Follows]->(b:User)-[:Follows]->(c:User), (a)-[:Follows]->(c)
RETURN a.name, b.name, c.name;
```
Output:
```
-----------------------------
| a.name | b.name  | c.name |
-----------------------------
| Adam   | Karissa | Zhang  |
-----------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=NQIITQTloYO_).

Note that in the query node variables a and c appear twice, once on each of the 2 paths
in the query. In such cases, their labels need to be specified *only the first time they appear
in the pattern*. In the above query a and c's labels are defined on the first/left path, 
so you don't have to specify them on the right path (though you still can).

### Equality Predicates on Node/Rel Properties
The [WHERE clause](where.md) is the main clause to specify arbitary predicates on the nodes and relationships in your patters (e.g., a.age < b.age in where "a" and "b" bind to User nodes). 
As a syntactic sugar openCypher allows *equality predicates* to be matched on
nodes and edges using the `{prop1 : value1, prop2 : value2, ...}` syntax. For example: 
```
MATCH (a:User)-[e:Follows {since: 2020}]->(b:User {name: "Zhang"})
RETURN a, e.since, b.name;
```
is a syntactic sugar for:

```
MATCH (a:User)-[e:Follows]->(b:User)
WHERE e.since = 2020 AND b.name = "Zhang"
RETURN a, e.since, b.name;
```
and both queries output:
```
-------------------------------------------------------------
| a                                      | e.since | b.name |
-------------------------------------------------------------
| (label:User, 0:0, {name:Adam, age:30}) | 2020    | Zhang  |
-------------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=1frFFis4onqw).

## Match Variable Length Relationships
You can also find paths that are variable-length between node records. Specifically, you can find variable-hop connections between nodes by specifying in the relationship patterns,
e.g., `-[:Label*min..max]->`, where min and max specify the minimum and the maximum number of hops[^2].
The following query finds all Users that "Adam" follows within 1 to 2 hops and returns their names as well as length of the path.
```
MATCH (a:User)-[e:Follows*1..2]->(b:User) 
WHERE a.name = 'Adam'
RETURN b.name, length(e) AS length;
```
Output:
```
--------------------
| b.name  | length |
--------------------
| Karissa | 1      |
--------------------
| Zhang   | 2      |
--------------------
| Zhang   | 1      |
--------------------
| Noura   | 2      |
--------------------
```
- Karissa is found through `Adam -> Karissa`
- Zhang is found through `Adam -> Zhang` and `Adam -> Karissa -> Zhang`
- Noura is found through `Adam -> Zhang -> Noura`

Similar to matching relationships, you can match undirected relationships or relationship with multiple labels.
The following query finds all Nodes excluding "Noura" that connects to "Noura" in both directions through any relationship with 2 hops.
```
MATCH (a:User)-[e*2..2]-(b) 
WHERE a.name = 'Noura' AND b.name <> 'Noura'
RETURN b.name, length(e) AS length;
```
Output:
```
----------------------
| b.name    | length |
----------------------
| Adam      | 2      |
----------------------
| Karissa   | 2      |
----------------------
| Kitchener | 2      |
----------------------
```
- Adam is found through `Noura <- User -> Adam`
- Karissa is found through `Noura <- User -> Karissa`
- Kitchener is found through `Noura <- User -> Kitchener`

### Returning Variable Length Relationships
Current implmentation binds variable length relationships as a `LIST` of `INTERNAL_ID` where entries 0,2,4,... represent node IDs and entries 1,3,5,... represent relationship IDs.
```
MATCH (a:User)-[e:Follows*1..2]->(b:User) 
WHERE a.name = 'Adam'
RETURN b.name, e;
```
Output:
```
-----------------------------------
| b.name  | e                     |
-----------------------------------
| Karissa | [0:0,2:0,0:1]         |
-----------------------------------
| Zhang   | [0:0,2:0,0:1,2:2,0:2] |
-----------------------------------
| Zhang   | [0:0,2:1,0:2]         |
-----------------------------------
| Noura   | [0:0,2:1,0:2,2:3,0:3] |
-----------------------------------
```

**Fruther notes on variable length relationships**
- Returning properties of variable length relationships is not yet supported.
- The maximum length of variable length relationships is capped at 30. 

### Single Shortest Path
On top of variable length relationships, user can search for single shortest path by specifying `SHORTEST` key word in relationship, e.g. `-[:Label* SHORTEST min..max]`.
The following query finds all
```
MATCH (a:User)-[e* SHORTEST 1..4]->(b:City) 
WHERE a.name = 'Adam'
RETURN b.name, length(e) AS length;
```
Output:
```
----------------------
| b.name    | length |
----------------------
| Waterloo  | 1      |
----------------------
| Kitchener | 2      |
----------------------
| Guelph    | 3      |
----------------------
```

### All Shortest Path

**Further notes on shortest path**
- All shortest path or weighted shortest path is not yet supported.

[^1]: MATCH is similar to the FROM clause of SQL, where the list of tables that need to be joined are specified. 
[^2]: openCypher also supports variable-length patterns where either or both of min and max bounds can be missing. Kùzu does not yet support this and users need to explicitly indicate both bounds.
