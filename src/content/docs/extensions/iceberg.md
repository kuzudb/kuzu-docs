---
title: "Iceberg"
---

The `iceberg` extension adds support for scanning and copying from the [Apache Iceberg format](https://iceberg.apache.org/).
Iceberg is an open-source table format originally developed at Netflix for large-scale analytical datasets.
Using this extension, you can interact with Iceberg tables from within Kùzu using the `LOAD FROM` and `COPY FROM` clauses.

The Iceberg functionality is not available by default, so you would first need to install the `iceberg`
extension by running the following commands:

```sql
INSTALL iceberg;
LOAD EXTENSION iceberg;
```

At a high level, the `iceberg` extension provides the following functionality:

- Scanning an Iceberg table
- Copying an Iceberg table into a node table
- Accessing the Iceberg metadata
- Listing the Iceberg snapshots

## Usage

To run the examples below, download the [iceberg_tables.zip](https://kuzudb.com/data/iceberg-extension/iceberg_tables.zip) file, unzip it
and place the contents in the `/tmp` directory.

### Scan the Iceberg table

`LOAD FROM` is a Cypher query that scans a file or object element by element, but doesn’t actually
move the data into a Kùzu table.

Here's how you would scan an Iceberg table:

```cypher
LOAD FROM '/tmp/iceberg_tables/university' (file_format='iceberg', allow_moved_paths=true) RETURN *;
```
```
┌────────────┬──────┬──────────┐
| University | Rank | Funding  |
├────────────┼──────┼──────────┤
| Stanford   | 2    | 250.300  |
| Yale       | 6    | 190.700  |
| Harvard    | 1    | 210.500  |
| Cambridge  | 5    | 280.200  |
| MIT        | 3    | 170.000  |
| Oxford     | 4    | 300.000  |
└────────────┴──────┴──────────┘
```

:::note[Notes]
- The `file_format` parameter is used to explicitly specify the file format of the given file instead of
letting Kùzu autodetect the file format at runtime. When scanning from the Iceberg table,
the `file_format` option must be provided since Kùzu is not capable of autodetecting Iceberg tables.
- The `allow_moved_paths` option ensures that proper path resolution is performed, which allows scanning
Iceberg tables that are moved from their original location.
:::

### Copy the Iceberg table into a node table
You can then use a `COPY FROM` statement to directly copy the contents of the Iceberg table into a node table.

```cypher
CREATE NODE TABLE university (name STRING, age INT64, PRIMARY KEY(age));
COPY student FROM '/tmp/iceberg_tables/person_table' (file_format='iceberg', allow_moved_paths=true)
```

Just like above in `LOAD FROM`, the `file_format` parameter is mandatory when specifying the `COPY FROM` clause as well.

Result:
```cypher
// Create the node table
CREATE NODE TABLE university (name STRING, rank INT64, fund double, PRIMARY KEY(name));
```
```
┌─────────────────────────────────────┐
│ result                              │
│ STRING                              │
├─────────────────────────────────────┤
│ Table university has been created.  │
└─────────────────────────────────────┘
```
```cypher
COPY university FROM '/tmp/iceberg_tables/university' (file_format='iceberg', allow_moved_paths=true);
```
```
┌─────────────────────────────────────────────────────┐
│ result                                              │
│ STRING                                              │
├─────────────────────────────────────────────────────┤
│ 6 tuples have been copied to the university table.  │
└─────────────────────────────────────────────────────┘
```

### Access Iceberg metadata
At the heart of Iceberg’s table structure is the metadata, which tracks everything from the schema, to partition information
and snapshots of the table's state. This is particularly useful for understanding the underlying structure, tracking data
changes, and debugging issues in Iceberg datasets.

The `ICEBERG_METADATA` function lists the metadata files for an Iceberg table via the `CALL` function in Kùzu.

:::caution[Note]
Ensure you use `:=` operator to set the variable in `CALL` function, not the `=` operator.
The `:=` operator is required within `CALL` functions in Kùzu.
:::

```cypher
CALL ICEBERG_METADATA(
    '/tmp/iceberg_tables/lineitem_iceberg',
    allow_moved_paths := true
)
RETURN *;
```

```
┌──────────────────────────┬──────────────────────────┬──────────────────┬─────────┬──────────┬──────────────────────────┬─────────────┬──────────────┐
│ manifest_path            │ manifest_sequence_number │ manifest_content │ status  │ content  │ file_path                │ file_format │ record_count │
│ STRING                   │ INT64                    │ STRING           │ STRING  │ STRING   │ STRING                   │ STRING      │ INT64        │
├──────────────────────────┼──────────────────────────┼──────────────────┼─────────┼──────────┼──────────────────────────┼─────────────┼──────────────┤
│ lineitem_iceberg/meta... │ 2                        │ DATA             │ ADDED   │ EXISTING │ lineitem_iceberg/data... │ PARQUET     │ 51793        │
│ lineitem_iceberg/meta... │ 2                        │ DATA             │ DELETED │ EXISTING │ lineitem_iceberg/data... │ PARQUET     │ 60175        │
└──────────────────────────┴──────────────────────────┴──────────────────┴─────────┴──────────┴──────────────────────────┴─────────────┴──────────────┘
```

### List Iceberg snapshots
Iceberg tables maintain a series of snapshots, which are consistent views of the table at a specific point in time.
Snapshots are the core of Iceberg’s versioning system, allowing you to track, query, and manage changes to your table over time.

The `ICEBERG_SNAPSHOTS` function lists the snapshots for an Iceberg table via the `CALL` function.
Note that for snapshots, you do not need to specify the `allow_moved_paths` option.

```cypher
CALL ICEBERG_SNAPSHOTS('/tmp/iceberg_tables/lineitem_iceberg') RETURN *;
```

```
┌─────────────────┬─────────────────────┬─────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────┐
│ sequence_number │ snapshot_id         │ timestamp_ms            │ manifest_list                                                                                  │
│ UINT64          │ UINT64              │ TIMESTAMP               │ STRING                                                                                         │
├─────────────────┼─────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1               │ 3776207205136740581 │ 2023-02-15 15:07:54.504 │ lineitem_iceberg/metadata/snap-3776207205136740581-1-cf3d0be5-cf70-453d-ad8f-48fdc412e608.avro │
│ 2               │ 7635660646343998149 │ 2023-02-15 15:08:14.73  │ lineitem_iceberg/metadata/snap-7635660646343998149-1-10eaca8a-1e1c-421e-ad6d-b232e5ee23d3.avro │
└─────────────────┴─────────────────────┴─────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Optional parameters

The following optional parameters are supported in the Iceberg extension:

<div class="scroll-table">

| Parameter                     | Type      | Default      | Description                                                                     |
|-------------------------------|-----------|--------------|---------------------------------------------------------------------------------|
| allow_moved_paths             | BOOLEAN   | `false`        | Allows scanning Iceberg tables that are not located in their original directory |
| metadata_compression_codec    | STRING    | `''`           | Specifies the compression code used for the metadata files (currenly only supports `gzip`)                      |
| version                       | STRING    | `'?'`          | Provides an explicit Iceberg version number, if not provided, the Iceberg version number would be determined from `version-hint.txt`|
| version_name_format           | STRING    | `'v%s%s.metadata.json,%s%s.metadata.json'` | Provides the regular expression to find the correct metadata data file |

</div>

More details on usage are provided below.

#### Select metadata version
By default, the `iceberg` extension will look for a `version-hint.text` file to identify the proper metadata version to use. 
This can be overridden by explicitly supplying a version number via the `version` parameter to Iceberg table functions.

Example:
```cypher
LOAD FROM '/tmp/iceberg_tables/lineitem_iceberg' (
    file_format='iceberg',
    allow_moved_paths=true,
    version='2'
)
RETURN *;
```

#### Change metadata compression codec
By default, this extension will look for both `v{version}.metadata.json` and `{version}.metadata.json` files for metadata, or `v{version}.gz.metadata.json` and `{version}.gz.metadata.json` when `metadata_compression_codec = 'gzip'` is specified. 
Other compression codecs are NOT supported. 

```cypher
LOAD FROM '/tmp/iceberg_tables/lineitem_iceberg_gz' (
    file_format='iceberg',
    allow_moved_paths=true,
    metadata_compression_codec = 'gzip'
)
RETURN *;
```

#### Change metadata name format
To change the metadata naming format, use the `version_name_format` option, for example, if your metadata is named as `rev-2.metadata.json`, set this option as `version_name_format = 'rev-%s.metadata.json` to make sure the metadata file can be found successfully.

```cypher
LOAD FROM '/tmp/iceberg_tables/lineitem_iceberg_alter_name' (
    file_format='iceberg',
    allow_moved_paths=true,
    version_name_format = 'rev-%s.metadata.json'
)
RETURN *;
```

### Access an Iceberg table hosted on S3
Kùzu also supports scanning/copying a Iceberg table hosted on S3 in the same way as from a local file system.
Before reading and writing from S3, you have to configure the connection using the [CALL](https://kuzudb.com/docusaurus/cypher/configuration) statement.

#### Supported options

| Option name | Description |
|----------|----------|
| `s3_access_key_id` | S3 access key id |
| `s3_secret_access_key` | S3 secret access key |
| `s3_endpoint` | S3 endpoint |
| `s3_url_style` | Uses [S3 url style](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html) (should either be vhost or path) |
| `s3_region` | S3 region |


#### Requirements on the S3 server API

| Feature | Required S3 API features |
|----------|----------|
| Public file reads | HTTP Range request |
| Private file reads | Secret key authentication|

#### Scan Iceberg table from S3
Reading or scanning a Iceberg table that's on S3 is as simple as reading from regular files:

```cypher
LOAD FROM 's3://path/to/iceberg_table' (file_format='iceberg', allow_moved_paths=true)
RETURN *
```

#### Copy Iceberg table hosted on S3 into a local node table

Copying from Iceberg tables on S3 is also as simple as copying from regular files:

```cypher
CREATE NODE TABLE student (name STRING, ID INT64, PRIMARY KEY(ID));
COPY student FROM 's3://path/to/iceberg_table' (file_format='iceberg', allow_moved_paths=true)
```

## Limitations

When using the Iceberg extension in Kùzu, keep the following limitations in mind.

<<<<<<< HEAD
- Writing (i.e., exporting to) Iceberg tables from Kùzu is currently not supported.
=======
- Writing (i.e., exporting to) Iceberg tables is currently not supported.
>>>>>>> 6bf35c9 (Add Iceberg Extension Documentation (#314))
- We currently do not support scanning/copying nested data (i.e., of type `STRUCT`) in the Iceberg table columns.
