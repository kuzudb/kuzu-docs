---
title: Shell Panel
---

## Query editor

Using the Shell Panel, you can interactively issue queries to your loaded database
and visualize the results in several different views. You issue queries by using
the canvases on your screen, which have a red X and green play icon on the left side.
You write your query on the top of a canvas and when you click the play button or press Shift+Enter,
the query in the canvas is issued.
Below is a screenshot that asks a simple query that returns all of the relationships
and their source and destination nodes in the database. The results of the query can
be rendered in 3 possible ways.

First, query results can be rendered as a graph view as shown below.

<img src="/img/visualization/query-result-graph-view.png" />

There is a side panel in the graph view, which you can open and close to see the properties of
individual nodes and relationships you click on or hover over. The graph view is enabled
and is the default view if the query's `RETURN` statement contains node (and relationship) variables.
For example if the query about returned only the name property of `a` nodes, i.e.,
if the return statement was `RETURN a.name`, then you could not see the results in a graph view,
as the return values are only a column of strings. As long as one of the variables projected
in the `RETURN` statement is a node you will get by default a graph view.

Second, query results can be output as a table as shown below by clicking the table icon on the left hand
side of a canvas.

<img src="/img/visualization/query-result-table-view.png" />

Finally query results can be output in JSON format as shown below by clicking the `</>` icon on the
left hand side of a canvas.

<img src="/img/visualization/query-result-json-view.png" />

## Inspect node and relationship properties

If the displayed property on a node is too large to fit inside it, the text is truncated on the node
displayed in the graph view. There are two ways to gain more information about a node or relationship's
property values.

### Hover display

If you hover your cursor over a given node or relationship, you will see the node's properties displayed
in a box that appears over that node or relationship. The box disappears if the cursor moves away outside
the bounds of the entity. This mode is useful for a quick, cursory glance of a node's properties as
you're inspecting the graph at a high level.

<img src="/img/visualization/expand-hover-view.png" />

### Expand right sidebar

For a full view of a node or relationship's property values, you can click on it. A sidebar will pop up on
the right side, which displays the property values in full, which is useful to gain a deeper understanding
of the data, including which field is the primary key (if it is a node).

<img src="/img/visualization/expand-sidebar.png" />

## Query progress

For expensive queries that might take a significant amount of time to execute, a progress bar can be enabled that displays
the number of pipelines that have been executed (each query is broken down into one or more pipelines), 
as well as the percentage of the data processed in a pipeline. This gives an estimate for how much of a pipeline
has executed.

The progress bar is not enabled by default. To enable the progress bar, use the following command:

```cypher
CALL progress_bar=true;
```

To further configure the progress bar, see the [configuration](/cypher/configuration) section.
