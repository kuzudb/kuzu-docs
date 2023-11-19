---
title: CSV
---

# Data Import from CSV Files
You can load the initial versions of your node and rel tables from CSV files 
using the `COPY FROM` command. It is recommended to use `COPY FROM` if you are ingesting large databases.  `COPY FROM` commands can only be used when tables are empty. 

## CSV Configuration

Similar to Postgres, CSV configuration can be manually changed by specifying them inside `( )` at the end of the the `COPY FROM` command. The following table shows configurations supported in Kùzu.

| Parameter | Description | Default Value |
|:-----|:-----|:-----|
| HEADER | Whether the first line of the CSV file is the header. Can be true or false. | false |
| DELIM | Character that separates different columns in a lines. | `,`|
| QUOTE | Character to start a string quote. | `"` |
| ESCAPE | Character within string quotes to escape QUOTE and other characters, e.g., a line break. <br/> See the important note below about line breaks lines below.| `\` |
| LIST_BEGIN/LIST_END | For the [list data type](../cypher/data-types/list.md), the delimiters to specify <br/> list begin and list end characters | `[`, `]`|
| PARALLEL | Read csv files in parallel or not | true |

Example below change the delimiter from `,` to `|` and specifies header exist.
```
COPY User FROM "user.csv" (HEADER=true, DELIM="|");
```

**Notes** 
- **Starting with empty tables:** `COPY FROM` commands can be used when your tables are completely empty. So you should use `COPY FROM` immediately after you define the schemas of your tables. 
- **Copying Nodes Before Rels:** In order to copy a rel table R from a csv file RFile, the nodes that appear RFile need to be 
already in the database (either imported in bulk or inserted through Cypher data manipulation commands).
- **Wrapping strings inside quotes:** Kùzu will accept strings in string columns both with and without quotes. 
- **Leading and trailing spaces**: As per the CSV standard, Kùzu does not ignore the leading and trailing spaces (e.g., if you input ` 213` for 
  an integer value, that will be read as malformed integer and the corresponding node/rel property will be set to NULL.
  
## `COPY FROM` a CSV File to a Node Table 
Consider a node table User created through
```
CREATE NODE TABLE User(name STRING, age INT64, reg_date DATE, PRIMARY KEY (name))
```
And CSV file `user.csv`
```
name,age,reg_date
Adam,30,2020-06-22
Karissa,40,2019-05-12
...
```
The following statement will load "user.csv" into User table.
```
Copy User From "user.csv" (header=true);
```
## `COPY FROM` a CSV File to a Rel Table

When loading into a relationship table, Kùzu assumes the first two columns in the file are:
  - FROM Node Column: The primary key of the FROM nodes.
  - TO Node Column: The primary key of the TO nodes.
 
The rest of the columns corespond to relationship properties. 

Consider a relationship table Follows created through
```
CREATE REL TABLE Follows(FROM User TO User, since DATE)
```
And CSV file `follows.csv`
```
Adam,Karissa,2010-01-30
Karissa,Michelle,2014-01-30
...
```
The following statement will load "follows.csv" into Follows table.
```
Copy Follows From "follows.csv";
```

## `COPY FROM` Multiple CSV Files to a Single Table
It is a common practice to divide a voluminous CSV file into several smaller CSV files for the sake of convenience in storage. Kùzu can read multiple files of the same format, and consolidating their data into a single node or relational table. User can load multiple files in the following ways:

- **Glob**: Similar to Linux [Glob](https://man7.org/linux/man-pages/man7/glob.7.html), Kùzu allows user to specify file paths that matches the glob pattern.

Wildcard rules:

| Wildcard | description |
| ----------- | ----------- |
| * | match any number of any characters (including none) |
| ?	| match any single character |
| [abc] | match any one of the characters enclosed within the brackets |
| [a-z] | match any one of the characters within the range |

```
COPY person FROM "vPerson*.csv"
```

- **List of files**:

```
COPY person FROM ["vPerson0.csv", "vPerson1.csv", "vPerson2.csv"]
```
