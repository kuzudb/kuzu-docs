---
title: Database Configuration
sidebar_position: 15
---

# Database Configuration

The configuration of Kùzu can be changed through standalone `Call` statement. Different from the `Call` clause, this statement of changing configuration cannot be used with other query clauses.

| Option | Description |
| ----------- | --------------- |
| THREADS | number of threads used by execution |
| TIMEOUT | timeout of query execution in ms | 
| VAR_LENGTH_EXTEND_MAX_DEPTH | maximum depth of var length extend |
| ENABLE_SEMI_MASK | eenables the semi mask optimization |

### Change Number of Threads for Execution

```
CALL THREADS=5;
CALL current_setting('threads') return *;

-----------
| threads |
-----------
| 5       |
-----------
```


### Change Query Timeout

```
CALL TIMEOUT=3000;
CALL current_setting('timeout') return *;

-----------
| timeout |
-----------
| 3000    |
-----------
```

### Change maximum depth of var length extend

```
CALL var_length_extend_max_depth=10;
CALL current_setting('var_length_extend_max_depth') RETURN *;

-------------------------------
| var_length_extend_max_depth |
-------------------------------
| 10                          |
-------------------------------
```

### Disable semi mask optimization

```
CALL enable_semi_mask=false;
CALL current_setting('enable_semi_mask') RETURN *;

--------------------
| enable_semi_mask |
--------------------
| false            |
--------------------
```
