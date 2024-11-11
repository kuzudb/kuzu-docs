---
title: Create table
description: Create table DDL statements for node and relationship tables
---

As a first step to creating your database, you need to define your node and directed relationships.
In the property graph model, nodes and relationships have labels. In Kùzu, every node or
relationship can have one label. The node and relationships and the predefined properties on them are
defined through `CREATE NODE TABLE` and `CREATE REL TABLE` statements.
The choice of using the term "table" over "label" is intentional and explained below.

:::note[Why are there no "labels"?]
Kùzu uses the term **table** rather than **label** because, like other GDBMSs, Kùzu is
ultimately a relational system in the sense that it stores and processes sets of tuples, i.e., tables
or relations.

In fact, Kùzu's data model can be viewed as a _structured_ property graph model, in
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

Alternatively, you can define the `PRIMARY KEY` after the column:
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

Kùzu requires a primary key column for node table which can be either a `STRING`, numeric, `DATE`, or `BLOB` property of the node. Kùzu will generate an index to do quick lookups on the primary key (e.g., `name` in the above example). Alternatively, you can use the [`SERIAL`](/cypher/data-types/#serial) data type to generate an auto-increment column as primary key.

### Default value

Each property in a table can have a default value. If not specified, the default value is `NULL`.

```sql
CREATE NODE TABLE User (name STRING, age INT64 DEFAULT 0, reg_date DATE, PRIMARY KEY (name))
```

In the above example, the `age` property is set to a default value of `0` rather than `NULL`. The
`name` and `reg_date` properties do not have default values, so they will be `NULL` if not provided
during data insertion.

## Create a relationship table

Once you create node tables, you can define relationships between them using the `CREATE REL TABLE` statement.
The following statement adds to the catalog a `Follows` relationship table between `User` and `User` with one `date` property on the relationship.

```sql
CREATE REL TABLE Follows(FROM User TO User, since DATE)
```

:::caution[Notes]

- **Syntax**: There is no comma between the `FROM` and `TO` clauses.
- **Directionality**: Each relationship has a direction following the property graph model. So when `Follows` relationship records are added, each one has a specific source (FROM) node and a specific destination (TO) node.
- **Primary keys**: You cannot define a primary key for relationship records. Each relationship gets a unique system-level edge ID, which are internally generated. You can check if two edges are the same, i.e., have the same edge ID, using the `=` and `!=` operator between the `ID()` function on two variables that bind to relationships. For example, you can query `MATCH (n1:User)-[r1:Follows]->(n2:User)<-[r2:Follows]-(n3:User) WHERE ID(r1) != ID(r2) RETURN *` to ensure that the same relationship does not bind to both r1 and r2.
- **Pairing**: A relationship can only be defined as being from one node table/label to one node table/label.
  :::

### Relationship Multiplicities

For any relationship label E, e.g., , by default there can be multiple relationships from any node v both in the forward and backward direction. In database terminology, relationships are by default many-to-many. For example in the first Follows example above: (i) any User node v can follow multiple User nodes; and (ii) be followed by multiple User nodes. You can also constrain the multiplicity to _at most 1_ (we don't yet support exactly 1 semantics as in foreign key constraints in relational systems) in either direction. You can restrict the multiplicities for two reasons:

1. Constraint: Multiplicities can serve as constraints you would like to enforce (e..g, you want Kùzu to error if an application tries to add a second relationship of a particular label to some node)
2. Performance: Kùzu can store 1-to-1, many-to-1, or 1-to-many relationships (explained momentarily) in more efficient/compressed format, which is also faster to scan.

You can optionally declare the multiplicity of relationships by adding `MANY_MANY`, `ONE_MANY`, `MANY_ONE`, or `ONE_ONE` clauses to the end of the `CREATE REL TABLE` command.
Below are a few examples:

```sql
CREATE REL TABLE LivesIn(FROM User TO City, MANY_ONE)
```

The DDL shown above indicates that `LivesIn` has n-1 multiplicity. This command enforces an additional constraint that each `User` node `v` might live in at most one `City` node (assuming our database has `City` nodes). It does not put any constraint in the "backward" direction, i.e., there can be multiple `User`s living in the same `City`. As another example to explain the semantics of multiplicity constraints in the presence of multiple node labels, consider the following:

```sql
CREATE REL TABLE Likes(FROM Pet TO User, ONE_MANY)
```

The DDL above indicates that `Likes` has 1-to-n multiplicity. This DDL command enforces the constraint that each `User` node `v` might be `Liked` by one `Pet` node. It does not place any constraints in the forward direction, i.e., each `Pet` node might know multiple `User`s.

In general in a relationship `E`'s multiplicity, if the "source side" is `ONE`, then for each node `v` that can be the destination of `E` relationships, `v` can have at most one backward edge. If the "destination side" is `ONE`, then each node `v` that can be the source of `E` relationships, `v` can have at most one forward edge.

## Create relationship table group

You can use relationship table groups to gain added flexibility in your data modelling, by defining a relationship table with multiple node table pairs. This is done via the `CREATE REL TABLE GROUP` statement. This has a similar syntax to `CREATE REL TABLE`, but uses multiple `FROM ... TO ...` clauses. Internally, a relationship table group defines a relationship table for _each_ `FROM ... TO ...` block. Any query to a relationship table group is treated as a query on the union of _all_ relationship tables in the group.

:::note[Note]
Currently, Kùzu does not allow `COPY FROM` or `CREATE` using a relationship table group. You need to explicitly specify a relationship table
that you want to insert data into.
:::

```sql
CREATE REL TABLE GROUP Knows (FROM User To User, FROM User to City, year INT64);
```

The statement above creates a Knows_User_User rel table and a Knows_User_City rel table. And a Knows rel table group refering these two rel tables.

```sql
CALL SHOW_TABLES() RETURN *;
```

Output:

```
----------------------------------------------
| TableName       | TableType | TableComment |
----------------------------------------------
| Knows           | REL_GROUP |              |
----------------------------------------------
| Knows_User_City | REL       |              |
----------------------------------------------
| Knows_User_User | REL       |              |
----------------------------------------------
| User            | NODE      |              |
----------------------------------------------
| City            | NODE      |              |
----------------------------------------------
```

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

If the given table name already exists in the database, Kùzu throws an exception when you try to create it.
To avoid the exception being raised, use the `IF NOT EXISTS` clause. This tells Kùzu to do nothing when
the given table name already exists in the database.

Example:
```sql
CREATE NODE TABLE IF NOT EXISTS UW(ID INT64, PRIMARY KEY(ID))
```
This query tells Kùzu to only create the `UW` table if it doesn't exist.

The same applies to relationship tables as well.