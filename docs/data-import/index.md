# Data Import 
There are many ways to insert data into Kùzu. Before either of these steps, you need to first create a graph schema, i.e., the schema of your node and relationship tables. See the details of how to [define a graph schema here](../cypher/ddl.md). 
  - Cypher's CREATE commands to insert nodes and relationships: These are similar to SQL's INSERT statements and slower than bulk loading through CSV files. For large databases, these should be used to do small updates after an initial CSV uploading. For details, see the documentation on [Cypher's data manipulation clauses](../cypher/data-manipulation-clauses).
  - Loading from CSV: Bulk load a large database from CSV files. For details, see the documentation on [CSV import](csv-import.md).
  - Loading from Parquet: Bulk load a large database from parquet files. For details, see the documentation on [Parquet import](parquet-import.md).
  - Loading from NPY (**Experimental**): Bulk load a large database from npy files. For details, see the documentation on [NPY import](npy-import.md).
