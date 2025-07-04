---
title: Unity Catalog extension
---

This extension adds the ability to directly scan from delta tables registed in a Unity Catalog using the `LOAD FROM` statement.

:::caution[Note]
This is an experimental extension that is a starting point towards a larger integration
of Kuzu with the lakehouse ecosystem. It may have unresolved issues. To help us address these
issues or to discuss your use case, please reach out to us on Github or Discord.
:::

## Usage

```sql
INSTALL unity_catalog;
LOAD unity_catalog;
```

#### Setup a Unity Catalog server

First, setup the open source version of Unity Catalog:

```bash
git clone https://github.com/unitycatalog/unitycatalog.git
bin/start-uc-server
```

### Attaching to a Unity Catalog

```sql
ATTACH [CATALOG_NAME] AS [alias] (dbtype UC_CATALOG)
```

- `CATALOG_NAME`: The catalog name to attach to in the Unity Catalog
- `alias`: Database alias to use in Kuzu - If not provided, the catalog name will be used.
  When attaching multiple databases, it's recommended to use aliases.

:::note[Note]
Kuzu attaches to the `default` schema under the given catalog name. Specifying the schema to attach is not supported right now.
:::

### Unity Catalog and Kuzu type mapping

The table below shows the mapping from Unity Catalog's type to Kuzu's type:

| Data type in Unity Catalog         | Corresponding data type in Kuzu |
|-----------------------------|----------------------------------|
| `BOOLEAN`                     | `BOOLEAN`                           |
| `BYTE`                        | Unsupported                          |
| `SHORT`                       | `INT16`                                 |
| `INT`                    | `INT32`                                 |
| `LONG`                       | `INT64`                                 |
| `DOUBLE`                     | `DOUBLE`                                 |
| `FLOAT`                      | `FLOAT`                                 |
| `DATE`                    | `DATE`                                 |
| `TIMESTAMP`                    | `TIMESTAMP`                                 |
| `TIMESTAMP_NTZ`                   | Unsupported                                 |
| `STRING`                   | `STRING`                                 |
| `BINARY`                       | Unsupported                      |
| `DECIMAL`   | `DECIMAL`                                 |

### Scanning data from a Unity Catalog table

Finally, we can utilize the `LOAD FROM` statement to scan the `numbers` table. Note that you need to prefix the 
external `numbers` table with the database alias (in our example `unity`). See the `USE` statement which allows you to
skip this prefixing for a specific default database.

```sql
LOAD FROM unity.numbers
RETURN *
```

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

:::caution[Note]
Currently, Kuzu only supports scanning from Delta Lake tables registered in the Unity Catalog.
:::

### Using a default Unity Catalog name

You can attach a Unity Catalog with a default name using the `USE` statement, to avoid having to specify the full catalog name in every query.

For example, for the Unity Catalog above:

```sql
ATTACH 'unity' AS unity (dbtype UC_CATALOG);
USE unity;
LOAD FROM numbers
RETURN *
```

### Copying a Unity Catalog table into Kuzu

One important use case of the Unity Catalog extension is to facilitate seamless data transfer from tables in Unity Catalog to Kuzu.

First, create a `numbers` table in Kuzu with the same schema as the one defined in the Unity Catalog.

```cypher
CREATE NODE TABLE numbers (id INT32 PRIMARY KEY, score DOUBLE);
```

Then, copy the data from the external Unity Catalog table to the Kuzu table.

```sql
 copy numbers from unity.numbers;
```

You can also use a subquery to copy only a subset of the columns:
```sql
COPY numbers FROM (LOAD FROM unity.numbers RETURN score);
```

You can verify that the data has been copied successfully:

```cypher
MATCH (n:numbers) RETURN n.*;
```

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

### Detaching a Unity Catalog

```sql
DETACH unity;
```
