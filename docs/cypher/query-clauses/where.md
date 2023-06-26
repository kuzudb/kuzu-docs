---
title: Where
sidebar_position: 3
description: WHERE clause is where you specify predicates/constraints on a previous part of your query.
---

import RunningExample from '../running-example.png';

# Database
We will use the database, whose schema and data import commands are given [here](example-database.md):

<img src={RunningExample} style={{width: 800}} />

You can import this database by copy pasting the commands on that page. 

# WHERE
`WHERE` clause is where you specify predicates/constraints on a previous part of your query.
Regardless of what comes before WHERE, the semantics of WHERE is this two step computation: 
  - (i) WHERE take the tuples  that the previous parts of your query has generated (up to the WHERE clause);
  - (ii) and runs the boolean predicate specified in the WHERE clause and outputs those that pass the predicates to
    the next part of your query.

For example:

```
MATCH (a:User)
WHERE a.age > 45 OR starts_with(a.name, "Kar")
RETURN *;
```
Output:
```
---------------------------------------------
| a                                         |
---------------------------------------------
| (label:User, 0:1, {name:Karissa, age:40}) |
---------------------------------------------
| (label:User, 0:2, {name:Zhang, age:50})   |
---------------------------------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=D_u4RtEbsDv8).


The boolean predicate/expression specified above can be understood as it reads: Users "a" whose ages are
greater than 45 OR whose names start with "Kar". It combines several means to construct expressions
in high-level database query languages, such as as boolean operator (OR), a numeric comparison operator (>),
and a string function (starts_with). You can learn more about the operators and functions Kùzu supports
in the documentation on [functions and expressions](../expressions) and there. 

Note on checking if an expression is NULL or not: There is a special syntax, IS NULL or IS NOT NULL,
in openCypher to check if the result of an expression is NULL. For example, the following
predicate in the WHERE clause filters User nodes whose name start with "Kar" and whose age 
properties are not NULL (in our database all age values are not null, so this part 
of the predicate is true for each User node in the database).
```
MATCH (a:User)
WHERE a.age IS NOT NULL AND starts_with(a.name, "Kar")
RETURN *;
```
Output:
```
---------------------------------------------
| a                                         |
---------------------------------------------
| (label:User, 0:1, {name:Karissa, age:40}) |
---------------------------------------------
```
Please refer to these links for details on query semantics when using 
[logical operators](../expressions/logical-operators.md) and [comparison operators on NULLs](../data-types/null.md).

# WHERE EXISTS (...) Subqueries
One special and powerful use of predicates in the WHERE clause is to check
if a subquery SubQ that depends on the input tuples to WHERE
is empty or not. You can use the `WHERE EXISTS (SubQ)` syntax. For example,
the following query searches for all Users's who have at least one 3-hop Follows
path starting from them.

```
MATCH (a:User)
WHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User)} 
RETURN a.name, a.age;
```
Output:
```
------------------
| a.name | a.age |
------------------
| Adam   | 30    |
------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=12JMqYmA3Iol).

Note that in openCypher sub-queries are not arbitrary openCypher queries. They can only contain *a single MATCH clause* optionally
followed by a WHERE clause, e.g., no OPTIONAL MATCH, WITH or RETURN clauses.

You can also form nested sub-queries, i.e., a WHERE EXISTS sub-query inside another WHERE EXISTS. For example:

```
MATCH (a:User)
WHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User) WHERE EXISTS {MATCH (b)-[:Follows]->(c:User)} } 
RETURN a.name, a.age;
```
Output:
```
------------------
| a.name | a.age |
------------------
```
This query returns an empty result because in our example database, only User node Adam has a 3-hop Follows path and the destination
"b" node of that path is the User node Noura. However, Noura does not have an outgoing Follows relationship, which is the predicate in the 
inner WHERE EXISTS sub-query. If we instead specified that the destination b node has an incoming edge, by swapping the direction
of the relationship in the inner `(b)-[:Follows]->(c:User)` pattern to (b)<-[:Follows]-(c:User)`, we would get the
`(Adam, 30)` tuple back because Noura has incoming Follows relationships.

```
MATCH (a:User)
WHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User) WHERE EXISTS {MATCH (b)<-[:Follows]-(c:User)} } 
RETURN a.name, a.age;
```
Output:
```
------------------
| a.name | a.age |
------------------
| Adam   | 30    |
------------------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=iuHDzuVu3g7A).
