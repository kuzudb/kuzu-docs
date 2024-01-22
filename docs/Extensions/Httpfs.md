# Overview
The httpfs extension extends Kùzu filesystem by allowing reading from/writing to files hosted on remote file systems. For file hosted on HTTP(s) filesystem, only reading is supported. For object storage using the S3 API, the httpfs extension supports both reading/writing/globbing files.

# Usage
HTTPFS is an official extension developed by the Kùzu team, which means it can be installed and loaded using simple commands.
```
INSTALL httpfs;
LOAD httpfs;
```

# HTTP(S) filesystem
HTTPFS allows users to read from a file hosted on a http(s) server in the same way as from a local file.
Example:

```
# Query:
LOAD FROM "https://raw.githubusercontent.com/kuzudb/extension/main/dataset/test/city.csv" return *;
# Result:
Waterloo|150000
Kitchener|200000
Guelph|75000
```

# S3 filesystem
HTTPFS allows users to read/write/glob files hosted on object storage servers using the S3 API.

Configuration:
Before reading and writing from S3, users have to configure using the [CALL](https://kuzudb.com/docusaurus/cypher/configuration) statement.

Supported options:
| Option name | Description |
|----------|----------|
| s3_access_key_id | S3 access key id |
| s3_secret_access_key | S3 secret access key |
| s3_endpoint | S3 endpoint |
| s3_url_style | [S3 url style](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html) (should either be vhost or path) |
| s3_region | S3 region |
| s3_uploader_max_num_parts_per_file | [used for part size calculation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) |
| s3_uploader_max_filesize | [used for part size calculation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) |
| s3_uploader_threads_limit | maximum number of uploader threads |


# Reading from S3:
Reading from S3 is as simple as reading from regular files:
```
load from 's3://kuzu-test/follows.parquet' return *;
```

# Uploading to S3:
Writing to S3 uses the AWS (multipart upload API)[https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html]
```
copy (match (p:Place) return p.*) to 's3://kuzu-dataset-us/output/place.parquet'
```
