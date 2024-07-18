---
title: Create (statement)
description: Create tables
---

## Create node table
The following statement defines a table of `User` nodes.

```cypher
CREATE NODE TABLE User(name STRING, age INT64, reg_date DATE, PRIMARY KEY (name))
```

This adds a `User` table to the catalog of the system with three predefined properties. During querying, the name of the table will serve as the label of the nodes, e.g., `MATCH (a:User) RETURN sum(a.age)` returns the sum of the ages of all `User` nodes in the system.

Kùzu requires a primary key column for node table which can be either a `STRING` or `INT64` property of the node. Kùzu will generate an index to do quick lookups on the primary key (e.g., `name` in the above example). Alternatively, you can use the [`SERIAL`](https://docs.kuzudb.com/cypher/data-types/#serial) data type to generate an auto-increment column as primary key.

## Create relationship table

The following statement adds to the catalog a Follows relationship table between User and User with one date property.

```cypher
CREATE REL TABLE Follows(FROM User TO User, since DATE)
```

:::caution[Notes]
- **Syntax**: There is no comma between the `FROM` and `TO` clauses.
- **Directionality**: Each relationship has a direction following the property graph model. So when `Follows` relationship records are added, each one has a specific source (FROM) node and a specific destination (TO) node.
- **Primary keys**: You cannot define a primary key for relationship records. Each relationship gets a unique system-level edge ID, which are internally generated. You can check if two edges are the same, i.e., have the same edge ID, using the `=` and `!=` operator between the `ID()` function on two variables that bind to relationships. For example, you can query `MATCH (n1:User)-[r1:Follows]->(n2:User)<-[r2:Follows]-(n3:User) WHERE ID(r1) != ID(r2) RETURN *` to ensure that the same relationship does not bind to both r1 and r2.
- **Pairing**: A relationship can only be defined as being from one node table/label to one node table/label.
:::

### Relationship Multiplicities

For any relationship label E, e.g., , by default there can be multiple relationships from any node v both in the forward and backward direction. In database terminology, relationships are by default many-to-many. For example in the first Follows example above: (i) any User node v can follow multiple User nodes; and (ii) be followed by multiple User nodes. You can also constrain the multiplicity to *at most 1* (we don't yet support exactly 1 semantics as in foreign key constraints in relational systems)  in either direction. You can restrict the multiplicities for two reasons:
1. Constraint: Multiplicities can serve as constraints you would like to enforce (e..g, you want Kùzu to error if an application tries to add a second relationship of a particular label to some node)
2. Performance: Kùzu can store 1-to-1, many-to-1, or 1-to-many relationships (explained momentarily) in more efficient/compressed format, which is also faster to scan. 
 
You can optionally declare the multiplicity of relationships by adding `MANY_MANY`, `ONE_MANY`, `MANY_ONE`, or `ONE_ONE` clauses to the end of the `CREATE REL TABLE` command.
Below are a few examples:

```cypher
CREATE REL TABLE LivesIn(FROM User TO City, MANY_ONE)
```
The DDL shown above indicates that `LivesIn` has n-1 multiplicity. This command enforces an additional constraint that each `User` node `v` might live in at most one `City` node (assuming our database has `City` nodes). It does not put any constraint in the "backward" direction, i.e., there can be multiple `User`s living in the same `City`. As another example to explain the semantics of multiplicity constraints in the presence of multiple node labels, consider the following:

```cypher
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

```cypher
CREATE REL TABLE GROUP Knows (FROM User To User, FROM User to City, year INT64);
```
The statement above creates a Knows_User_User rel table and a Knows_User_City rel table. And a Knows rel table group refering these two rel tables. 
```cypher
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
```cypher
MATCH (a:User)-[:Knows]->(b) RETURN *;
```
The query above is equivalent to the following:
```cypher
MATCH (a:User)-[:Knows_User_User|:Knows_User_city]->(b) RETURN *;
```

As you can imagine, the more relationships you want to selectively query on, the more useful relationship table groups become.

## IF NOT EXISTS
If the given table name already exists in the database, Kùzu throws an exception when you try to create it. To avoid the exception being raised, use the `IF NOT EXISTS` clause. This tells Kùzu to do nothing when
the given table name already exists in the database.

Example:
```sql
CREATE NODE TABLE IF NOT EXISTS UW(ID INT64, PRIMARY KEY(ID))
```
This query tells Kùzu to only create the `UW` table if it doesn't exist.

