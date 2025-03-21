---
title: Migrate your database
---

You can migrate databases between different versions of Kuzu without manually writing DDL and COPY statements.
To perform a migration, you would first export the database from an existing Kuzu version using the command `EXPORT DATABASE`.
Then, you would import this database into another Kuzu version using `IMPORT DATABASE`.

## Export database

The `EXPORT DATABASE` command exports all the contents of a Kuzu database to the specified directory.
The command generates the following files under the `/path/to/export` directory, which
are needed to be able to import this database to a new Kuzu version:  
- `schema.cypher`: Contains the definitions of all node and edge tables.
- `macro.cypher`: Includes the definitions of all macro functions.
- `copy.cypher`: Contains `COPY FROM` statements for reimporting data.
- `Data files`: These files contain the actual database data (in CSV or Parquet format).

The parameters for `EXPORT DATABASE` are the same as those used
when running [`COPY TO`](https://docs.kuzudb.com/export/) statements. The example below shows how to export a database using default configurations.
```cypher
EXPORT DATABASE '/path/to/export'
```
The default behaviour is to export the data tables to Parquet format. This is done to reduce scope of formatting errors and to improve performance. You can use the `format` parameter to output to other formats, for e.g. CSV.
The `format` parameter can either be `csv` or `parquet`.

Here's an example of how to export a database
using the CSV format for data files.

```cypher
EXPORT DATABASE '/path/to/export' (format="csv", header=true);
```

:::note[Note]
The `EXPORT DATABASE` command only export indexes whose dependent extensions have been loaded.
:::

## Import database

The `IMPORT DATABASE` command imports the contents of the database from a specific directory to which
a Kuzu database was exported to using `EXPORT DATABASE` command. Under the hood, this command uses the
Cypher and data files that were created by the `EXPORT DATABASE` command to recreate the necessary databases
and tables in the new Kuzu version you are migrating to.

The query below imports the database from a directory named `/path/to/export` to
the current database directory that your session points to:
```cypher
IMPORT DATABASE '/path/to/export';
```

:::note[Note]
1. The `IMPORT DATABASE` command can only be executed on an empty database.
Currently, in case of a failure during the execution of the `IMPORT DATABASE` command,
automatic rollback is not supported. Therefore, if the `IMPORT DATABASE` command fails, you will need to delete the 
database directory you are connected to and reload it again.
2. The `IMPORT DATABASE` command also imports all indexes, regardless of whether their dependent extensions were loaded during import. If the dependent extension was not loaded during import, it will be automatically loaded during import.
:::
