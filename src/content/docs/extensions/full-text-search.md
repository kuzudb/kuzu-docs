---
title: "Full Text Search"
---

## Usage

The full-text search (`FTS`) extension adds support for matching within the content of a string property
while returning the documents with a proximity score to the query. It is enabled by building an index
on string properties in a table and allows searching through the strings via a keyword query.
Currently, Kùzu supports only indexing on a node table's `STRING` properties.

The FTS functionality is not available by default, so you first need to install the `FTS`
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

In the following sections, we show how to build and query a full-text search index on the book table.
### Create FTS index

Kùzu provides a function `CREATE_FTS_INDEX` to create the full-text search index on a table:

```cypher
CALL CREATE_FTS_INDEX('TABLE_NAME', 'INDEX_NAME', ['PROP1', 'PROP2', 'PROP3'...], OPTIONAL_PARAM1 := 'OPTIONAL_VAL1')
```
- `TABLE_NAME`: The name of the table to build the FTS index on.
- `INDEX_NAME`: The name of the created FTS index.
- `PROPERTIES`: The list of properties in the table to build the FTS index on. The strings in these
  properties will be tokenized and indexed. The FTS index will only match keywords across 
  these indexed properties. 

The following optional parameters are supported:

- `stemmer`: The text normalization technique to use. Should be one of: `arabic`, `basque`, `catalan`, `danish`, `dutch`, `english`, `finnish`, `french`, `german`, `greek`, `hindi`, `hungarian`, `indonesian`, `irish`, `italian`, `lithuanian`, `nepali`, `norwegian`, `porter`, `portuguese`, `romanian`, `russian`, `serbian`, `spanish`, `swedish`, `tamil`, `turkish`, or `none` if no stemming is to be used. Defaults to `english`,
which uses a Snowball stemmer.

The example below shows how to create an FTS index on the book table with the `abstract`, `author`, and `title` properties using the `porter` stemmer.

:::caution[Note]
Syntax of optional parameters: Kùzu uses special syntax for optional parameters. Note how the `:=` operator is used to assign a value
to an optional parameter in the example below.
:::

```cypher
CALL CREATE_FTS_INDEX(
    'Book', // Table name
    'book_index', // Index name
    ['abstract', 'author', 'title'], // Properties to build FTS index on
    stemmer := 'porter' // Stemmer to use (optional)
)
```
Once the index is created, the index will be ready for querying as shown below.

### Query FTS index

Kùzu provides the `QUERY_FTS_INDEX` function to query the FTS index on a table using the [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) scoring algorithm:

```cypher
CALL QUERY_FTS_INDEX(
    'TABLE_NAME',
    'INDEX_NAME',
    'QUERY',
    OPTIONAL_PARAM1 := 'OPTIONAL_VAL1'...
)
```
- `TABLE_NAME`: The name of the table to query.
- `INDEX_NAME`: The name of the FTS index to query. 
- `QUERY`: The query string that contains the keywords to search.

:::caution[Note]
Uniqueness of index names: If you build multiple FTS indices on a table, they 
must have different names. However, multiple FTS indices can have the same
name as long as each one is built on a separate table.
:::
The following optional parameters are supported:

1. `conjunctive`: Whether all keywords in the query should appear in order for a document to be retrieved. Defaults to false.
2. `K`: controls the influence of term frequency saturation. This limits the effect of additional occurrences of a term within a document. Defaults to 1.2.
3. `B`: controls the degree of length normalization by adjusting the influence of document length. Defaults to 0.75.

Detailed explanation of k and b values can be found [here](https://learn.microsoft.com/en-us/azure/search/index-ranking-similarity).

The below example shows how to query books related to the `quantum machine` and order the books by their scores:
```cypher
CALL QUERY_FTS_INDEX('Book', 'book_index', 'quantum machine')
RETURN node.title, score
ORDER BY score DESC;
```

Result:
```
┌───────────────────┬──────────┐
│ node.title        │ score    │
│ STRING            │ DOUBLE   │
├───────────────────┼──────────┤
│ The Quantum World │ 0.857996 │
│ Learning Machines │ 0.827832 │
└───────────────────┴──────────┘
```

The `conjunctive` option can be used when you want to retrieve only the books containing _all_ the keywords in the query.
```cypher
CALL QUERY_FTS_INDEX('Book', 'book_index', 'dragon magic', conjunctive := true)
RETURN node.title, score
ORDER BY score DESC;
```

Result:
```
┌───────────────────┬──────────┐
│ node.title        │ score    │
│ STRING            │ DOUBLE   │
├───────────────────┼──────────┤
│ The Dragon's Call │ 1.208044 │
└───────────────────┴──────────┘
```

If you want to retrieve books with either the `dragon` OR `magic` keywords, set `conjunctive` to `false`
```cypher
CALL QUERY_FTS_INDEX('Book', 'book_index', 'dragon magic', conjunctive := false)
RETURN node.title, score
ORDER BY score DESC;
```

Result:
```
┌────────────────────────────┬──────────┐
│ node.title                 │ score    │
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

There is no function to specifically show FTS indexes, but there is a general function [`SHOW_INDEXES`](/cypher/query-clauses/call) that
can be used to show all the indexes available in the database.

```cypher
CALL SHOW_INDEXES() RETURN *;
```
This will return a list of all the indexes available in the database, while also listing the type of each
index.

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
You can parameterize your `CALL QUERY_FTS_INDEX` calls. For example,
suppose you want to find books with different keywords. We give
an example below using our C++ API but you can create prepared statements in other APIs as well.
We first prepare a Cypher statement which queries the `book_index` with a parameter `q`.
```c++
auto preparedStatement = conn->prepare("CALL QUERY_FTS_INDEX('Book', 'book_index', $q) RETURN node.ID, score;");
```
Now, we can find books with different keywords using the prepared statement and 
specifying different values for `q`. For example, to query the index with keywords `machine learning`, we can do:
```c++
auto result = conn->execute(prepared.get, std::make_pair(std::string("q"), std::string("machine learning")));
```

Similarly, to query the index with the keyword `dragons`, we can do:
```c++
auto result = conn->execute(prepared.get, std::make_pair(std::string("q"), std::string("dragons")));
```

