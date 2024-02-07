---
title: Overview
sidebar_position: 0
---

# Overview

Kùzu has an extension framework designed to extend Kùzu's capabilities. Currently our only extension
supports reading data  from a file hosted on a http(s) server and can be used to read from Amazon
S3. We plan to implement additional extensions, such as to support new data types, functions and
indices.

Extensions expose several internal interfaces of Kùzu, such as FileSystem, that can have multiple implementations.
Extensions are implementations of these interfaces that can be loaded dynamically at runtime.
*Official extensions* are implementations by the Kùzu team. These are hosted in our [official
extensiosn repo](https://github.com/kuzudb/extension).
Third-party developers can also develop their own extensions. However, we do not recommend this yet
until we have more stable APIs. That is why are currently not providing detailed documentation on how to develop
your own extensions. For now, please contact us directly over email or in Discord if you want to develop your own extension.

# Official Extensions

The available extensions for each OS are hosted in the `kuzudb/extension` [repo](https://github.com/kuzudb/extension).

| Extension Name | Description |
|----------|----------|
| httpfs | Adds support for reading and writing files over HTTP(s) protocol |

# Using Extensions in Kùzu

## Installing an official extension

Kùzu requires the user to install the extension before loading and using it.
Official extensions can be simply installed by running the install command:

```
INSTALL extension_name
```

Where `extension_name` is the name of the extension to be installed.

## Loading an official extension
After installation, a load command is required to ask Kùzu to dynamically load the shared library.
Extensions installed using the `INSTALL` command can be loaded directly as follows: 

```
LOAD EXTENSION httpfs
```
