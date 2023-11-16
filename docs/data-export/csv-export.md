---
title: CSV
---

# Data Export to CSV

`COPY TO` clause can export query result into a CSV file. 
```
COPY (MATCH (u:User) RETURN u.*) TO 'user.csv' (header=true);
```
The CSV file will be written as follow:
```
u.name,u.age
Adam,30
Karissa,40
Zhang,50
Noura,25
```

Nested datatypes like lists and structs will be represented as text inside their respective columns.

Zero or more copy options can be provided as part of the copy-to clause:

| Option                   | Default Value           | Description                                          |
|--------------------------|-------------------------|------------------------------------------------------|
| ESCAPE                   | `\`                     | Character used to escape special characters in CSV.  |
| DELIM                    | `,`                     | Character that separates fields in the CSV.          |
| QUOTE                    | `"`                     | Character used to enclose fields containing special characters or spaces. |
| Header                   | `false`                 | Indicates whether to output a header row      |

## Example:
### Query:
```
COPY (MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name) TO 'follows.csv' (header=false, delim='|');
```
### Result: follows.csv
```
Adam|2020|Karissa
Adam|2020|Zhang
Karissa|2021|Zhang
Zhang|2022|Noura
```
