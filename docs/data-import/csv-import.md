---
title: CSV
---

# Data Import from CSV Files
You can load the initial versions of your node and rel tables from CSV files 
using the `COPY FROM` command. You should use CSV loading if you are ingesting large databases. 
`COPY FROM` commands can be used when your tables are completely empty. 

## Configuring CSV Reading
Kùzu's CSV reader has default configurations for a set of parameters for the CSV file, such as delimiters 
and escape character. These can be manually changed by specifying them inside `( )` at the end of the
the `COPY FROM` command. The following table specifies the parameters and their default values.

| Parameter | Description | Default Value |
|:-----|:-----|:-----|
| HEADER | Whether the first line of the CSV file is the header. Can be true or false. | false |
| DELIM | Character that separates different columns in a lines. | `,`|
| QUOTE | Character to start a string quote. | `"` |
| ESCAPE | Character within string quotes to escape QUOTE and other characters, e.g., a line break. <br/> See the important note below about line breaks lines below.| `\` |
| LIST_BEGIN/LIST_END | For the [list data type](../cypher/data-types/list.md), the delimiters to specify <br/> list begin and list end characters | `[`, `]`|
| PARALLEL | Read csv files in parallel or not | true |

Here are examples of specifying that there is a header file and changing the delimiter from `,` to `|`:
```
COPY User FROM "user.csv" (HEADER=true);

COPY User FROM "user.csv" (DELIM="|");
```

## Several Notes
Here are several important rules about Kùzu's CSV reader: 
- **Starting with empty tables:** `COPY FROM` commands can be used when your tables are completely empty. So you should 
use `COPY FROM` immediately after you define the schemas of your tables. 
- **Copying Nodes Before Rels:** In order to copy a rel table R from a csv file RFile, the nodes that appear RFile need to be 
already in the database (either imported in bulk or inserted through Cypher data manipulation commands).
- **Line break/new line character (CRLF):** The line break character (one corresponding to the RETURN or Enter on most keyboards) can 
only appear to start a new row in your CSVs. It cannot appear inside column values, e.g, inside a string column between "...CRLF...". 
`COPY FROM` commands will fail if this happens. You should instead use '\n' character or '\r\n' to specify line breaks inside your strings.
- **Wrapping strings inside quotes:** Kùzu will accept strings in string columns both with and without quotes. 
- **Leading and trailing spaces**: As per the CSV standard, Kùzu does not ignore the leading and trailing spaces (e.g., if you input ` 213` for 
  an integer value, that will be read as malformed integer and the corresponding node/rel property will be set to NULL.
- **Header line:** Header lines, if they exist, are the first lines and ignored by the CSV reader. A header line can be added to your 
   CSV files for your convenience but the CSV reader assumes a fixed order of columns (both for CSV files for nodes as well as relationship 
   tables), so simply ignores the header row.
- **Extra columns in the csv files:** Kùzu will omit any extra columns that don't match the table schema in the csv file.
  
## `COPY FROM` a CSV File to a Node Table 
For the examples here, let us consider a `User(name STRING, age INT64, reg_date DATE, PRIMARY KEY (name))` 
node table with the name, age, and reg_date predefined properties. The order of the columns need to 
match the order of the predefined properties for node tables in the catalog. This is the order you used 
when defining the schema of your node table. 

Example CSV file `user.csv` without a header file:
```
Adam,30,2020-06-22
Karissa,40,2019-05-12
...
```
The same file with header could have the following first line if (HEADER = true) was given, which would however be ignored as explained above:
```
name,age,reg_date
```
## `COPY FROM` a CSV File to a Rel Table

The order of the columns are as follows:
  - FROM Node Column: The primary key of the FROM nodes.
  - TO Node Column: The primary key of the TO nodes.
  - Rest of the columns: The predefined properties on the relationship table as defined in your `CREATE REL TABLE` command. 

Here are a few examples:
Consider the CREATE REL TABLE Follows(FROM User TO User, since DATE) table. An example CSV file `follows.csv` without a header 
can be as follows:
```
Adam,Karissa,2010-01-30
Karissa,Michelle,2014-01-30
...
```
You can use `COPY Follows FROM "follows.csv"` to load this file.

## `COPY FROM` Multiple CSV Files to a Single Table
It is a common practice to divide a voluminous CSV file into several smaller CSV files for the sake of convenience in storage. Kùzu can read multiple files of the same format (csv or parquet), and consolidating their data into a single node or relational table. User can load multiple files in the following ways:

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
