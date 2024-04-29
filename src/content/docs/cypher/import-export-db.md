---
title: Migrating databases
---

You can migrate databases between different versions without manually writing DDL and COPY statements.
Note that because the storage layer of Kùzu can change between versions, the import/export is not
guaranteed to be compatible between versions of Kùzu that are very far apart.

## Export database

The `EXPORT DATABASE` command allows you to export the contents of the database to a specific directory.
The query below exports the database to an absolute directory named `/path/to/export`, utilizing the same configuration parameters as `COPY FROM` statements.
```cypher
EXPORT DATABASE '/path/to/export' (HEADER=true);
```

The `EXPORT DATABASE` command generates three Cypher files and a series of data files in the user-defined directory.
- `schema.cypher`: Contains the definitions of all node and edge tables.
- `macro.cypher`: Includes the definitions of all macro functions.
- `copy.cypher`: Contains `COPY FROM` statements for reimporting data.
- `Data files`: These files contain the actual database data and are in CSV (by default) or Parquet format.

## Import database

The `IMPORT DATABASE` command allows you to import the contents of the database from a specific directory.
The query below imports the database from a directory named `/path/to/export`.
```cypher
IMPORT DATABASE '/path/to/export';
```

:::caution[Note]
The `IMPORT DATABASE` command can only be executed on an empty database.
Currently, automatic rollback in case of failure is not supported. Therefore, if the `IMPORT DATABASE` command fails, you will need to delete the database directory and reload it again.
:::
