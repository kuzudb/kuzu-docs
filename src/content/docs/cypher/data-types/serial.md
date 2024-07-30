---
title: Serial
---

## SERIAL
`SERIAL` is a logical data type used for creating an auto-incrementing sequence, typically
used as a unique column identifier (similar to `AUTO_INCREMENT` feature supported
by some other databases). `SERIAL` uses `SEQUENCE` under the hood.

### Using `SERIAL` as Primary Key Column

`person.csv`
```
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

### Using `SERIAL` vs `SEQUENCE`

The following blocks perform the same function:
```cypher
CREATE NODE TABLE Person(id SERIAL, PRIMARY KEY(id));
```

```cypher
CREATE SEQUENCE Person_id_serial START 0 MINVALUE 0;
CREATE NODE TABLE Person(id INT64 default nextval('Person_id_serial'), PRIMARY KEY(id));
```
