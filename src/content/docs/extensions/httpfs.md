---
title: HTTP File System (httpfs)
---

The `httpfs` extension extends the Kuzu file system by allowing reading from/writing to files hosted on
remote file systems. The following remote file systems are supported:

- Plain HTTP(S)
- Object storage via the AWS S3 API
- Object storage via the Google Cloud Storage (GCS) API

Over plain HTTP(S), the extension only supports reading files.
When using object storage via the S3 or GCS API, the extension supports reading, writing and globbing files.
See the subsections below for more details.

## Usage

`httpfs` is an official extension developed and maintained by Kuzu.
It can be installed and loaded using the following commands:

```sql
INSTALL httpfs;
LOAD httpfs;
```

## HTTP(S) file system
`httpfs` allows you to read from a file hosted on a http(s) server in the same way as from a local file.
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

#### Improve performance via caching

Scanning the same file multiple times can be slow and redundant.
To avoid this, you can locally cache remote files to improve performance for repeated scans.
See the [Local cache](#local-cache) section for more details.

## AWS S3 file system
The extension also allows users to read/write/glob files hosted on object storage servers using the S3 API.
Before reading and writing from S3, you have to configure your AWS credentials using the [CALL](https://kuzudb.com/docusaurus/cypher/configuration) statement.

The following options are supported:

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

### Environment Variables

You can set the necessary AWS configuration parameters through environment variables:
Supported environments are:

| Setting | System environment variable |
|----------|----------|
| S3 key ID | S3_ACCESS_KEY_ID |
| S3 secret key | S3_SECRET_ACCESS_KEY |
| S3 endpoint | S3_ENDPOINT |
| S3 region | S3_REGION |
| S3 url style | S3_URL_STYLE |

### Scan data from S3
Scanning from S3 is as simple as scanning from regular files:

```sql
LOAD FROM 's3://kuzu-datasets/follows.parquet'
RETURN *;
```

### Glob data from S3

Globbing is implemented using the S3 [ListObjectV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html)
API, and allows you to glob files as they would in their local filesystem.

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
COPY tableOfTypes FROM "s3://kuzu-datasets/types/types_50k_*.parquet"
```

### Write data to S3

Writing to S3 uses the AWS [multipart upload API](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html).

```sql
COPY (
    MATCH (p:Location)
    RETURN p.*
)
TO 's3://kuzu-datasets/saved/location.parquet'
```

### Additional configurations

#### Requirements on the S3 server API

S3 offers a standard set of APIs for read and write operations. The `httpfs` extension uses these APIs to communicate with remote storage services and thus should also work
with other services that are compatible with the S3 API (such as [Cloudflare R2](https://www.cloudflare.com/en-gb/developer-platform/r2/)).

The table below shows which parts of the S3 API are needed for each feature of the extension to work.

| Feature | Required S3 API |
|----------|----------|
| Public file reads | HTTP Range request |
| Private file reads | Secret key authentication|
| File glob | [ListObjectV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html) |
| File writes | [Multipart upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) |


#### Improve performance via caching

Scanning the same file multiple times can be slow and redundant.
To avoid this, you can locally cache remote files to improve performance for repeated scans.
See the [Local cache](#local-cache) section for more details.

## GCS file system

This section shows how to scan from/write to files hosted on Google Cloud Storage.

Before reading and writing from private GCS buckets, you will need to configure Kuzu with your Google Cloud credentials. You can do this by configuring the following options with the [CALL](https://kuzudb.com/docusaurus/cypher/configuration) statement:

| Option name | Description |
|----------|----------|
| `gcs_access_key_id` | GCS access key id |
| `gcs_secret_access_key` | GCS secret access key |

For example to set the access key id, you would run

```sql
CALL gcs_access_key_id=${access_key_id};
```

### Environment Variables

Another way is to provide the credentials is through environment variables:

| Setting | System environment variable |
|----------|----------|
| GCS access key ID | `GCS_ACCESS_KEY_ID` |
| GCS secret access key | `GCS_SECRET_ACCESS_KEY` |

#### Additional configurations

Since Kuzu communicates with GCS using its [interoperability mode](https://cloud.google.com/storage/docs/aws-simple-migration), the following S3 settings also apply when uploading files to GCS. More detailed descriptions of the settings can be found [here](#aws-s3-file-system).

| Option name |
|----------|
| `s3_uploader_max_num_parts_per_file` |
| `s3_uploader_max_filesize` |
| `s3_uploader_threads_limit` |

### Scan data from GCS

Files in GCS can be accessed through URLs with the formats

- `gs://⟨gcs_bucket⟩/⟨path_to_file_in_bucket⟩`
- `gcs://⟨gcs_bucket⟩/⟨path_to_file_in_bucket⟩`

For example, if you wish to scan the file `follows.parquet` located in the root directory of bucket `kuzu-datasets` you could use the following query:

```sql
LOAD FROM 'gs://kuzu-datasets/follows.parquet'
RETURN *;
```

### Glob data from GCS

You can glob data from GCS just as you would from a local file system.

For example, if the following files are in the bucket `tinysnb`:

```
gs://tinysnb/vPerson.csv
gs://tinysnb/vPerson2.csv
```

The following query will copy the contents of both `vPerson.csv` and `vPerson2.csv` into the table `person`:

```sql
COPY person FROM "gs://tinysnb/vPerson*.csv"(header=true);
```

### Write data to GCS

You can also write to files in GCS using URLs in the formats
- `gs://⟨gcs_bucket⟩/⟨path_to_file_in_bucket⟩`
- `gcs://⟨gcs_bucket⟩/⟨path_to_file_in_bucket⟩`

For example, the following query will write to the file located at path `saved/location.parquet` in the bucket `kuzu-datasets`:

```sql
COPY (
    MATCH (p:Location)
    RETURN p.*
)
TO 'gcs://kuzu-datasets/saved/location.parquet'
```

#### Improve performance via caching

Scanning the same file multiple times can be slow and redundant.
To avoid this, you can locally cache remote files to improve performance for repeated scans.
See the [Local cache](#local-cache) section for more details.

---

## Local cache

Remote file system calls can be expensive and highly dependent on your network conditions (bandwidth, latency).
Queries involving a large number of file operations (read, write, glob) can be slow.
To expedite such queries, we introduce a new option: `HTTP_CACHE_FILE`.
A local file cache is initialized when Kuzu requests the file for the first time.
Subsequent remote file operations will be translated as local file operation on the cache file.
For example the below `CALL` statement enables the local cache for remote files:
```sql
CALL HTTP_CACHE_FILE=TRUE;
```
:::note[Tip]
Cached files are visible per transaction. Therefore, if you have
set `HTTP_CACHE_FILE=TRUE` and then run a `LOAD FROM` statement on a remote file, say
`LOAD FROM "https://example.com/city.csv RETURN *;"`, then this file will be downloaded first
and then scanned locally from the downloaded file. If you run the same `LOAD FROM` statement again,
it will be downloaded again from the remote URL. This is because the second statement is executed as a separate
transaction and we do not know if the already downloaded remote file has changed since the last time Kuzu
downloaded it.
:::

If you need to scan the same remote file multiple times and benefit from caching across multiple scans,
you can run all the `LOAD FROM` statements in the same transaction. Here is an example:

```sql
BEGIN TRANSACTION;
LOAD FROM "https://example.com/city.csv" RETURN *;
LOAD FROM "https://example.com/city.csv" RETURN *;
COMMIT;
```
Now the second `LOAD FROM` statement will run much faster because the file is already downloaded and cached and
the second scan is within the same transaction as the first one.
