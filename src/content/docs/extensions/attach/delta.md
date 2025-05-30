---
title: "Delta Lake"
---

## Usage

The `delta` extension adds support for scanning/copying from the [`Delta Lake open-source storage format`](https://delta.io/).
Delta Lake is an open-source storage framework that enables building a format agnostic Lakehouse architecture.
Using this extension, you can interact with Delta tables from within Kuzu using the `LOAD FROM` and `COPY FROM` clauses.

The Delta functionality is not available by default, so you would first need to install the `DELTA`
extension by running the following commands:

```sql
INSTALL DELTA;
LOAD DELTA;
```

### Example dataset

Let's look at an example dataset to demonstrate how the Delta extension can be used.
Firstly, let's create a Delta table containing student information using Python and save the Delta table in the `'/tmp/student'` directory:
Before running the script, make sure the `deltalake` Python package is properly installed (we will also use Pandas).
```shell
pip install deltalake pandas
```

```python
# create_delta_table.py
import pandas as pd
from deltalake import DeltaTable, write_deltalake

student = {
    "name": ["Alice", "Bob", "Carol"],
    "ID": [0, 3, 7]
}

write_deltalake(f"/tmp/student", pd.DataFrame.from_dict(student))
```

In the following sections, we will first scan the Delta table to query its contents in Cypher, and
then proceed to copy the data and construct a node table.

### Scan the Delta table
`LOAD FROM` is a Cypher clause that scans a file or object element by element, but doesn’t actually
move the data into a Kuzu table.

To scan the Delta table created above, you can do the following:

```cypher
LOAD FROM '/tmp/student' (file_format='delta') RETURN *;
```
```
┌────────┬───────┐
│ name   │ ID    │
│ STRING │ INT64 │
├────────┼───────┤
│ Alice  │ 0     │
│ Bob    │ 3     │
│ Carol  │ 7     │
└────────┴───────┘
```
:::note[Note]
Note: The `file_format` parameter is used to explicitly specify the file format of the given file instead of letting Kuzu autodetect the file format at runtime.
When scanning from the Delta table, `file_format` option must be provided since Kuzu is not capable of autodetecting Delta tables.
:::

### Copy the Delta table into a node table
You can then use a `COPY FROM` statement to directly copy the contents of the Delta table into a Kuzu node table.

```cypher
CREATE NODE TABLE student (name STRING, ID INT64, PRIMARY KEY(ID));
COPY student FROM '/tmp/student' (file_format='delta')
```

Just like above in `LOAD FROM`, the `file_format` parameter is mandatory when specifying the `COPY FROM` clause as well.

```cypher
// First, create the node table
CREATE NODE TABLE student (name STRING, ID INT64, PRIMARY KEY(ID));
```
```
┌─────────────────────────────────┐
│ result                          │
│ STRING                          │
├─────────────────────────────────┤
│ Table student has been created. │
└─────────────────────────────────┘
```
```cypher
COPY student FROM '/tmp/student' (file_format='delta');
```
```
┌─────────────────────────────────────────────────┐
│ result                                          │
│ STRING                                          │
├─────────────────────────────────────────────────┤
│ 3 tuples have been copied to the student table. │
└─────────────────────────────────────────────────┘
```

### Access Delta tables hosted on S3
Kuzu also supports scanning/copying a Delta table hosted on S3 in the same way as from a local file system.
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

#### Scan Delta table from S3
Reading or scanning a Delta table that's on S3 is as simple as reading from regular files:

```sql
LOAD FROM 's3://kuzu-sample/sample-delta' (file_format='delta')
RETURN *
```

#### Copy Delta table hosted on S3 into a local node table

Copying from Delta tables on S3 is also as simple as copying from regular files:

```cypher
CREATE NODE TABLE student (name STRING, ID INT64, PRIMARY KEY(ID));
COPY student FROM 's3://kuzu-sample/student-delta' (file_format='delta')
```

## Limitations

When using the Delta Lake extension in Kuzu, keep the following limitations in mind.

- Writing (i.e., exporting to) Delta files from Kuzu is currently not supported.

