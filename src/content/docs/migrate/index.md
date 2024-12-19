---
title: Migrate your database
---

You can migrate databases between different versions of Kùzu without manually writing DDL and COPY statements.
To perform a migration, you would first export the database from an existing Kùzu version using the command `EXPORT DATABASE`.
Then, you would import this database into another Kùzu version using `IMPORT DATABASE`.

## Export database

The `EXPORT DATABASE` command exports all the contents of a Kùzu database to the specified directory.
The command generates the following files under the `/path/to/export` directory, which
are needed to be able to import this database to a new Kùzu version:  
- `schema.cypher`: Contains the definitions of all node and edge tables.
- `macro.cypher`: Includes the definitions of all macro functions.
- `copy.cypher`: Contains `COPY FROM` statements for reimporting data.
- `Data files`: These files contain the actual database data (in CSV or Parquet format).

The parameters for `EXPORT DATABASE` are the same as those used
when running [`COPY TO`](https://docs.kuzudb.com/export/csv) statements. Here's an example of how to export a database
using the CSV format for data files.

```cypher
EXPORT DATABASE '/path/to/export' (format="csv", header=true);
```

The `format` parameter can be either be `csv` or `parquet`and if it is omitted, by default, it is set to `csv`. 
When `format` is `csv`, you can provide an additional parameter, `header=true`, to specify that the header
should be included in the CSV file.

For more compact storage, you can export the data files in Parquet format as follows:

```cypher
EXPORT DATABASE '/path/to/export' (format="parquet");
```

:::note[Note]
The `EXPORT DATABASE` command only export indexes whose dependent extensions have been loaded.
:::

## Import database

The `IMPORT DATABASE` command imports the contents of the database from a specific directory to which
a Kùzu database was exported to using `EXPORT DATABASE` command. Under the hood, this command uses the
Cypher and data files that were created by the `EXPORT DATABASE` command to recreate the necessary databases
and tables in the new Kùzu version you are migrating to.

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
