---
title: Limit
description: The LIMIT clause controls the number of tuples returned from a query.
---

The `LIMIT` clause controls the number of tuples returned from a query. It is often used within an [ORDER BY](/cypher/query-clauses/order-by)
clause to fetch the top-k tuples of a query result.

Using the [example dataset](/cypher/query-clauses/example-database), the following query returns the three oldest users:


```cypher
MATCH (u:User)
RETURN u.name
ORDER BY u.age DESC
LIMIT 3;
```
```
┌─────────┐
│ u.name  │
│ STRING  │
├─────────┤
│ Zhang   │
│ Karissa │
│ Adam    │
└─────────┘
```

If you omit the `ORDER BY`, there is no guarantee about which three tuples will be returned.

You can use a literal expression:
```cypher
MATCH (u:User)
RETURN u.name
LIMIT 1+2
```
```
┌─────────┐
│ u.name  │
│ STRING  │
├─────────┤
│ Adam    │
│ Karissa │
│ Zhang   │
└─────────┘
```
 
You can also use a parameter expression when used with a prepared statement. For example, in Python:

```python
conn.execute("MATCH (u:User) RETURN u.name LIMIT $limit", {"limit": 1})
```
```
┌────────┐
│ u.name │
│ STRING │
├────────┤
│ Adam   │
└────────┘
```