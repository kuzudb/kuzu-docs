---
title: "Full Text Search"
---

## Usage

The `fts` extension adds support for identifying natural-language documents that satisfy a query, and optionally return them in order of their similarity to the query.
Full text indexing allows documents to be preprocessed and an index built for later rapid searching. 

The FTS functionality is not available by default, so you would first need to install the `FTS` extension by running the following commands:

```sql
INSTALL FTS;
LOAD EXTENSION FTS;
```

### Example dataset

Let's look at an example dataset to demonstrate how the fts extension can be used.
Firstly, let's create a book table containing books information, including the title, author and abstract.
```sql
CREATE NODE TABLE book (ID SERIAL, abstract STRING, author STRING, title STRING, PRIMARY KEY (ID));
CREATE (b:book {abstract: 'An exploration of quantum mechanics.', author: 'Alice Johnson', title: 'The Quantum World'});
CREATE (b:book {abstract: 'A magic journey through time and space.', author: 'John Smith', title: 'Chronicles of the Universe'});
CREATE (b:book {abstract: 'An introduction to machine learning techniques.', author: 'Emma Brown', title: 'Learning Machines'});
CREATE (b:book {abstract: 'A deep dive into the history of ancient civilizations.', author: 'Michael Lee', title: 'Echoes of the Past'});
CREATE (b:book {abstract: 'A fantasy tale of dragons and magic.', author: 'Charlotte Harris', title: 'The Dragon\'s Call'});
```

In the following sections, we will build a fts index on the book table, and demonstrate how to find the book with the desired content.

### Build a fts index on the book table
Kuzu provides a table function `CREATE_FTS_INDEX` to create the fts index on a table:
```
CALL CREATE_FTS_INDEX('TABLE_NAME', 'INDEX_NAME', ['PROP1', 'PROP2', 'PROP3'...], OPTIONAL_PARAM1 := 'OPTIONAL_VAL1')
```
- `TABLE_NAME`: The name of the table to build fts index.
- `INDEX_NAME`: The name of the fts index to create.
- `PROPERTIES`: A list of properties in the table to build fts index on. Full text search will only search the properties with fts index built on.
- Supported optional parameters:

1. stemmer: The text normalization technique to use. Should be one of: `arabic`, `basque`, `catalan`, `danish`, `dutch`, `english`, `finnish`, `french`, `german`, `greek`, `hindi`, `hungarian`, `indonesian`, `irish`, `italian`, `lithuanian`, `nepali`, `norwegian`, `porter`, `portuguese`, `romanian`, `russian`, `serbian`, `spanish`, `swedish`, `tamil`, `turkish`, or `none` if no stemming is to be used. Defaults to `english`.

The below example shows how to create a fts index on the book table with abstract, author and title properties using the `porter` stemmer. 
```
CALL CREATE_FTS_INDEX('book', 'bookIdx', ['abstract', 'author', 'title'], stemmer := 'porter');
```

### Query fts index
Kuzu provides a table function `QUERY_FTS_INDEX` to query the fts index on a table:
```
CALL QUERY_FTS_INDEX('TABLE_NAME', 'INDEX_NAME', 'QUERY', OPTIONAL_PARAM1 := 'OPTIONAL_VAL1'...)
```
- `TABLE_NAME`: The name of the table to query.
- `INDEX_NAME`: The name of the fts index to query.
- `QUERY`: The query string.
- Supported optional parameters:

1. `conjunctive`: Whether all keywords in the query should appear in order for a document to be retrieved, default to false.
2. `K`: parameter controls the influence of term frequency saturation. It limits the effect of additional occurrences of a term within a document. Defaults to 1.2.
3. `B`: parameter controls the degree of length normalization by adjusting the influence of document length. Defaults to 0.75.

The below example shows how to query books related to the `quantum machine` and order the books by their scores:
```
CALL QUERY_FTS_INDEX('book', 'bookIdx', 'quantum machine')
RETURN _node.title, score
ORDER BY score DESC;
```

Result:
```
┌───────────────────┬──────────┐
│ _node.title       │ score    │
│ STRING            │ DOUBLE   │
├───────────────────┼──────────┤
│ The Quantum World │ 0.857996 │
│ Learning Machines │ 0.827832 │
└───────────────────┴──────────┘
```

`Conjunctive` option can be used when users want to retrieve only the books containing all the keywords in the query.
```
CALL QUERY_FTS_INDEX('book', 'bookIdx', 'dragon magic', conjunctive := true)
RETURN _node.title, score
ORDER BY score DESC;
```

Result:
```
┌───────────────────┬──────────┐
│ _node.title       │ score    │
│ STRING            │ DOUBLE   │
├───────────────────┼──────────┤
│ The Dragon's Call │ 1.208044 │
└───────────────────┴──────────┘
```

If users want to retrieve books with one of the `dragon` or `magic` keywords, they can set `conjunctive` to `false`
```
CALL QUERY_FTS_INDEX('book', 'bookIdx', 'dragon magic', conjunctive := false)
RETURN _node.title, score
ORDER BY score DESC;
```

Result:
```
┌────────────────────────────┬──────────┐
│ _node.title                │ score    │
│ STRING                     │ DOUBLE   │
├────────────────────────────┼──────────┤
│ The Dragon's Call          │ 1.208044 │
│ Chronicles of the Universe │ 0.380211 │
└────────────────────────────┴──────────┘
```

### Drop fts index
Kuzu provides a table function `DROP_FTS_INDEX` to drop the fts index on a table:
```
CALL DROP_FTS_INDEX('TABLE_NAME', 'INDEX_NAME')
```

The below example shows how to drop the `bookIdx` index from the `book` table:
```
CALL DROP_FTS_INDEX('book', 'bookIdx')
```

### Prepared statement
[Prepared-statements](../../get-started/prepared-statements.mdx) allows users to execute a query with different parameter values without rebinding the same query.
A typical use case where parameters are useful is when you want to find books with different contents.

Example:
Let's start with preparing a cypher statement which queries the `bookIdx`.
```c++
auto preparedStatement = conn->prepare("CALL QUERY_FTS_INDEX('book', 'bookIdx', $q) RETURN _node.ID, score;");
```
Now, we can find books with different contents using the prepared statement without rebinding.
1. Find books related to `machine learning`
```c++
auto result = conn->execute(prepared.get, std::make_pair(std::string("q"), std::string("machine learning")));
```

2. Find books related to `dragons`
```c++
auto result = conn->execute(prepared.get, std::make_pair(std::string("q"), std::string("dragons")));
```

