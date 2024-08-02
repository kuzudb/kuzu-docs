---
title: Serial
---

## SERIAL
`SERIAL` is a logical data type used for creating an auto-incrementing sequence of numbers, typically
used as a unique column identifier, similar to `AUTO_INCREMENT` feature supported
by some other databases. 

### Using `SERIAL` as Primary Key Column

```
// person.csv
Alice
Bob
Carol
```

```cypher
CREATE NODE TABLE Person(id SERIAL, name STRING, PRIMARY KEY(id));
COPY Person FROM 'person.csv';
MATCH (a:Person) RETURN a;
```
Output:
```
-------------------------------------------
| a                                       |
-------------------------------------------
| (label:Person, 3:0, {id:0, name:Alice}) |
-------------------------------------------
| (label:Person, 3:1, {id:1, name:Bob})   |
-------------------------------------------
| (label:Person, 3:2, {id:2, name:Carol}) |
-------------------------------------------
```

### Using `SERIAL` for properties in relationship tables

You can create relationship tables that have a `SERIAL` property column. For example, consider a
scenario where you want to generate a unique transaction ID for each transfer between users.

```cypher
CREATE REL TABLE Transfer (from User to User, trx_id SERIAL);
```
