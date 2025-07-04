---
title: Create table
description: Create table DDL statements for node and relationship tables
---

As a first step to creating your database, you need to define your node and directed relationships.
In the property graph model, nodes and relationships have labels. In Kuzu, every node or
relationship can have one label. The node and relationships and the predefined properties on them are
defined through `CREATE NODE TABLE` and `CREATE REL TABLE` statements.
The choice of using the term "table" over "label" is intentional and explained below.

:::note[Why are there no "labels"?]
Kuzu uses the term **table** rather than **label** because, like other GDBMSs, Kuzu is
ultimately a relational system in the sense that it stores and processes sets of tuples, i.e., tables
or relations.

In fact, Kuzu's data model can be viewed as a _structured_ property graph model, in
which you tag your tables as "node" and "relationship" tables depending on their roles in your
application data. Nodes are generally
well-suited for representing entities, while relationships are used to represent the
connections between these entities. Relationships are also the primary means to *join* nodes with each other to
find paths and patterns in your graph database. So when you sketch out a mental map of your
nodes/relationships, it is equivalent to defining your records as nodes or relationship tables.

During querying you can bind node records with syntax like `(a:Person)`, and relationships with syntax
like `(..)-[e:Knows]->(...)`. Similar to table definitions in SQL, node and relationship tables have
primary keys, a term that is defined in the context of tables: node tables explicitly define
primary keys as one of their properties, while the primary keys of relationship tables are
implicitly defined by the primary keys of their `FROM` and `TO` node records. Furthermore
(similar to relational systems), properties can be thought of as equivalent to columns in a table,
justifying our choice of using the term "table" in our design of the system.
:::

## Create a node table

To create a node table, use the `CREATE NODE TABLE` statement as shown below:

```sql
CREATE NODE TABLE User (name STRING, age INT64 DEFAULT 0, reg_date DATE, PRIMARY KEY (name))
```

Alternatively, you can specify the keyword `PRIMARY KEY` immediately after the column name, as follows:
```sql
CREATE NODE TABLE User (name STRING PRIMARY KEY, age INT64 DEFAULT 0, reg_date DATE)
```

The above statements adds a `User` table to the catalog of the system with three properties: `name`, `age`, and `reg_date`,
with the primary key being set to the `name` property in this case.

The name of the node table, `User`, specified above will serve as the "label" which we want to query
in Cypher, for example:
```sql
MATCH (a:User) RETURN *
```

### Primary key

