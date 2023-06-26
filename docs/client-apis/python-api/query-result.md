---
title: Query result
sidebar_position: 2
---

<a id="query_result.QueryResult"></a>

## QueryResult
When you issue a query to the database through the `con->execute(query)` API, you are expected to get a queryResult which contains all result tuples for the given query.
We provide variety of APIs for user to fetch the queryResult as their desired format.

```python
class QueryResult()
```

### Available APIs:
-------
* [\_\_init\_\_](#query_result.QueryResult.__init__)
* [check\_for\_query\_result\_close](#query_result.QueryResult.check_for_query_result_close) Check if the query result is closed and raise an exception if it is.
* [has\_next](#query_result.QueryResult.has_next) Check if there are more rows in the query result. 
* [get\_next](#query_result.QueryResult.get_next) Get the next row in the query result.
* [write\_to\_csv](#query_result.QueryResult.write_to_csv) Write the query result to a CSV file.
* [close](#query_result.QueryResult.close) Close the query result.
* [get\_as\_df](#query_result.QueryResult.get_as_df) Get the query result as a Pandas DataFrame.
* [get\_as\_arrow](#query_result.QueryResult.get_as_arrow) Get the query result as a PyArrow Table.
* [get\_column\_data\_types](#query_result.QueryResult.get_column_data_types) Get the data types of the columns in the query result.
* [get\_column\_names](#query_result.QueryResult.get_column_names) Get the names of the columns in the query result.
* [reset\_iterator](#query_result.QueryResult.reset_iterator) Reset the iterator of the query result.
* [get\_as\_networkx](#query_result.QueryResult.get_as_networkx) Converts the nodes and rels in query result into a NetworkX graph representation.
* [get\_as\_torch\_geometric](#query_result.QueryResult.get_as_torch_geometric) Converts the nodes and rels in query result into a PyTorch Geometric graph representation torch_geometric.data.Data or torch_geometric.data.HeteroData.

----

<a id="query_result.QueryResult.__init__"></a>

**\_\_init\_\_**

```python
def __init__(connection, query_result)
```

**Parameters**
- `connection : _kuzu.Connection` Connection to the database.

- `query_result : _kuzu.QueryResult` Query result.

----

<a id="query_result.QueryResult.check_for_query_result_close"></a>

**check\_for\_query\_result\_close**

```python
def check_for_query_result_close()
```

Check if the query result is closed and raise an exception if it is.

**Raises**
- `Exception` If the query result is closed.

----

<a id="query_result.QueryResult.has_next"></a>

**has\_next**

```python
def has_next()
```

Check if there are more rows in the query result.

**Returns**
- `bool` True if there are more rows in the query result, False otherwise.

----

<a id="query_result.QueryResult.get_next"></a>

**get\_next**

```python
def get_next()
```

Get the next row in the query result.

**Returns**
- `list` Next row in the query result.

----

<a id="query_result.QueryResult.write_to_csv"></a>

**write\_to\_csv**

```python
def write_to_csv(filename, delimiter=',', escape_character='"', newline='\n')
```

Write the query result to a CSV file.

**Parameters**
- `filename : str` Name of the CSV file to write to.

- `delimiter : str` Delimiter to use in the CSV file. Defaults to ','.

- `escape_character : str` Escape character to use in the CSV file. Defaults to '"'.

- `newline : str` Newline character to use in the CSV file. Defaults to '\n'.

----

<a id="query_result.QueryResult.close"></a>

**close**

```python
def close()
```

Close the query result.

----

<a id="query_result.QueryResult.get_as_df"></a>

**get\_as\_df**

```python
def get_as_df()
```

Get the query result as a Pandas DataFrame.

**Returns**
- `pandas.DataFrame` Query result as a Pandas DataFrame.

----

<a id="query_result.QueryResult.get_as_arrow"></a>

**get\_as\_arrow**

```python
def get_as_arrow(chunk_size)
```

Get the query result as a PyArrow Table.

**Parameters**
- `chunk_size : int` Number of rows to include in each chunk.

**Returns**
- `pyarrow.Table` Query result as a PyArrow Table.

----

<a id="query_result.QueryResult.get_column_data_types"></a>

**get\_column\_data\_types**

```python
def get_column_data_types()
```

Get the data types of the columns in the query result.

**Returns**
- `list` Data types of the columns in the query result.

----

<a id="query_result.QueryResult.get_column_names"></a>

**get\_column\_names**

```python
def get_column_names()
```

Get the names of the columns in the query result.

**Returns**
- `list` Names of the columns in the query result.

----

<a id="query_result.QueryResult.reset_iterator"></a>

**reset\_iterator**

```python
def reset_iterator()
```

Reset the iterator of the query result.

----

<a id="query_result.QueryResult.get_as_networkx"></a>

**get\_as\_networkx**

```python
def get_as_networkx(directed=True)
```

Convert the nodes and rels in query result into a NetworkX directed or undirected graph
with the following rules:
- Columns with data type other than node or rel will be ignored.
- Duplicated nodes and rels will be converted only once.

**Parameters**
- `directed : bool` Whether the graph should be directed. Defaults to True.

**Returns**
- `networkx.DiGraph or networkx.Graph` Query result as a NetworkX graph.

----

<a id="query_result.QueryResult.get_as_torch_geometric"></a>

**get\_as\_torch\_geometric**

```python
def get_as_torch_geometric()
```

Converts the nodes and rels in query result into a PyTorch Geometric graph representation
torch_geometric.data.Data or torch_geometric.data.HeteroData.

For node conversion, numerical and boolean properties are directly converted into tensor and stored in Data/HeteroData. For properties cannot be converted into tensor automatically (please refer to the notes below for more detail), they are returned as `unconverted_properties`.

For rel conversion, rel is converted into edge_index tensor director. Rel properties are returned as `edge_properties`.

Node properties that cannot be converted into tensor automatically:
- If the type of a node property is not one of INT64, DOUBLE, or BOOL.
- If a node property contains a null value.
- If a node property contains a nested list of variable length (e.g. [[1,2],[3]]).
- If a node property is a list or nested list, but the shape is inconsistent (e.g. the list length is 6 for one node but 5 for another node).

Additional conversion rules:
- Columns with data type other than node or rel will be ignored.
- Duplicated nodes and rels will be converted only once.

**Returns**
- `torch_geometric.data.Data or torch_geometric.data.HeteroData` Query result as a PyTorch Geometric graph. Containing numeric or boolean node properties and edge_index tensor.
- `dict` A dictionary that maps the positional offset of each node in Data/HeteroData to its primary key in the database.
- `dict` A dictionary contains node properties that cannot be converted into tensor automatically. The order of values for each property is aligned with nodes in Data/HeteroData.
- `dict` A dictionary contains edge properties. The order of values for each property is aligned with edge_index in Data/HeteroData.
