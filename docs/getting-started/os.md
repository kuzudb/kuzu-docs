---
title: Operating System Compatibility
sidebar_position: 10
---

## CLI, C and C++
Kùzu CLI, C and C++ API are pre-compiled for **macOS >= 10.15 for Intel-based Macs** and **macOS >= 11.0 for ARM-based Macs**. For Linux, Kùzu CLI, C and C++ API are pre-compiled for x86-64 architecture and supports most modern Linux distros such as **RHEL/CentOS/Rocky Linux/Oracle Linux 7.0 or later and Ubuntu 18.04 or later**. For a specific list of Linux distros that we tested on, please refer to [this spreadsheet](https://docs.google.com/spreadsheets/d/13A3MA3IsBJB_CJBSMqWFktIzyb6unJqH0-3njDycDpQ/). For Windows, Kùzu CLI, C and C++ API works on Windows 10 and 11.

## Python
Kùzu Python API wheels has been pre-compiled for **CPython 3.7 to 3.11**. For macOS, the OS compatibility is the same as the pre-compiled CLI, C and C++ API (i.e.  macOS >= 10.15 for Intel-based Macs and macOS >= 11.0 for ARM-based Macs). For Linux, the pre-compiled wheels follows `manylinux2014_x86_64` standard. Please refer to [this link](https://github.com/pypa/manylinux) to check the compatibility with your distro. For Windows, the OS compatibility is the same as the pre-compiled CLI and C++ API (i.e. Windows 10 and 11).

## Node.js
Kùzu Node.js API is based on Node-API version 5. For a list of compatible Node.js versions, please refer to [the official documentation](https://nodejs.org/api/n-api.html#node-api-version-matrix). For macOS, the OS compatibility is the same as the pre-compiled CLI and C++ API (i.e.  macOS >= 10.15 for Intel-based Macs and macOS >= 11.0 for ARM-based Macs). For Linux, the pre-compiled has been tested on [these platforms](https://docs.google.com/spreadsheets/d/13A3MA3IsBJB_CJBSMqWFktIzyb6unJqH0-3njDycDpQ/#gid=1200966755). Note that you may have to install to a newer version of Node.js manually if your distribution comes with an older version of Node.js. The Node.js API is currently not compatible with Windows. 

## Java
Kùzu Java API is compatible with Java 8+. The OS compatibility is the same as C/C++ APIs. For MacOS, it supports >=10.15 for Intel-based Macs and >= 11.0 for ARM-based Macs. For Linux, it supports most modern Linux distros such as RHEL/CentOS/Rocky Linux/Oracle Linux 7.0 or later and Ubuntu 18.04 or later on x86-64 architecture. For Windows, it supports Windows 10 and 11.

## Rust
The Kùzu Rust API links against Kùzu's C++ API. By default it compiles the C++ library from source, and the build process has been tested on Windows using MSVC, and macOS and Linux using GCC. If linking to the release binaries (see [here](https://docs.rs/kuzu/latest/kuzu/#building)) the restrictions mentioned for the C++ API above apply.
