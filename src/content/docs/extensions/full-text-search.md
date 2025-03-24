---
title: "Full Text Search"
---

## Usage

The full-text search (`FTS`) extension adds support for matching within the content of a string property
while returning the documents with a proximity score to the query. It is enabled by building an index
on string properties in a table and allows searching through the strings via a keyword query.
Currently, Kuzu supports only indexing on a node table's `STRING` properties.

The FTS functionality is not available by default, so you first need to install the `FTS`
extension by running the following commands:

```sql
INSTALL FTS;
LOAD EXTENSION FTS;
```

### Example dataset

Let's look at an example dataset to demonstrate how the FTS extension can be used.
First, let's create a `Book` table containing each book's information, including the title and abstract.

```cypher
CREATE NODE TABLE Book (ID SERIAL, abstract STRING, title STRING, PRIMARY KEY (ID));
CREATE (b:Book {abstract: 'An exploration of quantum mechanics.', title: 'The Quantum World'});
CREATE (b:Book {abstract: 'A magic journey through time and space.', title: 'Chronicles of the Universe'});
CREATE (b:Book {abstract: 'An introduction to machine learning techniques.', title: 'Learning Machines'});
CREATE (b:Book {abstract: 'A deep dive into the history of ancient civilizations.', title: 'Echoes of the Past'});
CREATE (b:Book {abstract: 'A fantasy tale of dragons and magic.', title: 'The Dragon\'s Call'});
```

In the following sections, we show how to build and query a full-text search index on the book table.
### Create FTS index

Kuzu provides a function `CREATE_FTS_INDEX` to create the full-text search index on a table:

```cypher
CALL CREATE_FTS_INDEX('TABLE_NAME', 'INDEX_NAME', ['PROP1', 'PROP2', 'PROP3'...], OPTIONAL_PARAM1 := 'OPTIONAL_VAL1')
```
- `TABLE_NAME`: The name of the node table to build FTS index.
- `INDEX_NAME`: The name of the FTS index to create.
- `PROPERTIES`: A list of properties in the table to build FTS index on. Full text search will only search the properties with FTS index built on.

The following optional parameters are supported:

- `stemmer`: The text normalization technique to use. Should be one of: `arabic`, `basque`, `catalan`, `danish`, `dutch`, `english`, `finnish`, `french`, `german`, `greek`, `hindi`, `hungarian`, `indonesian`, `irish`, `italian`, `lithuanian`, `nepali`, `norwegian`, `porter`, `portuguese`, `romanian`, `russian`, `serbian`, `spanish`, `swedish`, `tamil`, `turkish`, or `none` if no stemming is to be used. Defaults to `english`,
which uses a Snowball stemmer.
- `stopwords`: To make the full-text search results more useful, it's useful to provide a list of omitted words that are excluded when building and querying the full-text search index. These are termed "stopwords". A default list of built-in english stopwords is used, but these can be customized by using the `stopwords` parameter. Kuzu accepts stopwords in the following formats:
1. A node table with only a single column of stopwords.
2. A PARQUET/CSV file with only a single string column of stopwords(no header required). This file can be stored in cloud storage platforms like Amazon S3 or Google Cloud Storage (GCS) or made accessible via HTTPS. If hosted remotely, ensure the httpfs extension is enabled and valid credentials (e.g., access keys) are configured to authenticate and securely access the file.

:::caution[Note]
1. If the provided stopwords parameter matches both a node table and a file with the same name, the node table takes precedence and will be used.
2. For optimal accuracy, it is strongly suggested to provide stopwords in their stemmed form. 
:::

The example below shows how to create an FTS index on the book table with the `abstract` and `title` properties using the `porter` stemmer and a customized stopwords list.

:::caution[Note]
1. Kuzu uses special syntax for optional parameters. Note how the `:=` operator is used to assign a value
to an optional parameter in the example below.
2. Users can only build full text search indexes on node tables.
3. Once a full-text search index is created, the stopword list becomes immutable. All queries against the index will permanently reference the original stopword list used during its creation. To update the stopword configuration, you must rebuild the index with the revised stopword list.
4. `CREATE_FTS_INDEX` cannot be executed in a multi-statement query block that also includes other statements.

