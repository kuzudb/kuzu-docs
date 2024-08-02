---
title: Create sequence
description: Create sequence DDL statements
---

The `CREATE SEQUENCE` statement creates a new sequence number generator (or, simply, _sequence_), which
are commonly used to generate unique identifiers for rows of a table. `SEQUENCE` can be used the same way as you would
[`SERIAL`](/cypher/data-types#serial), which is a logical data type that automatically generates unique values for a column.

The following commands create a sequence object named `Seq`.

```sql
CREATE SEQUENCE Seq;
CREATE SEQUENCE Seq2 INCREMENT 1 MINVALUE 1 NO MAXVALUE START 1 NO CYCLE;
```

You can also drop an existing sequence using the `DROP SEQUENCE` statement. See the
[DROP SEQUENCE](/cypher/data-definition/drop#drop-sequence)
documentation for more information.

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

## Sequence functions

Below, we summarize the existing functions that can operate on sequence objects.

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

## Show available sequences

Once you generate a sequence, you can view all available sequences in the database using the
`CALL` clause as shown below:

```
kuzu> CREATE SEQUENCE Seq;
kuzu> CALL SHOW_SEQUENCES() RETURN *;
┌────────┬───────────────┬─────────────┬───────────┬───────────┬─────────────────────┬───────┐
│ name   │ database name │ start value │ increment │ min value │ max value           │ cycle │
│ STRING │ STRING        │ INT64       │ INT64     │ INT64     │ INT64               │ BOOL  │
├────────┼───────────────┼─────────────┼───────────┼───────────┼─────────────────────┼───────┤
│ Seq    │ local(kuzu)   │ 1           │ 1         │ 1         │ 9223372036854775807 │ False │
└────────┴───────────────┴─────────────┴───────────┴───────────┴─────────────────────┴───────┘
```

To see the full list of available arguments to the `SHOW_SEQUENCES()` function, see
[this page](/cypher/query-clauses/call#show_sequences).

## Usage

In this section, we list some common ways you can use sequences in your database.

### Using sequences for primary keys

You can use a sequence to generate unique primary keys for your node tables. For example, consider
you want to create a `Student` node table whose IDs start from 10 and have an increment of 10.

First, define the sequence as shown below:

```sql
CREATE SEQUENCE id_sequence START 10 INCREMENT 10;
```

To use the sequence generator, you must first apply a function on it. Below, we show an example of
creating a `Student` node table with the `id` property that will take values from `id_sequence`:

```sql
CREATE NODE TABLE Student (id INT64 DEFAULT nextval('id_sequence'), name STRING, PRIMARY KEY(id));
```

Once the `nextval` function is called, the sequence is generated, and you can insert student records
into the table without specifying an `id` value (these will be obtained from the sequence generator).

```sql
CREATE (a:Student) SET a.name = "Karissa";
CREATE (b:Student) SET b.name = "Rhea";
```

Returning the values from the table will show the `id` values obtained from the sequence. These
values are guaranteed to be unique.

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
