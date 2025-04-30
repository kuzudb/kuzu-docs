---
title: System requirements
---

## CLI, C and C++

Kuzu's CLI, C and C++ APIs are pre-compiled for **macOS >= 11.0** as a universal binary that supports both Intel-based Macs and ARM-based Macs. For Linux, Kuzu CLI, C and C++ API are pre-compiled for both x86-64 and aarch64 architecture and supports most modern Linux distros such as **RHEL/CentOS/Rocky Linux/Oracle Linux 8.0 or later and Ubuntu 20.04 or later**. For Windows, Kuzu CLI, C and C++ API works on Windows 10 and 11.

## Python

Kuzu's Python API wheel has been pre-compiled for **CPython 3.7 to 3.11**. For macOS, the OS compatibility is the same as the pre-compiled CLI, C and C++ API (i.e. macOS >= 11.0). For Linux, the pre-compiled wheels follows `manylinux_2_28` standard for both x86-64 and aarch64 architecture. Please refer to this [link for more information on manylinux](https://github.com/pypa/manylinux). For Windows, the OS compatibility is the same as the pre-compiled CLI and C++ API (i.e. Windows 10 and 11).

## Node.js

Kuzu's Node.js API is based on **Node-API version 5**. For a list of compatible Node.js versions, please refer to [the official documentation](https://nodejs.org/api/n-api.html#node-api-version-matrix). The native module is pre-compiled for all supported platforms and will be automatically installed when you run `npm install kuzu`. The OS compatibility is the same as the pre-compiled CLI, C and C++ API.

## Java

Kuzu's Java API is compatible with **Java 11+**. The OS compatibility is the same as C/C++ APIs. The Java API also works for Android ARMv8-A platform. The precompiled binaries are compiled targetting [API level 21](https://developer.android.com/tools/releases/platforms). The Java API is distributed as a JAR file with pre-compiled native libraries for all supported platforms bundled inside. It does not require any additional dependencies.

## Rust

Kuzu's Rust API is closely linked with Kuzu's C++ API. By default it compiles the C++ library from source, and the build process has been tested on Windows using MSVC, and macOS and Linux using GCC. If linking to the release binaries (see [here](https://docs.rs/kuzu/latest/kuzu/#building)), the restrictions mentioned for the C++ API above apply.

## Go

Kuzu's Go API is a wrapper around the C API. The minimum version of Go is 1.20.
