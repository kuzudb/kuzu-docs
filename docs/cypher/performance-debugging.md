---
title: Performance Debugging
sidebar_position: 5
---

# EXPLAIN and PROFILE

In order to see the query plans that Kùzu uses, you can
type EXPLAIN and PROFILE before your query. You can do 
this to debug the performance of the system on a particular
query. Both of these
commands print the query plan. PROFILE in addition
runs the plan, produces the output, and collects runtime 
information for each operator in the plan, which will be 
shown inside the operators. EXPLAIN only shows the plan 
Kùzu's query compiler/optimizer produced, with 0 for
each execution time. Here's a very simple example
from the CLI.

```
kuzu> PROFILE MATCH (a:User) RETURN a.name
-----------
| a.name  |
-----------
| Adam    |
-----------
| Karissa |
-----------
| Zhang   |
-----------
| Noura   |
-----------
(4 tuples)
Time: 0.32ms (compiling), 0.15ms (executing)
==============================================
=============== Profiler Summary =============
==============================================
>> plan
┌──────────────────────────────┐
│┌────────────────────────────┐│
││       Physical Plan        ││
│└────────────────────────────┘│
└──────────────────────────────┘
┌──────────────────────────────┐
│       RESULT_COLLECTOR       │
│   ------------------------   │
│          _0_a.name           │
│   ------------------------   │
│   ExecutionTime: 0.020000    │
│   ------------------------   │
│      NumOutputTuples: 0      │
└──────────────┬───────────────┘
┌──────────────┴───────────────┐
│          PROJECTION          │
│   ------------------------   │
│          _0_a.name           │
│   ------------------------   │
│   ExecutionTime: 0.000000    │
│   ------------------------   │
│      NumOutputTuples: 1      │
└──────────────┬───────────────┘
┌──────────────┴───────────────┐
│   SCAN_STRUCTURED_PROPERTY   │
│   ------------------------   │
│           _0_a.name          │
│   ------------------------   │
│   ExecutionTime: 0.003000    │
│   ------------------------   │
│      NumOutputTuples: 0      │
└──────────────┬───────────────┘
┌──────────────┴───────────────┐
│         SCAN_NODE_ID         │
│   ------------------------   │
│              a               │
│   ------------------------   │
│   ExecutionTime: 0.000000    │
│   ------------------------   │
│      NumOutputTuples: 4      │
└──────────────────────────────┘
```
