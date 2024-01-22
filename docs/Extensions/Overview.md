# Overview
Kùzu provides a flexible and robust extension framework designed to allow user extend database functionalities(e.g. datatypes, functions and filesystem) by dynamically loading extensions.


# [Official extensions](https://github.com/kuzudb/extension)
| Extension Name | Description |
|----------|----------|
| httpfs | Adds support for reading and writing files over HTTP(s) protocol |

# Using extensions in Kùzu
## Extension install
Kùzu requires the user to install the extension before loading and using it.
### 1. Install an official extension
Official extensions can be simply installed by the install command: `INSTALL extension_name`

For example:

To install httpfs extension, users can run the command:

```INSTALL httpfs```
### 2. Install an unofficial extension
If the extension is developed by a third-party developer, users have to download the extension library on themselves.

## Extension loading
After installation, a load command is required to let Kùzu dynamically load the shared library.
### 1. Load an installed official extension.
Extension installed using the install command can be loaded directly through the load command: ```LOAD EXTENSION httpfs```
### 2. Load an unofficial extension.
Users have to specify the path to the extension library in the load command: ```LOAD EXTENSION 'PATH_TO_SHARED_LIBRARY'```
