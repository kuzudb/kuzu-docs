# Launching KùzuExplorer
KùzuExplorer is a web application that is launched from a deployed Docker image. 
Ensure that you have Docker installed before proceeding.
Below we show 3 different ways to launch KùzuExplorer. Each of these options make 
KùzuExplorer accessible on http://localhost:8000.

### Option 1: Using an existing database

To access an existing Kùzu database, you can mount its path to the `/database` directory as follows.

```bash
docker run -p 8000:8000 \
           -v /absolute/path/to/database:/database \
           --rm kuzudb/kuzu-ui:latest
```

The `--rm` flag tells docker that the container should automatically be removed after we close docker. 

### Option 2: Start with an empty database with example data

You can also launch KùzuExplorer without specifying an existing database. KùzuExplorer comes with 
bundled datasets that you can use to explore the basic functionalities of Kùzu.
This is simply done by removing the `-v` flag in the example above. If no database path is specified
with `-v`,  the server will be started with an empty database.

```bash
docker run -p 8000:8000 --rm kuzudb/kuzu-ui:latest
```
Click on the `Datasets` tab on the top right corner and you can then load one of the bundled dataset 
of your choice into Kùzu and use KùzuExplorer to explore it.

### Option 3: Empty database with custom data

Alternatively, directories containing node and edge data files, in formats such as `.parquet`, `.csv`, and `.npy` 
can be mounted to the `/data` directory as follows:

```bash
docker run -p 8000:8000 \
           -v /absolute/path/to/data/files:/data \
           --rm kuzudb/kuzu-ui:latest
```

With this approach, the data files can be accessed inside the web application to load yourself into Kùzu via Cypher.
