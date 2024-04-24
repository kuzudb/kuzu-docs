---
title: Skip
description: SKIP controls the number of tuples to skip from the start of the queryResult.
---

`SKIP` controls the number of tuples to skip from the start of the queryResult. It is often used within in an [ORDER BY](./order-by)
clause to skip the top k tuples from the query result.
Note: SKIP accepts any expression that can be evaluated to an integer.

We will use the example database for demonstration, whose schema and data import commands are given [here](../example-database).

For example, the following query skips the youngest 2 users
and returns the rest of the users' ages.
Query:
```cypher
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

If you omit the `ORDER BY`, you would skip some k tuples in a `SKIP` k query
but you have no guarantee about which ones will be skipped.
