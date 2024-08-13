---
title: Syntax
description: Basics of the Cypher query language syntax
---

In this page, we list the syntactic features of Cypher as implemented in Kùzu. As described in the
[overview](/cypher) page, Cypher is a declarative graph query language, and Kùzu's implementation is
based on [openCypher](https://opencypher.org/resources/).

## Parsing

The query parser looks for an input `STRING` that consists of ASCII or unicode characters. The parser is case-insensitive
and ignores leading and trailing whitespaces. You can use characters from non-English languages.
To use special characters or unicode characters as identifiers, you can escape them by encapsulating
them in backticks \`, such as \``Ψ`\`.

```cypher
// Create a node table of books in German
CREATE NODE TABLE `B\u00fccher` (title STRING, price INT64, PRIMARY KEY (title))
CREATE (n:`B\u00fccher` {title: 'Der Thron der Sieben Königreiche'}) SET n.price = 20
// Query using the unicode representation of the table name
MATCH (n:Bücher) RETURN label(n)
```
```
┌─────────┐
│ Bücher  │
│ STRING  │
├─────────┤
│ Bücher  │
└─────────┘
```

Breaking a query into multiple lines is allowed (and recommended for readability reasons), and the
parser ignores leading and trailing whitespaces. You can explicitly mark the end of a query with a semicolon `;`.

```cypher
MATCH (a:Person)
WHERE a.age < 30
RETURN a.*;
```

## Clauses

A Cypher query may contain one or more clauses and their associated subclauses, and can span multiple lines.
The end of a statement is marked with a semicolon `;`, and the query parser looks for this symbol
to know when a statement is complete.

Examples of clauses include:
- `MATCH`: Find patterns in the graph
- `RETURN`: Specify what subset of the matched data to return

Examples of subclauses (that must reside under a clause) include:
- `WHERE`: Filter the results of a `MATCH` clause
- `LIMIT`: Limit the number of results returned by a query

## Comments

Comments are for humans to read and document their code, and are ignored by the
query parser.
- Single line comments begin with a double slash (`//`) and continue up until the end of the
line. They can be placed at the beginning, in the middle, or at the end of a query.
- Multi-line comments begins with a slash and asterisk (`/*`) and continues until it ends with an
asterisk and a slash (`*/`). They can be useful for comments that are too long for one line.

Some examples are below.

```cypher
// Whole-line comment before a query
MATCH (a:Person) RETURN a.*
```

```cypher
MATCH (a:Person) RETURN a.*  // Comment at the end of a query
```

```cypher
MATCH (a:Person)
// Comment in the middle of a query
WHERE a.age < 30
RETURN a.*
```

```sql
/*
This is a comment
spanning multiple lines
*/
MATCH (a:Person) RETURN a.* 
```

## Naming rules and recommendations

As a general rule of thumb, ensure the following:
- Names should begin with an valid alphabetic character of type unicode string -- `Person`, `CarOwner` 
- Names should not begin with a number -- `1Person` is invalid, but `Person1` is valid
- Names should not contain whitespaces or special characters other than underscores -- `CarOwner` is valid, but `Car Owner` is invalid
- Names are generally case-insensitive -- `Person` is the same as `person`, during table creation and querying

The following naming conventions are recommended for node and relationship tables:

| Type | Naming convention | Do | Don't |
|---|---|---|---|
| Node tables | CamelCase (begin with upper case letter) | `CarOwner` | `car_owner` |
| Relationship tables | CamelCase or UPPERCASE separated by underscores | `IsPartOf`/`IS_PART_OF` | `isPartOf` or `is_part_of` |

## Parameters

Parameters in Cypher queries are placeholders for values that are provided at runtime.
Parameters are prefixed with a dollar sign `$` and can be used in any part of a query. They are useful for
preventing Cypher injection attacks, and for reusing query templates with different values.

See the [prepared statements](/get-started/prepared-statements) guide for more information on how to use parameters in Kùzu.

## Reserved keywords

Reserved keywords are words that have a special meaning in Cypher. They cannot be used as identifiers
in the following contexts:

- Variables
- Function names
- Parameters

To use a reserved keyword as an identifier in the above contexts, you can escape it by
encapsulating the keyword in backticks \`, such as \``DEFAULT`\`, and this makes it a valid identifier.

The following list shows the reserved keywords in Cypher, organized by category:

### Clauses

- `COLUMN`
- `CREATE`
- `DBTYPE`
- `DEFAULT`
- `GROUP`
- `HEADERS`
- `INSTALL`
- `MACRO`
- `OPTIONAL`
- `PROFILE`
- `RDFGRAPH`
- `UNION`
- `UNWIND`
- `WITH`

### Subclauses

- `LIMIT`
- `ONLY`
- `ORDER`
- `WHERE`

### Expressions

- `ALL`
- `CASE`
- `CAST`
- `ELSE`
- `END`
- `ENDS`
- `EXISTS`
- `GLOB`
- `SHORTEST`
- `THEN`
- `WHEN`

### Literals

- `NULL`
- `FALSE`
- `TRUE`

### Modifiers

- `ASC`
- `ASCENDING`
- `DESC`
- `DESCENDING`
- `ON`

### Operators

- `AND`
- `DISTINCT`
- `IN`
- `IS`
- `NOT`
- `OR`
- `STARTS`
- `XOR`

### Schema

- `FROM`
- `PRIMARY`
- `TABLE`
- `TO`
