---
title: "Full-text search extension"
---

The full-text search (`FTS`) extension can be used to efficiently seach within the contents of
any string property and return results based on a similarity score. The extension
works by building an index on specified string properties.

Currently, Kuzu supports creating FTS indexes on only node tables' `STRING` properties.

## Usage

```sql
INSTALL FTS;
LOAD FTS;
```

### Example dataset

Let's create a `Book` table containing each book's title and abstract.

```cypher
CREATE NODE TABLE Book (ID SERIAL PRIMARY KEY, abstract STRING, title STRING);
CREATE (b:Book {
  abstract: 'An exploration of quantum mechanics.',
  title: 'The Quantum World'
});
CREATE (b:Book {
  abstract: 'A magic journey through time and space.',
  title: 'Chronicles of the Universe'
});
CREATE (b:Book {
  abstract: 'An introduction to machine learning techniques.',
  title: 'Learning Machines'
});
CREATE (b:Book {
  abstract: 'A deep dive into the history of ancient civilizations.',
  title: 'Echoes of the Past'
});
CREATE (b:Book {
  abstract: 'A fantasy tale of dragons and magic.', title: 'The Dragon\'s Call'
});
```

### Create an FTS index

The `CREATE_FTS_INDEX` function can be used to create a full-text search index on a node table.

```cypher
CALL CREATE_FTS_INDEX(
  <TABLE_NAME>,
  <INDEX_NAME>,
  [<PROPERTY1>, <PROPERTY2>, ...], // PROPERTIES
  stemmer := 'porter',
  stopwords := '/path/to/stopwords.csv'
);
```

Required arguments:
- `TABLE_NAME`: The name of the node table to build FTS index.
- `INDEX_NAME`: The name of the FTS index to create.
- `PROPERTIES`: A list of properties in the table to build FTS index on. Full text search will only search these properties.

Optional arguments:

- `stemmer` The text normalization technique to use.
  - Accepted values: `arabic`, `basque`, `catalan`, `danish`, `dutch`, `english`, `finnish`, `french`, `german`, `greek`, `hindi`, `hungarian`, `indonesian`, `irish`, `italian`, `lithuanian`, `nepali`, `norwegian`, `porter`, `portuguese`, `romanian`, `russian`, `serbian`, `spanish`, `swedish`, `tamil`, or `turkish`.
  - Use `none` if you do not want to use any stemming
  - Defaults to `english`, which uses a Snowball stemmer.

- `stopwords`: To make the full-text search results more useful, it's useful to provide a list of omitted words that are excluded when building and querying the full-text search index. These are termed "stopwords".
  - A default list of built-in english stopwords is used, but if you want to use a custom stopwords list, you can provide it via the `stopwords` parameter in the following formats:
    - A node table with only a single column of stopwords.
    - A Parquet/CSV file with only a single string column of stopwords (no header required). This file can be stored in cloud storage platforms like Amazon S3 or Google Cloud Storage (GCS) or made accessible via HTTPS. If hosted remotely, ensure the httpfs extension is enabled and valid credentials (e.g., access keys) are configured to authenticate and securely access the file.
  - If the provided stopwords parameter matches both a node table and a file with the same name, the node table takes precedence and will be used.
  - For best accuracy, we suggest providing custom stopwords in their stemmed form. 

:::caution[Note]
- Multiple FTS indexes on the same table must have different names. However, FTS indexes can share the
name across different tables.
- `CREATE_FTS_INDEX` cannot be executed in a multi-statement query block that also includes other statements.
- To update stopwords, you must rebuild the index with the new stopword list.
:::

#### Example

The example below shows how to create an FTS index on the `abstract` and `title` properties of the `Book` node table,
using the `porter` stemmer and a custom stopwords list.

```cypher
CALL CREATE_FTS_INDEX(
    'Book',
    'book_index',
    ['abstract', 'title'],
    stemmer := 'porter',
    stopwords := './stopwords.csv'
);
```

### Query an FTS index

The `QUERY_FTS_INDEX` function can be used to query a FTS index. Internally, it uses the [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) scoring algorithm.