Kuzu requires a primary key column for node table which can be either a `STRING`, numeric, `DATE`, or `BLOB` property of the node. Kuzu will generate an index to do quick lookups on the primary key (e.g., `name` in the above example). Alternatively, you can use the [`SERIAL`](/cypher/data-types/#serial) data type to generate an auto-increment column as primary key.

### Default value

Each property in a table can have a default value. If not specified, the default value is `NULL`.

```sql
CREATE NODE TABLE User (name STRING PRIMARY KEY, age INT64 DEFAULT 0, reg_date DATE)
```

In the above example, the `age` property is set to a default value of `0` rather than `NULL`. The
`name` and `reg_date` properties do not have default values, so they will be `NULL` if not provided
during data insertion.

:::note[Note]
The default value doesn't _have_ to be a constant expression -- it can also be a function call.
For example, if you want to set the default value of a timestamp property to the current timestamp,
you can use the `current_timestamp()` function.
```cypher
CREATE NODE TABLE User (
    id INT64 PRIMARY KEY,
    happens_at TIMESTAMP DEFAULT current_timestamp()
)
```
:::

## Create a relationship table

Once you create node tables, you can define relationships between them using the `CREATE REL TABLE` statement.
The following statement adds to the catalog a `Follows` relationship table between `User` and `User` with one `date` property on the relationship.

```sql
CREATE REL TABLE Follows(FROM User TO User, since DATE);
```

Defining a rel table with multiple node table pairs is also possible. The following statement adds a `Knows` relationship table between two node table pairs:
1. `User` and `User`
2. `User` and `City`

```sql
CREATE REL TABLE Knows(FROM User TO User, FROM User TO City);
```

:::caution[Notes]

- **Syntax**: There is no comma between the `FROM` and `TO` clauses, however a comma is needed between two node table pairs.
- **Directionality**: Each relationship has a direction following the property graph model. So when `Follows` relationship records are added, each one has a specific source (FROM) node and a specific destination (TO) node.
- **Primary keys**: You cannot define a primary key for relationship records. Each relationship gets a unique system-level edge ID, which are internally generated. You can check if two edges are the same, i.e., have the same edge ID, using the `=` and `!=` operator between the `ID()` function on two variables that bind to relationships. For example, you can query `MATCH (n1:User)-[r1:Follows]->(n2:User)<-[r2:Follows]-(n3:User) WHERE ID(r1) != ID(r2) RETURN *` to ensure that the same relationship does not bind to both r1 and r2.
:::

### Bulk insert to relationship table with multiple from-to pairs

Internally, a relationship table with multiple from-to pairs creates a child table per from-to pair. In the example above, the following two children
tables are created internally
```
Knows_User_User
Knows_User_City
```

When bulk inserting into a relationship table with multiple from-to pairs, users need to specify which child table to insert through `from, to` options. For example, the following two statements will bulk insert into `Knows` relationship table.
```
Copy Knows FROM 'knows_user_user.csv' (from='User', to='User');
Copy Knows FROM 'knows_user_city.csv' (from='User', to='City');
```

Alternatively, you can also directly copy into a child table. Though this approach is not recommended and will be deprecated in the future release.
```
Copy Knows_User_User FROM 'knows_user_user.csv';
Copy Knows_User_City FROM 'knows_user_city.csv';
```

### Relationship Multiplicities

For any relationship label E, e.g., , by default there can be multiple relationships from any node v both in the forward and backward direction. In database terminology, relationships are by default many-to-many. For example in the first `Follows` example above: (i) any `User` node `v` can follow multiple `User` nodes; and (ii) be followed by multiple `User` nodes. You can also constrain the multiplicity to _at most 1_ (we don't yet support "exactly 1" semantics as you may be used to via foreign key constraints in relational systems) in either direction.

:::note[Note]
You can optionally declare the multiplicity of relationships by adding `MANY_MANY`, `ONE_MANY`, `MANY_ONE`, or `ONE_ONE` clauses to the end of the `CREATE REL TABLE` command.
:::

Below are a few examples:

```sql
CREATE REL TABLE LivesIn(FROM User TO City, MANY_ONE)
```

The DDL shown above indicates that `LivesIn` has `n-1` multiplicity. This command enforces an additional constraint that each `User` node `v` might live in at most one `City` node (assuming our database has `City` nodes). It does not put any constraint in the "backward" direction, i.e., there can be multiple `User`s living in the same `City`. As another example to explain the semantics of multiplicity constraints in the presence of multiple node labels, consider the following:

```sql
CREATE REL TABLE Likes(FROM Pet TO User, ONE_MANY)
```

The DDL above indicates that `Likes` has 1-to-n multiplicity. This DDL command enforces the constraint that each `User` node `v` might be `Liked` by one `Pet` node. It does not place any constraints in the forward direction, i.e., each `Pet` node might know multiple `User`s.

In general in a relationship `E`'s multiplicity, if the "source side" is `ONE`, then for each node `v` that can be the destination of `E` relationships, `v` can have at most one backward edge. If the "destination side" is `ONE`, then each node `v` that can be the source of `E` relationships, `v` can have at most one forward edge.

## Create relationship table group [Deprecated]
:::note[Note]
Relationship table group has been deprecated since our v0.8.0 release. Users can now define multiple node table pairs in rel table using multiple `FROM ... TO ...` clauses.
:::


You can use relationship table groups to gain added flexibility in your data modelling, by defining a relationship table with multiple node table pairs. This is done via the `CREATE REL TABLE GROUP` statement. This has a similar syntax to `CREATE REL TABLE`, but uses multiple `FROM ... TO ...` clauses. Internally, a relationship table group defines a relationship table for _each_ `FROM ... TO ...` block. Any query to a relationship table group is treated as a query on the union of _all_ relationship tables in the group.



```sql
CREATE REL TABLE GROUP Knows (FROM User To User, FROM User to City, year INT64);
```

The statement above creates a `Knows_User_User` rel table and a `Knows_User_City` rel table. And a `Knows` rel table group refering these two rel tables.

A relationship table group can be used as a regular relationship table for querying purposes.

```sql
MATCH (a:User)-[:Knows]->(b) RETURN *;
```

The query above is equivalent to the following:

```sql
MATCH (a:User)-[:Knows_User_User|:Knows_User_city]->(b) RETURN *;
```

As you can imagine, the more relationships you want to selectively query on, the more useful relationship table groups become.

## Create table if not exists

If the given table name already exists in the database, Kuzu throws an exception when you try to create it.
To avoid the exception being raised, use the `IF NOT EXISTS` clause. This tells Kuzu to do nothing when
the given table name already exists in the database.

Example:
```sql
CREATE NODE TABLE IF NOT EXISTS UW(ID INT64 PRIMARY KEY)
```
This query tells Kuzu to only create the `UW` table if it doesn't exist.

The same applies to relationship tables as well.
