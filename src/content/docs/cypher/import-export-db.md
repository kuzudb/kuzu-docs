---
title: Migrating databases
---

You can migrate databases between different versions without manually writing DDL and COPY statements.
Note that because the storage layer of Kùzu can change between versions, the import/export is not
guaranteed to be compatible between versions of Kùzu that are very far apart.

:::caution[Note]
Currently the `EXPORT/IMPORT DATABASE` commands only export your node and relationship
tables and not your RDFGraphs. You currently need to manually migrate your RDFGraphs
:::

## Export database

The `EXPORT DATABASE` command allows you to export the contents of the database to a specific directory.
The query below exports the database to an absolute directory named `/path/to/export`.
The `EXPORT DATABASE` command generates the following files under the `/path/to/export` directory, which
are needed to be able to import the exported database later using a new Kùzu version:  
- `schema.cypher`: Contains the definitions of all node and edge tables.
- `macro.cypher`: Includes the definitions of all macro functions.
- `copy.cypher`: Contains `COPY FROM` statements for reimporting data.
- `Data files`: These files contain the actual database data and are in CSV (by default) or Parquet format.

Here's an example of how to export a database using the CSV format for data files.
The `format` parameter can be either be "csv" or "parquet"; and if it is omitted by default it is set to "csv". 
When `format` is "csv", you can provide additional parameters configuring the properties of the exported CSV files. These additional
parameters, such as `header=true` below, are the same as the parameters you can use when running [`COPY TO` statements](../export/csv).

```cypher
EXPORT DATABASE '/path/to/export' (format="csv", header=true);
```

Alternatively, you can export the data files in Parquet format using the `format` parameter for more compact storage:

```cypher
EXPORT DATABASE '/path/to/export' (format="parquet");
```


## Import database

The `IMPORT DATABASE` command allows you to import the contents of the database from a specific directory `/path/to/export` to which
a Kùzu database was exported to using `EXPORT DATABASE` command. `IMPORT DATABASE` command uses the
Cypher and data files that was created by the `EXPORT DATABASE` command to recreate the database in the new Kùzu version you
are migrating to.
The query below imports the database from a directory named `/path/to/export` to 
the current directory you have opened your connection to.
```cypher
IMPORT DATABASE '/path/to/export';
```

:::caution[Note]
The `IMPORT DATABASE` command can only be executed on an empty database.
Currently, in case of a failure during the execution of the `IMPORT DATABASE` command,
automatic rollback is not supported. Therefore, if the `IMPORT DATABASE` command fails, you will need to delete the 
database directory you are connected to and reload it again.
:::
