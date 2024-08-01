---
title: HTTP File System (httpfs)
---

The `httpfs` extension extends the Kùzu file system by allowing reading from/writing to files hosted on
remote file systems. Over plain HTTP(S) the extension only supports reading files.
When using object storage via the S3 API, the extension supports reading, writing and globbing files.

# Usage

`httpfs` is an official extension developed and maintained by Kùzu.
It can be installed and loaded using the following commands:

```sql
INSTALL httpfs;
LOAD EXTENSION httpfs;
```

## HTTP(S) file system
`httpfs` allows users to read from a file hosted on a http(s) server in the same way as from a local file.
Example:

```cypher
LOAD FROM "https://raw.githubusercontent.com/kuzudb/extension/main/dataset/test/city.csv" 
RETURN *;
```

Result:

```
Waterloo|150000
Kitchener|200000
Guelph|75000
```

## S3 file system
The extension also allows users to read/write/glob files hosted on object storage servers using the S3 API.

### S3 file system configuration
Before reading and writing from S3, users have to configure using the [CALL](https://kuzudb.com/docusaurus/cypher/configuration) statement.

Supported options:

| Option name | Description |
|----------|----------|
| `s3_access_key_id` | S3 access key id |
| `s3_secret_access_key` | S3 secret access key |
| `s3_endpoint` | S3 endpoint |
| `s3_url_style` | Uses [S3 url style](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html) (should either be vhost or path) |
| `s3_region` | S3 region |
| `s3_uploader_max_num_parts_per_file` | Used for [part size calculation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) |
| `s3_uploader_max_filesize` | Used for [part size calculation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) |
| `s3_uploader_threads_limit` | Maximum number of uploader threads |

## Requirements on the S3 server API

| Feature | Required S3 API features |
|----------|----------|
| Public file reads | HTTP Range request |
| Private file reads | secret key authentication|
| File glob | ListObjectV2 |
| File writes | Multipart upload |

## Reading from S3:
Reading from S3 is as simple as reading from regular files:

```cypher
LOAD FROM 's3://kuzu-test/follows.parquet'
RETURN *;
```

## Glob

Globbing is implemented using the S3 [ListObjectV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html)
API, and allows the user to glob files as they would in their local filesystem.

```cypher
CREATE NODE TABLE tableOfTypes (
    id INT64,
    int64Column INT64,
    doubleColumn DOUBLE,
    booleanColumn BOOLEAN,
    dateColumn DATE,
    stringColumn STRING,
    listOfInt64 INT64[],
    listOfString STRING[],
    listOfListOfInt64 INT64[][],
    structColumn STRUCT(ID int64, name STRING),
    PRIMARY KEY (id));
COPY tableOfTypes FROM "s3://kuzu-dataset-us/glob-test/types_50k_*.parquet"
```

## Uploading to S3

Writing to S3 uses the AWS [multipart upload API](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html).

```cypher
COPY (
    MATCH (p:Location) RETURN p.*
) TO 's3://kuzu-dataset-us/output/location.parquet'
```

## AWS credential management

Users can set configuration parameters through environment variables:
Supported environments are:

| Setting | System environment variable |
|----------|----------|
| AWS S3 key ID | S3_ACCESS_KEY_ID |
| AWS S3 secret key | S3_SECRET_ACCESS_KEY |
| AWS S3 default endpoint | S3_ENDPOINT |
| AWS S3 default region | S3_REGION |

## ATTACH remote kuzu database
The HTTP filesystem also allows you to attach a remote (S3, HTTPS) hosted Kùzu database.
```sql
ATTACH [DB_PATH] AS [alias] (dbtype kuzu)
```

- `DB_PATH`: Path to the remote filesystem (can either be a S3 or HTTP URL)
- `alias`: Database alias to use - If not provided, the database name from Kùzu will be used.
  When attaching multiple databases, it's recommended to use aliasing.

The below example shows how the `university.db` kuzu database hosted on S3 can be attached to Kùzu using
the alias `uw`:

```sql
ATTACH 's3://kuzu-example/university' AS uw (dbtype kuzu);
```
:::danger[Note]
After attaching a remote Kùzu database, users no longer have access to the original local Kùzu database. The default database is
switched to the attached remote kuzu database right after the `attach` statement and users can only query the remote kuzu database.
:::
#### Execute queries on remote kuzu database.
Note: We only allow read-only queries to execute on remote Kùzu database (no writes).
```sql
MATCH (p:person) RETURN p.*
```

Result:

```
---------------
| name  | age |
---------------
| Alice | 30  |
---------------
| Bob   | 27  |
---------------
| Carol | 19  |
---------------
| Dan   | 25  |
---------------
```

### Local cache for remote files
Remote file system calls can be expensive and highly dependent on the user's network (bandwidth, latency, etc.). Queries that involve large number of file operations (read, write, glob) can be slow. To expedite such queries, we introduce a new caching option: `HTTP_CACHE_FILE`.
A local file cache is initialized when Kùzu requests the file for the first time. Subsequence remote file operations will then be treated as local file operations on the cache file.
Example:
```
CALL HTTP_CACHE_FILE=TRUE;
```
Enables the local cache for remote files.
