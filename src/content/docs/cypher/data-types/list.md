---
title: LIST and ARRAY
---

Kùzu supports two list-like data types: (i) variable-length lists, simply called `LIST`, and (ii)
fixed-length lists, called `ARRAY`. `ARRAY` is a special case of `LIST`, where the length of the `LIST`
is known beforehand.

## LIST

A `LIST` can contain an arbitrary number of values, but they must all be of the same type. The types
inside a `LIST` can be any of those supported by Kùzu, including nested/complex types. Some examples are shown below:

- `STRING[]` is a `LIST` of `STRING` values
- `INT64[]` is a `LIST` of `INT64` values
- `STRING[][]` is a `LIST` of `LIST` of `STRING` values
- `MAP(STRING, STRING)[]` is a `LIST` of `MAP(STRING, STRING)` values

### Create a `LIST`

In Cypher, enclosing comma-separated values in square brackets will store the values as a `LIST`. The type
of the elements is inferred by the query parser during the binding stage.

```cypher
RETURN ["Alice", "Bob"] AS l;
```
Output:
```
---------------
| l           |
---------------
| [Alice,Bob] |
---------------
```

:::danger[Note]
If you try to create a `LIST` with elements that are of different types, an exception will be thrown.
```
kuzu> RETURN ["Alice", 1] AS l;
Error: Binder exception: Cannot bind LIST_CREATION with parameter type STRING and INT64.
```
:::

You can also create a `LIST` by explicitly calling the creation function as follows.

```cypher
RETURN list_creation(1,2,3,4) AS l;
```
Output:
```
-------------
| l         |
-------------
| [1,2,3,4] |
-------------
```

### `UNWIND` a `LIST`
```cypher
UNWIND [[1,2], [3], [4, 5]] AS x 
UNWIND x as y 
RETURN y;
```
Output:
```
-----
| y |
-----
| 1 |
-----
| 2 |
-----
| 3 |
-----
| 4 |
-----
| 5 |
-----
```

## ARRAY

`ARRAY` is a special case of `LIST`, in which the number of elements is fixed. Just like a `LIST`,
all values in `ARRAY` must be of the same type. The number of elements is specified as an
integer inside square brackets. Some examples are shown below:

- `INT64[256]` is an `ARRAY` of `INT64` values, with 256 elements
- `DOUBLE[512]` is an `ARRAY` of `DOUBLE` values, with 512 elements

An `ARRAY` is useful for storing items like embeddings (for use in similarity search or in machine learning
via our PyTorch Geometric integration), where the number of elements is fixed and known in advance.
