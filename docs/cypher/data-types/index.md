import DocCardList from '@theme/DocCardList';

# Data Types
Kùzu supports a set of primitive and nested data types both for node and relationship properties as well as for forming expressions whose outputs are in these data types. The table below shows all built-in data types.

| Data Type | Size | Description | Aliases
| --- | --- | --- | --- | 
| BOOLEAN | 1 byte | true/false | |
| DOUBLE | 8 bytes | double precision floating-point number | |
| FLOAT | 4 bytes | single precision floating-point number | |
| INT64 | 8 bytes | signed eight-byte integer | SERIAL |
| INT32 | 4 bytes | signed four-byte integer | INT |
| INT16 | 2 bytes | signed two-byte integer | |
| DATE | 4 bytes | year, month, day| |
| INTERVAL | 4 bytes | date/time difference | | 
| TIMESTAMP | 4 bytes | combination of time and date | |
| STRING | variable | variable-length character string | |
| VAR-LIST | variable | a sequence of values of the same type | |
| FIXED-LIST | fixed | a fixed-size sequence of values of the same numerical type | |
| STRUCT | fixed | a dictionary where keys are of type STRING | |

<DocCardList />