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

#### Notes: 
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
Similar to binding variables to node records, you can bind variables to relationship records and return them. You can specify the direction of relationship by `<-` or `->`. The following query finds all "a" Users that follow a "b" User through an outgoing relationship from "a", and returns name of "a", relationship "e", and name of "b", where "e" will match the relationship from "a" to "b".
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
---------------------------------------------------------
| e                                                     |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) |
---------------------------------------------------------
| (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) |
---------------------------------------------------------
| (0:0)-{_LABEL: LivesIn, _ID: 3:0, }->(1:0)            |
---------------------------------------------------------
| (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) |
---------------------------------------------------------
| (0:1)-{_LABEL: LivesIn, _ID: 3:1, }->(1:0)            |
---------------------------------------------------------
| (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) |
---------------------------------------------------------
| (0:2)-{_LABEL: LivesIn, _ID: 3:2, }->(1:1)            |
---------------------------------------------------------
| (0:3)-{_LABEL: LivesIn, _ID: 3:3, }->(1:2)            |
---------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=lEZAboFLfLku).

### Match Undirected Relationships
Users can match a relationship in both directions by not specifiying a relationship direction (i.e. `-`). The following query finds all "b" users who either follows or being followed by "Karissa". 

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
you will not use them in somewhere else in your query (e.g., WHERE or RETURN). For example, below, we query for 2-hop paths searching for "the cities of Users that "a" Follows".
Because we do not need to return the Users that "a" Users follows or the properties
of the Follows and LivesIn edges that form these 2-paths, we can omit giving variable names to them.

