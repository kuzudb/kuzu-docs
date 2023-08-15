---
title: CSV Export
---

Using the `COPY TO` command, you can export query results to a CSV file. 
By default, a header is included, and fields are separated by commas (,). Each row will be written as displayed in the query output.

Below are some examples:

```
COPY (MATCH (p:person) RETURN p.ID, p.name) TO 'person.csv';
```
The CSV file will be written as follow:

```
p.ID,p.name
0,"Alice"
2,"Bob"
3,"Carol"
5,"Dan"
9,"Greg"
...
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
