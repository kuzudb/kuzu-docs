---
title: Serial
sidebar_position: 9
---

# SERIAL
`SERIAL` is a logical data type and usually used for creating an incremental sequence of unique identifier column (similar to `AUTO_INCREMENT` supported by some other databases).


### Using `SERIAL` as Primary Key Column
`person.csv`
```
Alice
Bob
Carol
```

```
CREATE NODE TABLE Person(ID SERIAL, name STRING, PRIMARY KEY(ID));
COPY Person FROM `person.csv`;
MATCH (a:Person) RETURN a;
```
Output:
```
-------------------------------------------
| a                                       |
-------------------------------------------
| (label:Person, 3:0, {ID:0, name:Alice}) |
-------------------------------------------
| (label:Person, 3:1, {ID:1, name:Bob})   |
-------------------------------------------
| (label:Person, 3:2, {ID:2, name:Carol}) |
-------------------------------------------
```