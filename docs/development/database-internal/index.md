import DocCardList from '@theme/DocCardList';

# Database Internal

## Database Modules

The following sections descibes the role of each module under `src/` directory.

### Parser

Parser transforms an input string statement into Kùzu internal AST called `Statement`. Parser validates the syntax correctness of the input statement. An input statement will first be parsed into an antlr4 AST according to the grammar file under `src/antlr4/Cypher.g4`. We then perform a bottom-up traversal over the antlr4 AST and transform into `Statement` through `Transformer`.

### Binder

Binder binds `Statement` into another AST called `BoundStatement`. Binder validates the semantic correctness of the input statement. Binder binds string representation into internal representation (mostly integer). For example, a table name will be bound into an internal table ID.

In addition, Binder also performs semantic rewrite of `BoundStatement`. Semantic rewrite doesn't change the semantic of a `BoundStatement` but will rewrite it in a way for performant evaluation. E.g. `MATCH (a) WITH a RETURN a.name` will be written as `MATCH (a) RETURN a.name`

### Planner

Planner takes a `BoundStatement` as input and generates a `LogicalPlan`. A logical plan is a sequence of logical operator each of which can be mapped to a relational algebra concept, e.g. `SCAN`, `FILTER`, `PROJECTION`, `JOIN`.... Planner only guarantees the correctness of logical plan and does NOT care about performance.

### Optimizer

Optimizer contains a set of optimization rules. Each rule is a transformation from one `LogicalPlan` into another `LogicalPlan`. The transformation should guarantee the correctness of the plan.

### Processor

Processor takes a `LogicalPlan` as an input and mapped into a `PhysicalPlan`. A physical plan is a seuence of phyiscal operator each of which is an implementation of logical operator with a specific algorithm. E.g. logical `JOIN` can be mapped into phyiscal `INDEX_NESTED_LOOP_JOIN` or `HASH_JOIN`.

In addition, processor contains a task schedular which breaks down a physical plan into multiple pipelines for [morsel-driven prallelism](./execution.md).

### Expression Evaluator

Expression evaluator is light-weight physical operator that used to evaluate expression. E.g. `... RETURN a.age + 1` is mapped to a physical projection with an expression evaluator for `a.age + 1`.

### Function

Function module contains all functions (scalar functions, aggregate functions & table functions) that are available in the system.

### Catalog

Catalog module contains schema level informations that are generated through DDL.

### Storage

Storage module contains data that needs to be persistent on disk. Spefically,
- BufferManager: manage all memories being used in the system (except for small memories that are allocated from OS); cache recently read pages in memory.
- Index: hash index for primary keys.
- Column: vanilla column data structure.
- Lists: CSR-like data structure.
- NodeTable: a collection of multiple columns.
- RelTable: contains a forward and a backward DirectedRelData each of which is a collection of multiple columns/lists.
- NodeGroup: horizontally partitioned table. Similar to RowGroup concept.
- WAL: write ahead log.

### Transaction

Transaction module implements transaction object and manager.

### Common

Common module contains common logic used across different modules. Header files in common should NOT depends on header in other modules.

## Statement Evaluation Workflow

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
