---
slug: kuzuexplorer
authors: [chang]
tags: [internals]
---

import SchemaPanelImage from './schema-panel.png';

# KùzuExplorer: Visualizing Query Results and Schemas

## Overview

Today, we are happy to release KùzuExplorer, which is Kùzu's browser-based frontend to
visualize and explore database schemas and query results in the form of a graph and/or tables.
This is a very useful tool for exploring databases and debugging applications during prototyping
phase. This post describes a brief overview of the main features of KùzuExplorer with pointers to 
[KuzuExplorer documentation](./../kuzuexplorer) for details.

## Launching KùzuExplorer
KùzuExplorer is a web application that is launched from a deployed Docker image. Assuming you have Docker 
installed before proceeding, you can launch KùzuExplorer on an existing DBMS you have or on an empty database.
Details can be found [here](./../kuzuexplorer/launching). For example, to start KùzuExplorer on an empty
database, you can simply run the following command on your shell, and then access KùzuExplorer by going to
`http://localhost:8000`

```
docker run -p 8000:8000 --rm kuzudb/kuzu-ui:latest
```

## Schema Exploring and Editing

<div class="img-center">
<img src={SchemaPanelImage} width="600"/>
</div>

## Query Result Visualization

## Configuring Visualizations
There is also a Settings tab on the right hand corner, which can be used for several more advanced
setting changes, e.g., changing the colors or sizes of nodes of a certain type (e.g., `User` nodes) or
the maximum number of nodes to plot on the node-link graph visualizations when visualizing query results.
Details of these can be found [here](./../kuzuexplorer/settings-panel).

We hope you enjoy using KùzuExplorer and help us make it better! Please send us any feature or documentation requests or
bug reports by opening an issue in [KùzuExplorer's github repo](https://github.com/kuzudb/kuzu-ui)https://github.com/kuzudb/kuzu-exlorer)!

