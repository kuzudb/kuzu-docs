---
title: With
description: WITH can be used to project some expressions, and possibly compute some aggregations, from what your query has computed up to a point before starting the next part of your query. 
---

`WITH` can be used to project some expressions, and possibly compute some aggregations, from what your query has computed up 
to a point before starting the next part of your query. Although there are other common use cases
two very common cases of using WITH are: (1) to compute a numeric result, often through an aggregation, 
that can be used as a predicate in the following parts; and (2) performing a "top-k" computation on 
some query, before performing other querying on those top-k. We give examples of each.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database).

### Using WITH for aggregations
The following query returns all Users whose ages are greater than the average age of Users in the database. This
can be done in two steps: (i) compute the average age of Users in the database and assign it to an alias `avgAge`;
and (ii) use `avgAge` in a following query part in a comparison predicate. This is done in the following query:
```cypher
MATCH (a:User) 
WITH avg(a.age) as avgAge 
MATCH (b:User) 
WHERE b.age > avgAge 
RETURN *;
```

```
---------------------------------------------------------
| b                                         | avgAge    |
---------------------------------------------------------
| (label:User, 0:1, {name:Karissa, age:40}) | 36.250000 |
---------------------------------------------------------
| (label:User, 0:2, {name:Zhang, age:50})   | 36.250000 |
---------------------------------------------------------
```

## Using WITH for top-k computations
Suppose you want to return the Users that the oldest Users in your database follows. This can be done
in two steps: (i) compute the oldest person "a"; and (ii) find the Users that "a" follows and return.  
This is done in the below query:
```cypher
MATCH (a:User)
WITH a
ORDER BY a.age DESC 
LIMIT 1 
MATCH (a)-[:Follows]->(b:User) 
RETURN *;
```

```
-------------------------------------------------------------------------------------
| b                                       | a                                       |
-------------------------------------------------------------------------------------
| (label:User, 0:3, {name:Noura, age:25}) | (label:User, 0:2, {name:Zhang, age:50}) |
-------------------------------------------------------------------------------------
```

The part of the query until LIMIT computes the oldest user Zhang (aged 50) and then the last `MATCH (a)-[:Follows]->(b:User) RETURN *` returns
the users that `Zhang` follows (there is only one such user, who is `Noura`.) 