```
MATCH (a:User)-[:Follows]->(:User)-[:LivesIn]->(c:City)
WHERE a.name = "Adam"
RETURN a, c.name, c.population;
```
```
----------------------------------------------------------------------------
| a                                             | c.name    | c.population |
----------------------------------------------------------------------------
| {_ID: 0:0, _LABEL: User, name: Adam, age: 30} | Waterloo  | 150000       |
----------------------------------------------------------------------------
| {_ID: 0:0, _LABEL: User, name: Adam, age: 30} | Kitchener | 200000       |
----------------------------------------------------------------------------
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
--------------------------------------------------------------------
| a                                             | e.since | b.name |
--------------------------------------------------------------------
| {_ID: 0:0, _LABEL: User, name: Adam, age: 30} | 2020    | Zhang  |
--------------------------------------------------------------------
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

A varible length relationship is a `STURCT{LIST[NODE], LIST[REL]}`. Returning a variable length relationship will return all properties 
```
MATCH (a:User)-[e:Follows*1..2]->(b:User) 
WHERE a.name = 'Adam'
RETURN b.name, e;
```
Output:
```
----------------------------------------------------------------------------------------------
| b.name  | e                                                                                |
----------------------------------------------------------------------------------------------
| Karissa | {_NODES: [], _RELS: [(0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1)]}     |
----------------------------------------------------------------------------------------------
| Zhang   | {_NODES: [{_ID: 0:1, _LABEL: User, name: Karissa, age: 40}], _RELS: [(0:0)-{_... |
----------------------------------------------------------------------------------------------
| Zhang   | {_NODES: [], _RELS: [(0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2)]}     |
----------------------------------------------------------------------------------------------
| Noura   | {_NODES: [{_ID: 0:2, _LABEL: User, name: Zhang, age: 50}], _RELS: [(0:0)-{_LA... |
----------------------------------------------------------------------------------------------
```

**Further notes on variable length relationships**
- The maximum length of variable length relationships is capped at 30. 

### Filter Variable Length Relationships
We also support running predicates on recursive patterns to constrain the relationship being traversed.

The following query finds name of users that are followed between 1 - 2 hops by Adam before 2022.
```
MATCH p = (a:User)-[:Follows*1..2 (r, _ | WHERE r.since < 2022) ]->(b:User)
WHERE a.name = 'Adam' 
RETURN DISTINCT b.name;
```
Output:
```
-----------
| b.name  |
-----------
| Karissa |
-----------
| Zhang   |
-----------
```
Our filter grammar follows [Memgraph](https://memgraph.com/docs/memgraph/reference-guide/built-in-graph-algorithms) using list comprehension. The first variable represents intermedaite relationships and the second one represents intermediate nodes. Filtering on node property is not supported currently.

### Projecting Properties of Intermediate Nodes and Relationships in Variable Length Relationships
You can project a subset of properties for the intermediate nodes and relationships that will bound to a variable length
relationship. You can define the projection list of intermediate nodes and rels within two curly brackets `{}` `{}` at 
the end of the variable length pattern. The first `{}` is used for projecting relationship properties and the second `{}` for 
node properties. Currently, Kùzu only supports directly projecting properties and not of expresions using
the properties. Projecting properties of intermedaite nodes and rels can improve both performance and memory footprint.
Here is an example that projects only the `since` property of the intermediate relationship and the `name` property of the 
intermediate nodes that will bind to the variable length relationship pattern of `e`.

```
MATCH (a:User)-[e:Follows*1..2 (r, n | WHERE r.since > 2020 | {r.since}, {n.name})]->(b:User) 
RETURN nodes(e), rels(e);
------------------------------------------------------------------------------------------------------------------------------
| NODES(e)                                | RELS(e)                                                                          |
------------------------------------------------------------------------------------------------------------------------------
| []                                      | [(0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2)]                          |
------------------------------------------------------------------------------------------------------------------------------
| [{_ID: 0:2, _LABEL: User, name: Zhang}] | [(0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2),(0:2)-{_LABEL: Follows... |
------------------------------------------------------------------------------------------------------------------------------
| []                                      | [(0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3)]                          |
------------------------------------------------------------------------------------------------------------------------------
```
As can be seen in the output, the nodes that bind to `e` contain only the `name` property and the relationships that
bind to `e` contain only the `since` property.


### Single Shortest Path
On top of variable length relationships, users can search for single shortest path by specifying `SHORTEST` key word in relationship, e.g. `-[:Label* SHORTEST 1..max]`.
The following query finds a shortest path between `Adam` and any city and returns city name as well as length of the path.
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
You can also search for all shortest path with `ALL SHORTEST` key word, e.g. `-[:Label* ALL SHORTEST 1..max]`

The following query finds all shortest path between `Zhang` and `Waterloo`.
```
MATCH p = (a)-[* ALL SHORTEST 1..3 ]-(b) 
WHERE a.name = 'Zhang' AND b.name = 'Waterloo' 
RETURN COUNT(*) AS num_shortest_path;
```
Output:
```
---------------------
| num_shortest_path |
---------------------
| 2                 |
---------------------
```

**Further notes on shortest path**
We force the lower bound of shortest path to be 1 to avoid ambiguity. There are two interpretations when the lower bound is greater than 1, 
- Compute shortest path and then return the path whose length is greater than the lower bound.
- Compute the path with length greater than lower bound and then return the shortest path.

## Named Path
Kùzu treats paths as a first-class citizen, so users can assign a named variable to a path (i.e. connected graph ) and use it later on.
 
The following query returns all paths between `Adam` and `Karissa`.
```
MATCH p = (a:User)-[:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
RETURN p;
```
Output:
```
------------------------------------------------------------------------------------
| p                                                                                |
------------------------------------------------------------------------------------
| {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: Us... |
------------------------------------------------------------------------------------
```
Named paths can also be assigned to recursive graph patterns.
```
MATCH p = (a:User)-[:Follows*1..2]->(:User)-[:LivesIn]->(:City) 
WHERE a.name = 'Adam' 
RETURN p;
```
Output:
```
------------------------------------------------------------------------------------
| p                                                                                |
------------------------------------------------------------------------------------
| {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30, },{_ID: 0:1, _LABEL: ... |
------------------------------------------------------------------------------------
| {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30, },{_ID: 0:2, _LABEL: ... |
------------------------------------------------------------------------------------
| {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30, },{_ID: 0:1, _LABEL: ... |
------------------------------------------------------------------------------------
| {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30, },{_ID: 0:2, _LABEL: ... |
------------------------------------------------------------------------------------
```
Multiple named path can appear in a single `MATCH` clause.
```
MATCH p1 = (a:User)-[:Follows]->(b:User), p2 = (b)-[:LivesIn]->(:City) 
WHERE a.name = 'Adam' 
RETURN p1, p2;
```
Output:
```
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
| p1                                                                               | p2                                                                               |
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
| {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: Us... | {_NODES: [{_ID: 0:1, _LABEL: User, name: Karissa, age: 40, },{_ID: 1:0, _LABE... |
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
| {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: Us... | {_NODES: [{_ID: 0:2, _LABEL: User, name: Zhang, age: 50, },{_ID: 1:1, _LABEL:... |
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
```

### Extracting Nodes, Rels From a Path
Interanally `PATH` is processed as a `STRUCT{LIST[NODE], LIST[REL]}` see [`PATH data type`](../data-types/path.md) for details. Users can access nodes and rels within a path through `nodes(p)` and `rels(p)` function calls.

```
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN nodes(p), (rels(p)[1]).since AS since;
```
Output:
```
--------------------------------------------------------------------------------------------
| NODES(p)                                                                         | since |
--------------------------------------------------------------------------------------------
| [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name:... | 2020  |
--------------------------------------------------------------------------------------------
| [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name:... | 2020  |
--------------------------------------------------------------------------------------------
| [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: User, name:... | 2020  |
--------------------------------------------------------------------------------------------
| [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: User, name:... | 2020  |
--------------------------------------------------------------------------------------------
```
More path functions can be found [here](../expressions/path_functions.md).

[^1]: MATCH is similar to the FROM clause of SQL, where the list of tables that need to be joined are specified. 
[^2]: Max number of hop will be set to 30 if omitted. You can change the configuration through `SET` statement.
