---
title: Database internals
---

## Database modules

The following sections describes the role of each module under `src/` directory.

### Parser

The parser transforms an input string statement into Kùzu's internal AST, called a `Statement`. Parser validates the syntax correctness of the input statement. An input statement will first be parsed into an antlr4 AST according to the grammar file under `src/antlr4/Cypher.g4`. We then perform a bottom-up traversal over the antlr4 AST and transform into `Statement` through `Transformer`.

### Binder

Binder binds `Statement` into another AST called `BoundStatement`. It also validates the semantic correctness of the input statement and binds the string representation into an internal representation (mostly integer). For example, a table name will be bound into an internal table ID.

In addition, the Binder also performs a semantic rewrite of `BoundStatement`. Semantic rewrites don't change the semantics of a `BoundStatement` but will rewrite it in a way for performant evaluation. Example: `MATCH (a) WITH a RETURN a.name` will be written as `MATCH (a) RETURN a.name`

### Planner

Planner takes a `BoundStatement` as input and generates a `LogicalPlan`. A logical plan is a sequence of logical operator each of which can be mapped to a relational algebra concept, e.g. `SCAN`, `FILTER`, `PROJECTION`, `JOIN`, etc. The Planner only guarantees the correctness of the logical plan and doesn't address anything to do with regard to performance.

### Optimizer

Optimizer contains a set of optimization rules. Each rule is a transformation from one `LogicalPlan` into another `LogicalPlan`. The transformation should guarantee the correctness of the plan.

### Processor

Processor takes a `LogicalPlan` as an input and maps it to a `PhysicalPlan`. A physical plan is a sequence of physical operators, each of which is an implementation of logical operators with a specific algorithm. For example, a logical `JOIN` can be mapped into physical `INDEX_NESTED_LOOP_JOIN` or `HASH_JOIN`.

In addition, the processor contains a task scheduler which breaks down a physical plan into multiple pipelines for [morsel-driven parallelism](./execution.md).

### Expression evaluator

Expression evaluator is light-weight physical operator that's used to evaluate expressions. For e.g., `... RETURN a.age + 1` is mapped to a physical projection with an expression evaluator for `a.age + 1`.

### Function

Function module contains all functions (scalar functions, aggregate functions & table functions) that are available in the system.

### Catalog

Catalog module contains schema-level information that are generated through DDL.

### Storage

Storage module contains data that needs to be persistent to disk. Specifically:

- **BufferManager**: manage all memories being used in the system (except for small memories that are allocated from OS); cache recently read pages in memory.
- **Index**: Hash index for primary keys.
- **Column**: Vanilla column data structure.
- **List**: CSR-like data structure.
- **NodeTable**: A collection of multiple columns.
- **RelTable**: Contains a forward and a backward `DirectedRelData`, each of which is a collection of multiple columns/lists.
- **NodeGroup**: Horizontally partitioned table. Similar to RowGroup concept.
- **WAL**: Write-ahead Log.

### Transaction

Transaction module implements the transaction and manager and objects.

### Common

Common module contains common logic used across different modules. Header files in common do not depend on headers in other modules.

## Statement evaluation workflow

```
StatementResult
    |            Processor
PhysicalPlan
    |            Mapper
LogicalPlan
    |            Optimizer
LogicalPlan
    |            Planner
BoundStatement
    |            Binder
Statement  
    |            Parser
String Input
```
