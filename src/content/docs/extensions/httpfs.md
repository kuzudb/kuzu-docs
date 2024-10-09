---
title: HTTP File System (httpfs)
---

The `httpfs` extension extends the Kùzu file system by allowing reading from/writing to files hosted on
remote file systems. Over plain HTTP(S), the extension only supports reading files.
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

```sql
LOAD FROM "https://extension.kuzudb.com/dataset/test/city.csv" 
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
| Private file reads | Secret key authentication|
| File glob | ListObjectV2 |
| File writes | Multipart upload |

## Reading from S3:
Reading from S3 is as simple as reading from regular files:

```sql
LOAD FROM 's3://kuzu-test/follows.parquet'
RETURN *;
```

## Glob

Globbing is implemented using the S3 [ListObjectV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html)
API, and allows the user to glob files as they would in their local filesystem.

```sql
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

```sql
COPY (
    MATCH (p:Location)
    RETURN p.*
)
TO 's3://kuzu-dataset-us/output/location.parquet'
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

## Local cache for remote files
Remote file system calls can be expensive and highly dependent on the user's network conditions (bandwidth, latency). 
Queries involving a large number of file operations (read, write, glob) can be slow. 
To expedite such queries, we introduce a new option: `HTTP_CACHE_FILE`.
A local file cache is initialized when Kùzu requests the file for the first time. 
Subsequent remote file operations will be translated as local file operation on the cache file.
For example the below `CALL` statement enables the local cache for remote files:
```sql
CALL HTTP_CACHE_FILE=TRUE;
```
:::note[Tip]
Cached files are visible per transaction. Therefore, if you have
set `HTTP_CACHE_FILE=TRUE` and then run a `LOAD FROM` statement on a remote file, say
`LOAD FROM "https://.../test/city.csv RETURN *;"`, then this file will be downloaded first
and then scanned locally from the downloaded file. If you run the same `LOAD FROM` statement again,
it will be downloaded again from the remote URL. This is because the second statement is executed as a separate 
transaction and we do not know if the already downloaded remote file has changed since the last time Kùzu
downloaded it. 

If you need to scan the same remote file multiple times and benefit from caching across multiple scans,
you can run all the `LOAD FROM` statements in the same transaction. Here is an example:

```sql
BEGIN TRANSACTION;
LOAD FROM "https://.../test/city.csv" RETURN *;
LOAD FROM "https://.../test/city.csv" RETURN *;
COMMIT;
```
Now the second `LOAD FROM` statement will run much faster because the file is already downloaded and cached and
the second scan is within the same transaction as the first one.
:::
