---
title: Where
description: WHERE clause is where you specify predicates/constraints on a previous part of your query.
---

`WHERE` clause is where you specify predicates/constraints on a previous part of your query.
Regardless of what comes before WHERE, the semantics of WHERE is this two step computation:

1. `WHERE` takes the tuples that the previous parts of your query has generated (up to the WHERE clause);
1. It then runs the boolean predicate specified in the WHERE clause and outputs those that pass the predicates to
the next part of your query.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database).

For example:

```cypher
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

The boolean predicate specified above can be understood as it reads: Users "a" whose ages are
greater than 45 OR whose names start with "Kar". It combines several means to construct expressions in high-level database query languages, such as as boolean operator (OR), a numeric comparison operator (>), and a string function (starts_with). You can learn more about the operators, functions and expressions [here](/cypher/expressions).

## Filter with NULL
If an expression is evaluated as NULL, it will be treated as FALSE in `WHERE` clause. To check if an expression is NULL, please refer to [comparison operators on NULLs](/cypher/data-types/null).

The following predicate in the WHERE clause filters User nodes whose name start with "Kar" and whose age properties are not NULL.
```cypher
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
