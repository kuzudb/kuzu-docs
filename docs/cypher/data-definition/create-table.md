---
title: Create
sidebar_position: 0
description: Create tables
---

# CREATE

As a first step to creating your database, you need to define your node and directed relationships. In the property graph model, nodes and relationships have labels. In Kùzu, every node or relationship can have 1 label. The node and relationships and the predefined properties on them are defined through `CREATE NODE TABLE` and `CREATE REL TABLE` commands. The choice of using the term "table" over "label" is intentional and explained below[^1].

## CREATE NODE TABLE
The following statement defines a table of User nodes. 
```
CREATE NODE TABLE User(name STRING, age INT64, reg_date DATE, PRIMARY KEY (name))
```
This adds a User table to the catalog of the system with 3 predefined properties. During querying, the name of the table will serve as the label of the nodes, e.g., `MATCH (a:User) RETURN sum(a.age)` returns the sum of the ages of all User nodes in the system. 

Kùzu requires a primary key column for node table which can be either a `STRING` or `INT64` property of the node. Kùzu will generate an index to do quick lookups on the primary key (e.g., name in the above example). Alternativly, you can use [`SERIAL` data type](./data-types/serial.md) to generate an auto-increment column as primary key.

## CREATE REL TABLE
The following statement adds to the catalog a Follows relationship table between User and User with one date property. 
```
CREATE REL TABLE Follows(FROM User TO User, since DATE)
```
Notes:
- There is no comma between the FROM and TO clauses. 
- Relationship directions: Each relationship has a direction following the property graph model. So when Follows relationship records are added, each one has a specific source/from node and a specific destination/to node[^2].
- Relationship primary keys: You cannot define a primary key for relationship records. Each relationship gets a unique system-level edge ID, which are internally generated. You can check if two edges are the same, i.e., have the same edge ID, using the "=" and "!=" operator between "ID()" function on two variables that bind to relationships. For example, you can query `MATCH (n1:User)-[r1:Follows]->(n2:User)<-[r2:Follows]-(n3:User) WHERE ID(r1) != ID(r2) RETURN *` to ensure that the same relationship does not bind to both r1 and r2.
- Relationship can only be defined as being from one node table/label to one node table/label.

### Relationship Multiplicities

For any relationship label E, e.g., , by default there can be multiple relationships from any node v both in the forward and backward direction. In database terminology, relationships are by default many-to-many. For example in the first Follows example above: (i) any User node v can follow multiple User nodes; and (ii) be followed by multiple User nodes. You can also constrain the multiplicity to *at most 1* (we don't yet support exactly 1 semantics as in foreign key constraints in relational systems)  in either direction. You can restrict the multiplicities for two reasons: 
1. Constraint: Multiplicities can serve as constraints you would like to enforce (e..g, you want Kùzu to error if an application tries to add a second relationship of a particular label to some node)
2. Performance: Kùzu can store 1-to-1, many-to-1, or 1-to-many relationships (explained momentarily) in more efficient/compressed format, which is also faster to scan. 
 
You can optionally declare the multiplicity of relationships by adding MANY_MANY, ONE_MANY, MANY_ONE, or ONE_ONE clauses to the end of the CREATE REL TABLE command.
Here are a few  example:

```
CREATE REL TABLE LivesIn(FROM User TO City, MANY_ONE)
```
The above ddl indicates that LivesIn has n-1 multiplicity. This command puts an additional constraint that each User node v might LiveIn at most 1 City node (assuming our database has City nodes). It does not put any constraint in the "backward" direction, i.e., there can be multiple Users living in the same City. As another example to explain the semantics of multiplicity constraints in the presence of multiple node labels, consider this: 

```
CREATE REL TABLE Likes(FROM Pet TO User, ONE_MANY)
```
The above ddl indicates that Likes has 1-to-n multiplicity. This ddl command puts the constraint: that each User node v might be Liked by one Pet node. It does not put any constraint in the forward direction, i.e., each Pet node might know multiple Users.

In general in a relationship E's multiplicity, if the "source side" is "ONE", then for each node v that can be the destination of E relationships, v can have at most 1 backward edge. If the "destination side" is ONE, then each node v that can be the source of E relationships, v can have at most 1 forward edge. 

## CREATE REL TABLE GROUP


[^1]: We prefer the term "table" instead of "label" because Kùzu, as well as other GDBMSs are ultimately relational systems in the sense that they store and process sets of tuples, i.e., tables or relations. A good way to understand the property graph model is as tagging your tables as "node" and "relationship tables" depending on their roles in your application data. Nodes are generally suitable to represent entities in your applications, while relationships represent the relationships/connections. Relationships are the primary means to join nodes with each other to find paths and patterns in your graph database. So when you define a node label and a set of nodes/relationships, this is equivalent to defining a table or records as nodes or relationships. During querying you can bind node records in syntax like (a:Person), while relationships in syntax like (..)-[e:Knows]->(...). Similar to table definitions in SQL, node and relationship tables have primary keys, a term that is defined in the context of tables: node tables explicitly define primary keys as one of their properties, while the primary keys of relationship tables are implicitly defined by the primary keys of their FROM and TO node records. Further observe that similar to relational systems, properties can be thought equivalently as columns of a table, justifying our choice of using the term table in these definitions.

[^2]: We have currently not decided if Kùzu will support undirected edges or support it in a way similar to Neo4j, which always forces directed edges but allow querying in an undirected way. See [examples here](https://neo4j.com/docs/cypher-manual/current/introduction/uniqueness/) for the details how Neo4j supports "undirected querying", which matches edges from both directions.
