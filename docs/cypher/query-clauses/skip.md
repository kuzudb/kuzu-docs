---
title: Skip
sidebar_position: 7
description: SKIP controls the number of tuples to skip from the start of the queryResult.
---

import RunningExample from '../running-example.png';

# SKIP
`SKIP` controls the number of tuples to skip from the start of the queryResult. It is often used within in an [ORDER BY](order-by.md) 
clause to skip the top k tuples from the query result. 
Note: SKIP accepts any expression that can be evaluated to an integer.

We will use the example database for demonstration, whose schema and data import commands are given [here](../query-clauses/example-database.md).

For example, the following query skips the youngest 2 users
and returns the rest of the users' ages.
Query:
```
MATCH (u:User)
RETURN u.name
ORDER BY u.age
SKIP 2;
```
Result:
```
-----------
| u.name  |
-----------
| Karissa |
-----------
| Zhang   |
-----------
```
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=V1r5jFPJB5Nk).

If you omit the ORDER BY, you would skip some k tuples in a SKIP k query 
but you have no guarantee about which ones will be skipped.
