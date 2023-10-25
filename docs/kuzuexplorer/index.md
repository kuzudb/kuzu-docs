import DatasetsPanel from './datasets-panel.png';
import DocCardList from '@theme/DocCardList';

# KùzuExplorer

## Overview

KùzuExplorer is Kùzu's browser-based frontend to visualize and explore database schemas
and query results in the form of a graph, table, or in json. This is a very useful tool for exploring
databases and debugging applications during prototyping phase. These documentation pages describes the
different panels in KùzuExplorer. Here, we first explain how to launch KùzuExplorer.

## Launching KùzuExplorer

KùzuExplorer is a web application that is launched from a deployed Docker image.
Please refer to the [Docker documentation](https://docs.docker.com/get-docker/) for details on how to install and use Docker.

Below we show two different ways to launch KùzuExplorer. Each of these options make
KùzuExplorer accessible on [http://localhost:8000](http://localhost:8000). If the launching is successful, you should see the logs similar to the following in your shell:

```
Access mode: READ_WRITE
Version of Kùzu: v0.0.11
Deployed server started on port: 8000
```

### Option 1: Using an existing database

To access an existing Kùzu database, you can mount its path to the `/database` directory as follows:

```bash
docker run -p 8000:8000 \
           -v /absolute/path/to/database:/database \
           --rm kuzudb/explorer:latest
```

By mounting local database files to Docker via `-v /absolute/path/to/database:/database`,
the changes done in the UI will persist to the local database files after the UI is shutdown.

The `--rm` flag tells docker that the container should automatically be removed after we close docker.

### Option 2: Start with an empty database with example data

You can also launch KùzuExplorer without specifying an existing database. KùzuExplorer comes with
bundled datasets that you can use to explore the basic functionalities of Kùzu.
This is simply done by removing the `-v` flag in the example above. If no database path is specified
with `-v`, the server will be started with an empty database.

```bash
docker run -p 8000:8000 --rm kuzudb/explorer:latest
```

Click on the `Datasets` tab on the top right corner and then: (i) you can select one of the bundled dataset
of your choice from the drow-down menu; (ii) load it into Kùzu by clicking the "Load Dataset" button; and (iii)
finally use KùzuExplorer to explore it.

<img src={DatasetsPanel} />

### Additional launch configurations

#### Access mode

By default, KùzuExplorer is launched in read-write mode, which means that you can modify the database. If you want to launch KùzuExplorer in read-only mode, you can do so by setting the `MODE` environment variable to `READ_ONLY` as follows.

```bash
docker run -p 8000:8000 \
           -v /absolute/path/to/database:/database \
           -e MODE=READ_ONLY \
           --rm kuzudb/explorer:latest
```

In read-only mode, you can still issue read queries and visualize the results, but you cannot run write queries or modify the schema.

#### Buffer pool size

By default, KùzuExplorer is launched with a maximum buffer pool size of 80% of the available memory. If you want to launch KùzuExplorer with a different buffer pool size, you can do so by setting the `KUZU_BUFFER_POOL_SIZE` environment variable to the desired value in bytes as follows.

For example, to launch KùzuExplorer with a buffer pool size of 1GB, you can run the following command.

```bash
docker run -p 8000:8000 \
           -v /absolute/path/to/database:/database \
           -e KUZU_BUFFER_POOL_SIZE=1073741824 \
           --rm kuzudb/explorer:latest
```

#### Accessing data files in the container

As mentioned above, KùzuExplorer is launched from a Docker image. If you want to access the data files in the container, you can do so by mounting a directory on your host machine as follows:

```bash
docker run -p 8000:8000 \
           -v /absolute/path/to/database:/database \
           -v /absolute/path/to/data:/data \
           --rm kuzudb/explorer:latest
```

With this configuration, the data directory you specify on your host machine will be accessible as `/data` in the container. For example, in the shell panel, you can copy a CSV file into your database by running the following command:

```cypher
COPY Test FROM "test.csv" (HEADER=true);
```

Note that it is possible to mount multiple directories in the container. For more details, please refer to the [Docker documentation](https://docs.docker.com/storage/bind-mounts/).

## KùzuExplorer Panels

KùzuExplorer has 3 panels: (i) the `Shell` panel, (ii) the `Schema` panel, (iii) the `Settings` panel. For each of these panels, we provide a brief description. Please refer to the corresponding documentation pages below for more details.

<DocCardList />
