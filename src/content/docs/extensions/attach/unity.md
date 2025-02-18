---
title: Attaching to unity catalog
---

Note: This is an experimental extension of Kùzu demonstrating the unity catalog integration.

Kùzu supports directly scanning from delta tables registed in unity catalog using the `LOAD FROM` statement.


## Usage

The unity catalog extension can be installed and loaded by running the following commands using the Kùzu CLI
or your preferred language client API:

```
INSTALL unity_catalog;
LOAD EXTENSION unity_catalog;
```

#### 1. Setup unity catalog server

To illustrate the usage of this extension, we set up the open source version of unity catalog.
##### Download the unity catalog server
```bash
git clone https://github.com/unitycatalog/unitycatalog.git
```

##### Start unity catalog server
```
bin/start-uc-server
```

In the following example, we will attach to the `default` schema under the `unity` catalog and scan the `numbers` delta table.
The table, schema and catalog are pre-defined in the unity catalog, so you don't have to create them.
#### 2. Attach to unity catalog

```sql
ATTACH [CATALOG_NAME] AS [alias] (dbtype UC_CATALOG)
```

- `CATALOG_NAME`: The catalog name to attach to in the unity catalog
- `alias`: Database alias to use in Kùzu - If not provided, the catalog name will be used.
  When attaching multiple databases, it's recommended to use aliasing.

Note: Kùzu attaches to the `default` schema under the given catalog name. Specifying the schema to attach is not supported right now.

#### 3. Data type mapping from unity catalog to Kùzu

The table below shows the mapping from unity catalog's type to Kùzu's type:
| Data type in Unity Catalog         | Corresponding data type in Kùzu |
|-----------------------------|----------------------------------|
| BOOLEAN                     | BOOLEAN                           |
| BYTE                        | UNSUPPORTED                          |
| SHORT                       | INT16                                 |
| INT                    | INT32                                 |
| LONG                       | INT64                                 |
| DOUBLE                     | DOUBLE                                 |
| FLOAT                      | FLOAT                                 |
| DATE                    | DATE                                 |
| TIMESTAMP                    | TIMESTAMP                                 |
| TIMESTAMP_NTZ                   | UNSUPPORTED                                 |
| STRING                   | STRING                                 |
| BINARY                       | UNSUPPORTED                      |
| DECIMAL   | DECIMAL                                 |

#### 4. Scan from tables registered in unity catalog

Finally, we can utilize the `LOAD FROM` statement to scan the `numbers` table. Note that you need to prefix the 
external `numbers` table with the database alias (in our example `unity`). See the `USE` statement which allows you to
skip this prefixing for a specific default database.

```sql
LOAD FROM unity.numbers
RETURN *
```

Result:

```
┌────────┬────────────┐
│ as_int │ as_double  │
│ INT32  │ DOUBLE     │
├────────┼────────────┤
│ 564    │ 188.755356 │
│ 755    │ 883.610563 │
│ 644    │ 203.439559 │
│ 75     │ 277.880219 │
│ 42     │ 403.857969 │
│ 680    │ 797.691220 │
│ 821    │ 767.799854 │
│ 484    │ 344.003740 │
│ 477    │ 380.678561 │
│ 131    │ 35.443732  │
│ 294    │ 209.322436 │
│ 150    │ 329.197303 │
│ 539    │ 425.661029 │
│ 247    │ 477.742227 │
│ 958    │ 509.371273 │
└────────┴────────────┘
```

Note: Kùzu currently only supports scanning from delta tables registered in the unity catalog.

#### 5. USE: Reference unity catalog without alias

You can use the `USE` statement for attached unity catalog to use a default unity catalog name for future operations.
This can be used when reading from an attached unity catalog to avoid specifying the full catalog name
as a prefix to the table name.

Consider the same attached unity catalog as above:

```sql
ATTACH 'unity' AS unity (dbtype UC_CATALOG);
```

Instead of defining the catalog name for each subsequent clause like this:

```sql
LOAD FROM unity.numbers
RETURN *
```

You can do:

```sql
USE unity;
LOAD FROM numbers
RETURN *
```

#### 6. Copy data from delta tables registered in the unity catalog

One important use case of the unity catalog extension is to facilitate seamless data transfer from tables in unity catalog to Kùzu.
In this example, we continue using the `unity` database, but this time,
we copy the data and persist it to Kùzu. This is done with the `COPY FROM` statement. Here is an example:

We first create a `numbers` table in Kùzu. In this example we will make `numbers` have the same schema as the one defined in the unity catalog.

```cypher
CREATE NODE TABLE numbers (id INT32, score DOUBLE , PRIMARY KEY(id));
```

When the schemas are the same, we can copy the data from the external unity catalog table to the Kùzu table simply as follows.

```sql
 copy numbers from unity.numbers;
```
If the schemas are not the same, e.g., `numbers` contains only `score` property while the external `unity.numbers` contains
`id` and `score`, we can still use `COPY FROM` but with a subquery as follows:
```sql
COPY numbers FROM (LOAD FROM unity.numbers RETURN score);
```

#### 7. Query the data in Kùzu

Finally, we can verify the data in the `numbers` table in Kùzu.

```cypher
MATCH (n:numbers) RETURN n.*;
```

Result:
```
┌───────┬────────────┐
│ n.id  │ n.score    │
│ INT32 │ DOUBLE     │
├───────┼────────────┤
│ 564   │ 188.755356 │
│ 755   │ 883.610563 │
│ 644   │ 203.439559 │
│ 75    │ 277.880219 │
│ 42    │ 403.857969 │
│ 680   │ 797.691220 │
│ 821   │ 767.799854 │
│ 484   │ 344.003740 │
│ 477   │ 380.678561 │
│ 131   │ 35.443732  │
│ 294   │ 209.322436 │
│ 150   │ 329.197303 │
│ 539   │ 425.661029 │
│ 247   │ 477.742227 │
│ 958   │ 509.371273 │
└───────┴────────────┘
```

#### 8. Detach unity catalog

To detach a unity catalog, use `DETACH [ALIAS]` as follows:

```
DETACH unity
```