```cypher
CALL QUERY_FTS_INDEX(
  <TABLE_NAME>,
  <INDEX_NAME>,
  <QUERY>,
  conjunctive := false,
  K := 1.2,
  B := 0.75
)
RETURN node, score;
```

Required arguments:
- `TABLE_NAME`: The name of the table to query.
- `INDEX_NAME`: The name of the FTS index to query. 
- `QUERY`: The query string that contains the keywords to search.

Optional arguments:

- `conjunctive`: Whether all keywords in the query should appear in a string for it to be retrieved.
  - Defaults to `false`.
- `K`: controls the influence of term frequency saturation. This limits the effect of multiple occurrences of a term within a string.
  - Defaults to `1.2`.
- `B`: controls the influence of string length on length normalization.
  - Defaults to `0.75`.

You can read more about the `K` and `B` parameters [here](https://learn.microsoft.com/en-us/azure/search/index-ranking-similarity).

#### Example

The example below shows how to find books related to the `quantum machine` and return the results ordered by the similarity score:

```cypher
CALL
  QUERY_FTS_INDEX('Book', 'book_index', 'quantum machine')
RETURN
  node.title as title,
  node.abstract as abstract,
  score
ORDER BY score DESC;
```
```
┌───────────────────┬─────────────────────────────────────────────────┬──────────┐
│ title             │ abstract                                        │ score    │
│ STRING            │ STRING                                          │ DOUBLE   │
├───────────────────┼─────────────────────────────────────────────────┼──────────┤
│ The Quantum World │ An exploration of quantum mechanics.            │ 0.868546 │
│ Learning Machines │ An introduction to machine learning techniques. │ 0.827832 │
└───────────────────┴─────────────────────────────────────────────────┴──────────┘
```

The `conjunctive` option can be used when you want to retrieve only the books containing _all_ the keywords in the query.
```cypher
CALL
  QUERY_FTS_INDEX('Book', 'book_index', 'dragon magic', conjunctive := true)
RETURN
  node.title as title,
  node.abstract as abstract,
  score
ORDER BY score DESC;
```
```
┌───────────────────┬──────────────────────────────────────┬──────────┐
│ title             │ abstract                             │ score    │
│ STRING            │ STRING                               │ DOUBLE   │
├───────────────────┼──────────────────────────────────────┼──────────┤
│ The Dragon's Call │ A fantasy tale of dragons and magic. │ 1.208044 │
└───────────────────┴──────────────────────────────────────┴──────────┘
```

### Drop an FTS index

Use the function `DROP_FTS_INDEX` to drop the FTS index on a table:

```cypher
CALL DROP_FTS_INDEX(<TABLE_NAME>, <INDEX_NAME>);
```

- `TABLE_NAME`: The name of the table to drop the FTS index from.
- `INDEX_NAME`: The name of the FTS index to drop.

#### Example

The example below shows how to drop the `book_index` index from the `Book` table:

```cypher
CALL DROP_FTS_INDEX('Book', 'book_index');
```

### Show FTS indexes

There is no function to specifically show only FTS indexes. However, you can use [`SHOW_INDEXES`](/cypher/query-clauses/call)
to show all the available indexes in Kuzu, including FTS indexes.

```cypher
CALL SHOW_INDEXES() RETURN *;
```
```
┌────────────┬────────────┬────────────┬──────────────────┬──────────────────┬──────────────────────────────────────────────────────────────────────────────────────────┐
│ table name │ index name │ index type │ property names   │ extension loaded │ index definition                                                                         │
│ STRING     │ STRING     │ STRING     │ STRING[]         │ BOOL             │ STRING                                                                                   │
├────────────┼────────────┼────────────┼──────────────────┼──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ Book       │ book_index │ FTS        │ [abstract,title] │ True             │ CALL CREATE_FTS_INDEX('Book', 'book_index', ['abstract', 'title'], stemmer := 'porter'); │
└────────────┴────────────┴────────────┴──────────────────┴──────────────────┴──────────────────────────────────────────────────────────────────────────────────────────┘
```
