---
title: Limit
sidebar_position: 8
description: LIMIT controls the number of tuples returned from a query.
---

import RunningExample from '../running-example.png';

# Database
We will use the database, whose schema and data import commands are given [here](example-database.md):

<img src={RunningExample} style={{width: 800}} />

You can import this database by copy pasting the commands on that page. 

# LIMIT
`LIMIT` controls the number of tuples returned from a query. It is often used within in an [ORDER BY](order-by.md) 
clause to fetch the top k tuples from the query result. 
Note: LIMIT accepts any expression that can be evaluated to an integer.

For example, the following query returns the top three oldest users.
Query:
```
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
View example in [Colab](https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=9FHlBkwxCWSc).

If you omit the ORDER BY, you would get some k tuples in a `LIMIT k` query 
but you have no guarantee about which ones will be selected.

