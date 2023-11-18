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


The boolean predicate specified above can be understood as it reads: Users "a" whose ages are
greater than 45 OR whose names start with "Kar". It combines several means to construct expressions in high-level database query languages, such as as boolean operator (OR), a numeric comparison operator (>), and a string function (starts_with). You can learn more about the operators and functions on [functions and expressions](../expressions) and there. 

### Filter with NULL
If an expression is evaluated as NULL, it will be treated as FALSE in `WHERE` clause. To check if an expression is NULL, please refer to [comparison operators on NULLs](../data-types/null.md).

The following predicate in the WHERE clause filters User nodes whose name start with "Kar" and whose age properties are not NULL.
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
