---
title: Subquery
sidebar_position: 13
---
import RunningExample from './running-example.png';

<img src={RunningExample} style={{width: 800}} />

Subquery in Kùzu can only be a single `MATCH` clause optionally followed by a `WHERE` clause. No other clauses is allowed.

## Exists Subquery

Exists subquery checks if given pattern has at least one match in the graph.

The following query searches for all Users's who have at least one 3-hop Follows
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

### Nested Exists Subquery
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
This query returns an empty result because in example database, only "Adam" has a 3-hop Follows path and the destination "b" node of that path is "Noura". However, "Noura" does not have an outgoing Follows relationship. 

If we instead specified that the destination b node has an incoming edge, by swapping the direction
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


## Count Subquery

Count subquery checks the number of matches for given pattern in the graph. The output of this counting can be bound to a variable with aliasing.
For example, the following query counts number of followers for each user.
```
MATCH (a:User) RETURN a.name, COUNT { MATCH (a)<-[:Follows]-(b:User) } AS num_follower ORDER BY num_follower;
```
Output:
```
--------------------------
| a.name  | num_follower |
--------------------------
| Adam    | 0            |
--------------------------
| Karissa | 1            |
--------------------------
| Noura   | 1            |
--------------------------
| Zhang   | 2            |
--------------------------
```
A count subquery can also be used in a `WHERE` clause as an expression that returns an integer value.

```
MATCH (a:User) 
WHERE COUNT { MATCH (a)<-[:Follows]-(b:User) } = 1
RETURN a.name;
```
