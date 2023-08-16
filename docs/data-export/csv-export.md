---
title: CSV
---

# Data Export to CSV

`COPY TO` clause can export query result into a CSV file. By default, a header is included, and fields are separated by commas `,`.

```
COPY (MATCH (u:User) RETURN u.*) TO 'user.csv';
```
The CSV file will be written as follow:
```
u.name,u.age
"Adam",30
"Karissa",40
"Zhang",50
"Noura",25
```

```
COPY (MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name) TO 'follows.csv';
```
follows.csv:
```
a.name,f.since,b.name
"Adam",2020,"Karissa"
"Adam",2020,"Zhang"
"Karissa",2021,"Zhang"
"Zhang",2022,"Noura"
```

Nested datatypes like lists and structs will be represented as text inside their respective columns.
