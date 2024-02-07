---
title: Overview
sidebar_position: 0
---

# Overview

Kùzu has an extension framework designed to extend Kùzu's capabilities. Currently our only extension
supports reading data  from a file hosted on a http(s) server and can be used to read from Amazon
S3. We plan to implement additional extensions, such as to support new data types, functions and
indices.

# Official extensions

The available extensions for each OS are hosted in the `kuzudb/extension` [repo](https://github.com/kuzudb/extension).

| Extension Name | Description |
|----------|----------|
| httpfs | Adds support for reading and writing files over HTTP(s) protocol |

# Using extensions in Kùzu

## Install extension

Kùzu requires the user to install the extension before loading and using it. We support selected
extensions, but users can develop and load their own extensions (or use those developed by third-parties).

### 1. Install an official extension

Official extensions can be simply installed by running the install command:

```
INSTALL extension_name
```

Where `extension_name` is the name of the extension to be installed.

### 2. Install an unofficial extension
If the extension is developed by a third-party developer, you have to download and install
the extension library yourself.

## Load extension
After installation, a load command is required to ask Kùzu to dynamically load the shared library.

### 1. Load an official extension
Extensions installed using the `INSTALL` command can be loaded directly as follows: 

```
LOAD EXTENSION httpfs
```

### 2. Load an unofficial extension
For unofficial extensions, you have to specify the path to the extension library in the load command:

```
LOAD EXTENSION 'PATH_TO_SHARED_LIBRARY'
```
