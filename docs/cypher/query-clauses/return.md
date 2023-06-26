---
title: Return
sidebar_position: 5
description: RETURN is similar to the `SELECT` clause of SQL. RETURN is where the final results of the query are specified.
---

import RunningExample from '../running-example.png';

# Database
We will use the database, whose schema and data import commands are given [here](example-database.md):

<img src={RunningExample} style={{width: 800}} />

You can import this database by copy pasting the commands on that page. 

# RETURN
`RETURN` is similar to the `SELECT` clause of SQL. RETURN is where the final results of the
query are specified, which can be listed as a list of expressions, e.g., variables that have
bound to nodes or relationships, aliases, or more complex expressions. RETURN can also be used 
for performing group-by and aggregations as well as duplication removing (using the `DISTINCT` clause). 
We discuss several common expressions used in RETURN.

## Returning Node and Relationship Variables
Returning variables in the query that are bound to node and relationships in the query 
is a syntactic sugar to return all properties of those variables. For example:
```
MATCH (a:User)-[e:Follows]->(b:User)
RETURN a, e;
```
Output:
```
---------------------------------------------------------------------------------------------------
| a                                         | e                                                   |
---------------------------------------------------------------------------------------------------
| (label:User, 0:0, {name:Adam, age:30})    | (0:0)-[label:Follows, {_id:2:0, since:2020}]->(0:1) |
---------------------------------------------------------------------------------------------------
| (label:User, 0:0, {name:Adam, age:30})    | (0:0)-[label:Follows, {_id:2:1, since:2020}]->(0:2) |
---------------------------------------------------------------------------------------------------
| (label:User, 0:1, {name:Karissa, age:40}) | (0:1)-[label:Follows, {_id:2:2, since:2021}]->(0:2) |
---------------------------------------------------------------------------------------------------
| (label:User, 0:2, {name:Zhang, age:50})   | (0:2)-[label:Follows, {_id:2:3, since:2022}]->(0:3) |
---------------------------------------------------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=gZ7zGvGQ0tZf).

## Returning All Variables
Returning all variables in the query can be written as `RETURN *` as a syntactic sugar. Below query returns "a" and "b", relationship is omitted because no variable binds to it.
```
MATCH (a:User)-[:Follows]->(b:User)
RETURN *;
```
Output:
```
-----------------------------------------------------------------------------------------
| b                                         | a                                         |
-----------------------------------------------------------------------------------------
| (label:User, 0:1, {name:Karissa, age:40}) | (label:User, 0:0, {name:Adam, age:30})    |
-----------------------------------------------------------------------------------------
| (label:User, 0:2, {name:Zhang, age:50})   | (label:User, 0:0, {name:Adam, age:30})    |
-----------------------------------------------------------------------------------------
| (label:User, 0:2, {name:Zhang, age:50})   | (label:User, 0:1, {name:Karissa, age:40}) |
-----------------------------------------------------------------------------------------
| (label:User, 0:3, {name:Noura, age:25})   | (label:User, 0:2, {name:Zhang, age:50})   |
-----------------------------------------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=N1EK35S419JF).


## Returning Node and Relationship Properties
You can also return properties of variables by explicitly specifying properties in the `RETURN` clause.
```
MATCH (a:User)-[e:Follows]->(b:User)
RETURN a.name, a.age, e.since;
```
Output:
```
-----------------------------
| a.name  | a.age | e.since |
-----------------------------
| Adam    | 30    | 2020    |
-----------------------------
| Adam    | 30    | 2020    |
-----------------------------
| Karissa | 40    | 2021    |
-----------------------------
| Zhang   | 50    | 2022    |
-----------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=rYG1C5gj2KNA).

## Using Distinct for Duplicate Elimination
You can use RETURN DISTINCT to do duplicate elimination of the returned tuples.
For example, if we instead wrote `RETURN DISTINCT` in the above query, we would
eliminate one of the 2 (Adam, 30, 2020) tuples above:
```
MATCH (a:User)-[e:Follows]->(b:User)
RETURN DISTINCT a.name, a.age, e.since;
```
Output:
```
-----------------------------
| a.name  | a.age | e.since |
-----------------------------
| Adam    | 30    | 2020    |
-----------------------------
| Karissa | 40    | 2021    |
-----------------------------
| Zhang   | 50    | 2022    |
-----------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=wvkKPDX22Wcl).

## Group By and Aggregations
You can group by one or more expression and perform one or more aggregations 
in a RETURN clause. For example:
```
MATCH (a:User)-[:Follows]->(b:User)
RETURN a, avg(b.age) as avgFriendAge;
```
Output:
```
------------------------------------------------------------
| a                                         | avgFriendAge |
------------------------------------------------------------
| (label:User, 0:0, {name:Adam, age:30})    | 45.000000    |
------------------------------------------------------------
| (label:User, 0:1, {name:Karissa, age:40}) | 50.000000    |
------------------------------------------------------------
| (label:User, 0:2, {name:Zhang, age:50})   | 25.000000    |
------------------------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1kA0jFcPGSVLSE6B1FeNDs6htsAQ6jZXf#scrollTo=7cPrEPXI4C1e).

The semantics is exactly the same as SQL's semantics, which is a 
3-step process: 
  1) for each tuple  t in the previous part of the query, i.e., before the RETURN clause, 
     group t according to (one or more) group by key expressions into a group. Let us refer
     to the result of these expressions as t's keys.
  2) For each group G, compute the (or or more) aggregations in the query.
  3) Output for each group G, G's key(s) and the result of the aggregations. 

You can find the list of aggregation functions supported in Kùzu [here](../expressions/aggregate-functions.md).

### Note on NULLs 
The handling of NULLs in group by keys and values also follow the SQL semantics:
  - All NULL keys are grouped into a single group.
  - NULL values are ignored in aggregations.
