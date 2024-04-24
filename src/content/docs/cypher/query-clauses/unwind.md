---
title: Unwind
description: UNWIND allows you to "unnest" a list L that has k elements in it, into a table T with k element. 
---

`UNWIND` allows you to "unnest" a list L that has k elements in it,
into a table T with k element.
When using UNWIND, you need to specify an alias to refer to the elements
of the unnested list, i.e., T.

We will use the example database for demonstration, whose schema and data import commands are given [here](../example-database).

For example, the following unnests a literal "list of strings" into multiple rows 
and return them:

```cypher
UNWIND ["Amy", "Bob", "Carol"] AS x
RETURN x;
```

Output:
```
---------
| x     |
---------
| Amy   |
---------
| Bob   |
---------
| Carol |
---------
```

If the `UNWIND`ed list L contained as elements other lists,
then the output would be elements with one fewer nesting. For example, if L was a list of 
list of strings, after unwinding, you'd get a table of list of strings. For example:

```cypher
UNWIND [["Amy"], ["Bob", "Carol"]] AS x
RETURN x;
```
Output:
```
---------------
| x           |
---------------
| [Amy]       |
---------------
| [Bob,Carol] |
---------------
```
