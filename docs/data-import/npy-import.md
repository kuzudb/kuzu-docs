---
title: NPY
---

# Data Import from NPY Files (**Experimental**)
The npy format is the standard binary file format in NumPy for persisting a single arbitrary numpy array on disk. Kùzu supports `COPY FROM BY COLUMN` statement to import a set of npy files into a node table.

## Notes
This feature is an experimental feature and will evolve. We are exploring how to enable bulk loading in a column by column manner. The primary use case is to load large node features that are stored in npy format. Currently we have the following constraints:
- **Starting with empty tables**: see [notes in CSV import](csv-import.md#several-notes) for details.
- **NPY file to column**: An npy file will be loaded as a node table column. So in the copy statement, the number of npy files should be euqal to the number of columns defined in DDL.
- **Numerical type only**: An npy file must contain numerical values only.
- **Importing to node table only**: Kùzu only supports loading npy files into a node table.

## COPY NPY Files to a Node Table
Consider a Paper table with an id column, a feature column of embedded vector of size 768, a year column and a label column as ground truth. We first define it's schema with the following statement.
```
CREATE NODE TABLE Paper(id INT64, feat FLOAT[768], year INT64, label DOUBLE, PRIMARY KEY(id));
```
The raw data is stored in npy formats where each column is represented as a numpy array on disk. The files are
```
node_id.npy", "node_feat_f32.npy", "node_year.npy", "node_label.npy"
```
We can copy these four files with the following statement
```
COPY Paper FROM ("node_id.npy", "node_feat_f32.npy", "node_year.npy", "node_label.npy") BY COLUMN;
```

Note that the number of npy files equals to the number of columns and are presented in the same order as they are defined in the DDL.