---
title: Database
sidebar_position: 0
---

<a id="database.Database"></a>

## Database
The database class is used to create and manage the Kùzu database instance.

```python
class Database()
```

### Available APIs:
* [\_\_init\_\_](#database.Database.__init__)
* [set\_logging\_level](#database.Database.set_logging_level) Set the logging level.
* [get\_torch\_geometric\_remote\_backend](#database.Database.get_torch_geometric_remote_backend) Use the database as the remote backend for torch_geometric. 

----

<a id="database.Database.__init__"></a>

**\_\_init\_\_**

```python
def __init__(database_path, buffer_pool_size)
```

**Parameters**
- `database_path : _kuzu.Database` The path to database files

- `buffer_pool_size : int` The maximum size of buffer pool in bytes (Optional). Default to 80% of system memory.

-------

<a id="database.Database.set_logging_level"></a>

**set\_logging\_level**

```python
def set_logging_level(level)
```

Set the logging level.

**Parameters**
- `level : str` Logging level. One of "debug", "info", "err".

-------

<a id="database.Database.get_torch_geometric_remote_backend"></a>

**get\_torch\_geometric\_remote\_backend**

```python
def get_torch_geometric_remote_backend(num_threads=None):
```

Use the database as the remote backend for torch_geometric. 

For the interface of the remote backend, please refer to 
[https://pytorch-geometric.readthedocs.io/en/latest/advanced/remote.html](https://pytorch-geometric.readthedocs.io/en/latest/advanced/remote.html).
The current implementation is read-only and does not support edge features. The IDs of the nodes are based on the internal IDs (i.e., node offsets). For the remote node IDs to be consistent with the positions in the output tensors, please ensure that no deletion has been performed on the node tables. 

The remote backend can also be plugged into the data loader of torch_geometric, which is useful for mini-batch training. For example:

```python
    loader_kuzu = NeighborLoader(
        data=(feature_store, graph_store),
        num_neighbors={('paper', 'cites', 'paper'): [12, 12, 12]},
        batch_size=LOADER_BATCH_SIZE,
        input_nodes=('paper', input_nodes),
        num_workers=4,
        filter_per_worker=False,
    )
```
        
Please note that the database instance is not fork-safe, so if more than one worker is used, `filter_per_worker` must be set to `False`.

**Parameters**
- `num_threads : int` Number of threads to use for data loading. Default to None, which means using the number of CPU cores.

**Returns**
- `feature_store` Feature store compatible with torch_geometric.
- `graph_store` Graph store compatible with torch_geometric.