For example:
```cypher
create node table doc (name string, primary key(name)); call create_fts_index('doc', 'docIdx', ['name'])
```
throws an exception since `create_fts_index` is not the only statement in the above query.
:::

```cypher
CALL CREATE_FTS_INDEX(
    'Book',   // Table name
    'book_index',   // Index name
    ['abstract', 'title'],   // Properties to build FTS index on
    stemmer := 'porter',   // Stemmer to use (optional)
    stopwords := 'https://stopwords/porter.txt' // Configure customized stopwords list
);
```
Once the index is created, the index will be ready for querying as shown below.

### Query FTS index

Kuzu provides the `QUERY_FTS_INDEX` function to query the FTS index on a table using the [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) scoring algorithm:

```cypher
CALL QUERY_FTS_INDEX(
    'TABLE_NAME',
    'INDEX_NAME',
    'QUERY',
    OPTIONAL_PARAM1 := 'OPTIONAL_VAL1'...
)
RETURN node, score
```
- `TABLE_NAME`: The name of the table to query.
- `INDEX_NAME`: The name of the FTS index to query. 
- `QUERY`: The query string that contains the keywords to search.

You can use `YIELD` to rename the result columns. More details on `YIELD` can be found [here](cypher/query-clauses/call/#yield).
By default, the returned result from `QUERY_FTS_INDEX` is not sorted.
To get sorted result based on BM25 scores, you need to manually specify `ORDER BY score` in the `RETURN` clause.

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
RETURN node.title as title, node.abstract as abstract, score
ORDER BY score DESC;
```

Result:
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
CALL QUERY_FTS_INDEX('Book', 'book_index', 'dragon magic', conjunctive := true)
RETURN node.title as title, node.abstract as abstract, score
ORDER BY score DESC;
```

Result:
```
┌───────────────────┬──────────────────────────────────────┬──────────┐
│ title             │ abstract                             │ score    │
│ STRING            │ STRING                               │ DOUBLE   │
├───────────────────┼──────────────────────────────────────┼──────────┤
│ The Dragon's Call │ A fantasy tale of dragons and magic. │ 1.208044 │
└───────────────────┴──────────────────────────────────────┴──────────┘
```

If you want to retrieve books with either the `dragon` OR `magic` keywords, set `conjunctive` to `false`
```cypher
CALL QUERY_FTS_INDEX('Book', 'book_index', 'dragon magic', conjunctive := false)
RETURN node.title as title, node.abstract as abstract, score
ORDER BY score DESC;
```

Result:
```
┌────────────────────────────┬─────────────────────────────────────────┬──────────┐
│ title                      │ abstract                                │ score    │
│ STRING                     │ STRING                                  │ DOUBLE   │
├────────────────────────────┼─────────────────────────────────────────┼──────────┤
│ The Dragon's Call          │ A fantasy tale of dragons and magic.    │ 1.208044 │
│ Chronicles of the Universe │ A magic journey through time and space. │ 0.380211 │
└────────────────────────────┴─────────────────────────────────────────┴──────────┘
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
┌────────────┬────────────┬────────────┬──────────────────┬──────────────────┬──────────────────────────────────────────────────────────────────────────────────────────┐
│ table name │ index name │ index type │ property names   │ extension loaded │ index definition                                                                         │
│ STRING     │ STRING     │ STRING     │ STRING[]         │ BOOL             │ STRING                                                                                   │
├────────────┼────────────┼────────────┼──────────────────┼──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ Book       │ book_index │ FTS        │ [abstract,title] │ True             │ CALL CREATE_FTS_INDEX('Book', 'book_index', ['abstract', 'title'], stemmer := 'porter'); │
└────────────┴────────────┴────────────┴──────────────────┴──────────────────┴──────────────────────────────────────────────────────────────────────────────────────────┘
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

