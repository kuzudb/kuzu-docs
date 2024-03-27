---
title: Connection configuration
---

The configuration of a connection to Kùzu database can be changed through a standalone `CALL`
statement, described in this section. Different from the `CALL` clause, this statement of changing
configuration **cannot** be used with other query clauses.

| Option | Description |
| ----------- | --------------- |
| `THREADS` | number of threads used by execution |
| `TIMEOUT` | timeout of query execution in ms |
| `VAR_LENGTH_EXTEND_MAX_DEPTH` | maximum depth of var length extend |
| `ENABLE_SEMI_MASK` | enables the semi mask optimization |

## Change number of threads for execution

```cypher
CALL THREADS=5;
CALL current_setting('threads') return *;

-----------
| threads |
-----------
| 5       |
-----------
```

## Change query timeout

```cypher
CALL TIMEOUT=3000;
CALL current_setting('timeout') return *;

-----------
| timeout |
-----------
| 3000    |
-----------
```

## Change maximum depth of `var_length_extend`

```cypher
CALL var_length_extend_max_depth=10;
CALL current_setting('var_length_extend_max_depth') RETURN *;

-------------------------------
| var_length_extend_max_depth |
-------------------------------
| 10                          |
-------------------------------
```

## Disable semi-mask optimization

```cypher
CALL enable_semi_mask=false;
CALL current_setting('enable_semi_mask') RETURN *;

--------------------
| enable_semi_mask |
--------------------
| false            |
--------------------
```
