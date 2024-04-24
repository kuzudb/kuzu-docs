---
title: Limit
description: LIMIT controls the number of tuples returned from a query.
---

`LIMIT` controls the number of tuples returned from a query. It is often used within in an [ORDER BY](./order-by)
clause to fetch the top-k tuples from the query result. Note that `LIMIT` accepts any expression that can be evaluated to an integer.

We will use the example database for demonstration, whose schema and data import commands are given [here](../../cypher/query-clauses/example-database).

For example, the following query returns the top three oldest users.

```cypher
MATCH (u:User)
RETURN u.name
ORDER BY u.age DESC
LIMIT 3;
```
Result:
```
-----------
| u.name  |
-----------
| Zhang   |
-----------
| Karissa |
-----------
| Adam    |
-----------
```

If you omit the `ORDER BY`, you would get some k tuples in a `LIMIT k` query
but you have no guarantee about which ones will be selected.

