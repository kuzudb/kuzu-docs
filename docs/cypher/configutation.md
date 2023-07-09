---
title: Database Configuration
sidebar_position: 4
---

# Database Configutation

The configuration of Kùzu can be changed through standalone `Call` statement. Different from the `Call` clause, this statement of changing configuration cannot be used with other query clauses.

| Option | Description |
| ----------- | --------------- |
| THREADS | number of threads used by execution |
| TIMEOUT | timeout of query execution in ms | 

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

