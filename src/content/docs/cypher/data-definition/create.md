---
title: Create
description: Create DDL statements
---

To construct a graph in Kùzu, you need to first create node and relationship tables. The syntax for each
is shown in this section. Creating the node and relationship tables is also called "defining the schema"
of the graph. The Data Definition Language (DDL) in Kùzu provides a set of SQL-like commands that allow
you to define the structure of your graph and the data types in your node and relationship tables.

## Create node table

To create a node table, use the `CREATE NODE TABLE` statement as shown below:

```sql
CREATE NODE TABLE User (name STRING, age INT64 DEFAULT 0, reg_date DATE, PRIMARY KEY (name))
```
The above statement adds a `User` table to the catalog of the system with three properties: `name`, `age`, and `reg_date`,
with the primary key being set to the `name` property in this case.

The name of the node table, `User`, specified above will serve as the "label" which we want to query
in Cypher, for example:
```sql
MATCH (a:User) RETURN *
```

### Primary key

Kùzu requires a primary key column for node table which can be either a `STRING` or `INT64` property of the node. Kùzu will generate an index to do quick lookups on the primary key (e.g., `name` in the above example). Alternatively, you can use the [`SERIAL`](/cypher/data-types/#serial) data type to generate an auto-increment column as primary key.

### Default value

Each property in a table can have a default value. If not specified, the default value is `NULL`.

```sql
CREATE NODE TABLE User (name STRING, age INT64 DEFAULT 0, reg_date DATE, PRIMARY KEY (name))
```

In the above example, the `age` property is set to a default value of `0` rather than `NULL`. The
`name` and `reg_date` properties do not have default values, so they will be `NULL` if not provided
during data insertion.

### IF NOT EXISTS

If the given table name already exists in the database, by default, Kùzu throws an exception when you try to
create it. To avoid the exception being raised, use the `IF NOT EXISTS` clause as follows:

```sql
CREATE NODE TABLE IF NOT EXISTS User (name STRING, age INT64 DEFAULT 0, reg_date DATE, PRIMARY KEY (name))
```
This tells Kùzu to do nothing when
the given table name already exists in the database.


## Create relationship table

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

## Create SEQUENCE

The `CREATE SEQUENCE` statement creates a new sequence number generator.
You can think of `SEQUENCE` as a generalization of the `SERIAL` data type, where you can impose
conditions on the numbers generated in the sequence.

The following query creates a sequence named `Seq`.

```sql
CREATE SEQUENCE Seq;
CREATE SEQUENCE Seq2 INCREMENT 1 MINVALUE 1 NO MAXVALUE START 1 NO CYCLE;
```

The following optional arguments can be provided when creating a sequence:

<div class="scroll-table">

| Option | Description |
--- | ---
`INCREMENT [ BY ] <increment>` | Value added to the sequence each time it is incremented.<li>Default `1`.
`[ NO ] MINVALUE <minvalue>` | Minimum value the sequence can generate.<li>If `NO MINVALUE` is specified, the default value will be used.<li>Default for ascending sequences is 1.<li>Default for descending sequences is the minimum value of `INT64`.
`[ NO ] MAXVALUE <maxvalue>` | Maximum value the sequence can generate.<li>If `NO MAXVALUE` is specified, the default value will be used.<li>Default for ascending sequences is the maximum value of `INT64`.<li>Default for descending sequences `-1`.
`START [ WITH ] <start>` | Starting value for the sequence.<li>Default is `minvalue` for ascending sequences and `maxvalue` for descending sequences.
`[ NO ] CYCLE` | Whether or not the sequence should wrap when `maxvalue` and `minvalue` are reached for ascending and descending sequences respectively.<li>If `CYCLE`, the next generated value after the limit will then be the `minvalue` or `maxvalue`, respectively.<li>If `NO CYCLE`, which is the default, any further increments to the sequence will error out.

</div>

### Using sequences for primary keys

You can use a sequence to generate unique primary keys for your node tables. For example, consider
you want to create a `Student` node table whose IDs start from 10 and have an increment of 10.

First, define the sequence as shown below:

```sql
CREATE SEQUENCE id_sequence START 10 INCREMENT 10;
```

Then, create the `Student` node table with the `id` property set to the sequence as shown below:

```sql
CREATE NODE TABLE Student (id INT64 DEFAULT nextval('id_sequence'), name STRING, PRIMARY KEY(id));
```

Then, add the student records without specifying an `id` value (these will be set from the sequence).

```sql
CREATE (a:Student) SET a.name = "Karissa";
CREATE (b:Student) SET b.name = "Rhea";
```
Returning the values from the table will show the `id` values generated from the sequence.

```sql
MATCH (a:Student) RETURN a.id, a.name;
```
```
┌───────┬─────────┐
│ s.id  │ s.name  │
│ INT64 │ STRING  │
├───────┼─────────┤
│ 10    │ Karissa │
│ 20    │ Rhea    │
└───────┴─────────┘
```

### Using sequences for properties in relationship tables

You can also use sequences to generate unique values for properties in relationship tables. For example,
consider you want to create a `Transaction` relationship table with a unique `id` property for each transaction.

First, define the sequence as shown below:

```sql
CREATE SEQUENCE tx_sequence;
```

Then, create the `Transaction` relationship table with the `id` property set to the sequence as shown below:

```sql
CREATE REL TABLE Transaction(FROM User TO User, id INT64 DEFAULT nextval('tx_sequence'), amount INT64);
```

Then, add the transaction records without specifying an `id` value (these will be set from the sequence).

```sql
CREATE (a:User)-[r:Transaction]->(b:User) SET r.amount = 100;
```
This will create a transaction relationship between two users with the `id` property set from the sequence.

```sql
MATCH (a:User)-[r:Transaction]->(b:User) RETURN r.id, r.amount;
```
```
┌───────┬─────────┐
│ r.id  │ r.amount │
│ INT64 │ INT64    │
├───────┼─────────┤
│ 1     │ 100      │
└───────┴─────────┘
```

### Selecting the next value of a sequence

To generate the sequence, use the `nextval` command (until this is done, the sequence doesn't exist
in the database). For the existing `id_sequence`, you can return the next value in the sequence as shown below:

```sql
RETURN nextval('sq') AS nextval;
```
```
┌─────────┐
│ nextval │
│ INT64   │
├─────────┤
│ 30      │
└─────────┘
```

### Selecting the current value of a sequence

To view the current value of the sequence, use the `currval` command as shown below:

```sql
RETURN currval('sq') AS currval;
```
```
┌─────────┐
│ nextval │
│ INT64   │
├─────────┤
│ 30      │
└─────────┘
```

Note that the `nextval` function must already have been called before, otherwise the sequence does
not yet exist and a Catalog error will be thrown to indicate this.
