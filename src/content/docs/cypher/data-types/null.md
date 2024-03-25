---
title: Null Value
sidebar_position: 6
---

# NULL Values
`NULL`s are special values to represent unknown data. Every node/relationship property or result of any expression can be `NULL` in addition to the non-`NULL` domain of values they can take. For example, boolean expression can be true/false or `NULL`.

The `NULL` (in any of its case variations, such as `Null` or `null`) can be
used to specify a null literal. Below ares some examples:


### Compare value with `NULL`
```
RETURN 3 = null;
```
Output:
```
------------
| 3 = null |
------------
|          |
------------
```

### Compare `NULL` with `NULL`
```
RETURN null = null;
```
Output:
```
---------------
| null = null |
---------------
|             |
---------------
```
Kùzu's CLI returns an empty cell to indicate nulls.
