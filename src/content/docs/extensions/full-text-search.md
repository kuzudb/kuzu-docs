---
title: "Full Text Search"
---

## Usage

The `FTS` (full-text search) extension adds support for matching within the content of a string property
while returning the documents with a proximity score to the query. It is enabled by building an index
on string properties in a table and allows searching through the strings via a keyword query.
Currently, Kùzu supports only indexing on a node table's `STRING` properties.

The FTS functionality is not available by default, so you would first need to install the `FTS`
extension by running the following commands:

```sql
INSTALL FTS;
LOAD EXTENSION FTS;
```

### Example dataset

Let's look at an example dataset to demonstrate how the FTS extension can be used.
First, let's create a `Book` table containing each book's information, including the title, author and abstract.

```cypher
CREATE NODE TABLE Book (ID SERIAL, abstract STRING, author STRING, title STRING, PRIMARY KEY (ID));
CREATE (b:Book {abstract: 'An exploration of quantum mechanics.', author: 'Alice Johnson', title: 'The Quantum World'});
CREATE (b:Book {abstract: 'A magic journey through time and space.', author: 'John Smith', title: 'Chronicles of the Universe'});
CREATE (b:Book {abstract: 'An introduction to machine learning techniques.', author: 'Emma Brown', title: 'Learning Machines'});
CREATE (b:Book {abstract: 'A deep dive into the history of ancient civilizations.', author: 'Michael Lee', title: 'Echoes of the Past'});
CREATE (b:Book {abstract: 'A fantasy tale of dragons and magic.', author: 'Charlotte Harris', title: 'The Dragon\'s Call'});
```

In the following sections, we will build a full-text search index on the book table, and demonstrate how to search for books relevant to a keyword query.

### Create FTS index

Kuzu provides a function `CREATE_FTS_INDEX` to create the full-text search index on a table:

```cypher
CALL CREATE_FTS_INDEX('TABLE_NAME', 'INDEX_NAME', ['PROP1', 'PROP2', 'PROP3'...], OPTIONAL_PARAM1 := 'OPTIONAL_VAL1')
```
- `TABLE_NAME`: The name of the table to build FTS index.
- `INDEX_NAME`: The name of the FTS index to create.
- `PROPERTIES`: A list of properties in the table to build FTS index on. Full text search will only search the properties with FTS index built on.

The following optional parameters are supported:

- `stemmer`: The text normalization technique to use. Should be one of: `arabic`, `basque`, `catalan`, `danish`, `dutch`, `english`, `finnish`, `french`, `german`, `greek`, `hindi`, `hungarian`, `indonesian`, `irish`, `italian`, `lithuanian`, `nepali`, `norwegian`, `porter`, `portuguese`, `romanian`, `russian`, `serbian`, `spanish`, `swedish`, `tamil`, `turkish`, or `none` if no stemming is to be used. Defaults to `english`,
which uses a Snowball stemmer.

The example below shows how to create an FTS index on the book table with the `abstract`, `author` and `title` properties using the `porter` stemmer.

:::caution[Note]
Kùzu uses special syntax for optional parameters. Note how the `:=` operator is used to assign a value
to an optional parameter in the example below.
:::

```cypher
CALL CREATE_FTS_INDEX(
    'Book',   // Table name
    'book_index',   // Index name
    ['abstract', 'author', 'title'],   // Properties to build FTS index on
    stemmer := 'porter'   // Stemmer to use (optional)
)
```

Depending on the size of the dataset, the index creation may take some time. Once the index creation is complete,
the index will be ready to use for full-text search.

### Query FTS index

Kuzu provides a table function `QUERY_FTS_INDEX` to query the FTS index on a table:

```cypher
CALL QUERY_FTS_INDEX(
    'TABLE_NAME',
    'INDEX_NAME',
    'QUERY',
    OPTIONAL_PARAM1 := 'OPTIONAL_VAL1'...
)
```
- `TABLE_NAME`: The name of the table to query
- `INDEX_NAME`: The name of the FTS index to query
- `QUERY`: The query string

The following optional parameters are supported:

1. `conjunctive`: Whether all keywords in the query should appear in order for a document to be retrieved, default to false.
2. `K`: parameter controls the influence of term frequency saturation. It limits the effect of additional occurrences of a term within a document. Defaults to 1.2.
3. `B`: parameter controls the degree of length normalization by adjusting the influence of document length. Defaults to 0.75.

The below example shows how to query books related to the `quantum machine` and order the books by their scores:
```cypher
CALL QUERY_FTS_INDEX('Book', 'book_index', 'quantum machine')
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

The `conjunctive` option can be used when you want to retrieve only the books containing _all_ the keywords in the query.
```cypher
CALL QUERY_FTS_INDEX('Book', 'book_index', 'dragon magic', conjunctive := true)
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

If you want to retrieve books with either the `dragon` OR `magic` keywords, set `conjunctive` to `false`
```cypher
CALL QUERY_FTS_INDEX('Book', 'book_index', 'dragon magic', conjunctive := false)
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

### Drop FTS index

Use the function `DROP_FTS_INDEX` to drop the FTS index on a table:

```cypher
CALL DROP_FTS_INDEX('TABLE_NAME', 'INDEX_NAME')
```

The example below shows how to drop the `book_index` index from the `Book` table:

```cypher
CALL DROP_FTS_INDEX('Book', 'book_index')
```

### Show FTS indexes

There is no function specifically to show FTS indexes, but there is a general function [`SHOW_INDEXES`](/cypher/query-clauses/call) that
can be used to show all the indexes available in the database.

```cypher
CALL SHOW_INDEXES() RETURN *;
```
This will return a list of all the indexes available in the database, while also listing the type of each
index. Scan the table to find the FTS indexes that are currently available.

```
┌────────────┬─────────────┬────────────┬─────────────────────────┬──────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ table name │ index nam   │ index type │ property names          │ extension loaded │ index definition                                                                                    │
│ STRING     │ STRING      │ STRING     │ STRING[]                │ BOOL             │ STRING                                                                                              │
├────────────┼─────────────┼────────────┼─────────────────────────┼──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ book       │ book_index  │ FTS        │ [abstract,author,title] │ True             │ CALL CREATE_FTS_INDEX('book', 'book_index', ['abstract', 'author', 'title' ], stemmer := 'porter'); │
└────────────┴─────────────┴────────────┴─────────────────────────┴──────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Prepared statement

[Prepared statements](/get-started/prepared-statements) allows you to execute a query with different parameter values without rebinding the same query.
A typical use case where parameters are useful is when you want to find books with different contents.

Example:
Let's start with preparing a cypher statement which queries the `book_index`.
```c++
auto preparedStatement = conn->prepare("CALL QUERY_FTS_INDEX('Book', 'book_index', $q) RETURN _node.ID, score;");
```
Now, we can find books with different contents using the prepared statement without rebinding.

#### Find books related to `machine learning`
```c++
auto result = conn->execute(prepared.get, std::make_pair(std::string("q"), std::string("machine learning")));
```

#### Find books related to `dragons`
```c++
auto result = conn->execute(prepared.get, std::make_pair(std::string("q"), std::string("dragons")));
```

