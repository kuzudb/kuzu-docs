import DocCardList from '@theme/DocCardList';

# Data Types
Kùzu supports a set of primitive and nested data types both for node and relationship properties as well as for forming expressions whose outputs are in these data types. The table below shows all built-in data types.

| Data Type | Size | Description | Aliases
| --- | --- | --- | --- | 
| BLOB | variable | arbitrary binary object | BYTEA |
| BOOLEAN | 1 byte | true/false | |
| DATE | 4 bytes | year, month, day| |
| DOUBLE | 8 bytes | double precision floating-point number | |
| FIXED-LIST | fixed | a fixed-size sequence of values of the same numerical type | |
| FLOAT | 4 bytes | single precision floating-point number | |
| INT16 | 2 bytes | signed two-byte integer | |
| INT32 | 4 bytes | signed four-byte integer | INT |
| INT64 | 8 bytes | signed eight-byte integer | SERIAL |
| INTERVAL | 4 bytes | date/time difference | | 
| NODE | fixed | represents a node in graph | |
| PATH | fixed | represents a path in graph | |
| REL | fixed | represents a rel in graph | |
| STRING | variable | variable-length character string | |
| STRUCT | fixed | a dictionary where keys are of type STRING | |
| TIMESTAMP | 4 bytes | combination of time and date | |
| VAR-LIST | variable | a sequence of values of the same type | |

<DocCardList />