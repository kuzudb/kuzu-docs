---
title: Build Kùzu from Source
sidebar_position: 1
---

# Build Kùzu from Source

** Note: This documentation is intended for developers who want to build Kùzu from source code. If you are a user who wants to use Kùzu, please refer to the [installation section](../installation.md) for downloading pre-built binaries for your platform. **

To build from source code, Kùzu requires Cmake(>=3.11), Python(>=3.7), and a compiler that supports C++20. Note that the header files of Python 3 are also required. The minimum supported version of C++ compilers is GCC 10, Clang 11, and MSVC 19.20. The preferred compiler on Linux is GCC; on macOS, Apple Clang; and on Windows, MSVC. On Linux, Clang is also tested. Other compilers which support C++20 may also work, but they are not tested.

Below are the instructions for building Kùzu on Ubuntu 22.04 LTS, AlmaLinux 9.2, Arch Linux, macOS 12, and Windows 10. These instructions should also work for other similar platforms:

- For other Debian-based Linux distros, such as *Debian*, *Linux Mint*, and *Pop!\_OS*, the instructions should be similar to Ubuntu 22.04 LTS.
- For other Red Hat-based Linux distros, such as *Red Hat Enterprise Linux (RHEL)*, *CentOS*, *Fedora*, *Rocky Linux*, and *Oracle Linux*, the instructions should be similar to AlmaLinux 9.2.
- For other Arch-based Linux distros, such as *Manjaro*, the instructions should be similar to Arch Linux.
- For other versions of *macOS*, the instructions should be similar to macOS 12.
- For other versions of *Windows*, the instructions should be similar to Windows 10.

## Building Instructions

### Ubuntu 22.04 LTS

#### Install dependencies

```bash
apt update
apt install -y build-essential cmake gcc g++ python3 python3-dev
```

#### Build Kùzu

```bash
make release NUM_THREADS=$nproc
```

### AlmaLinux 9.2

#### Install dependencies

```bash
dnf update
dnf install -y cmake gcc gcc-c++ python3 python3-devel
```

#### Build Kùzu

```bash
make release NUM_THREADS=$nproc
```

### Arch Linux

#### Install dependencies

```bash
pacman -Syu
pacman -S --needed base-devel cmake gcc python
```

#### Build Kùzu

```bash
make release NUM_THREADS=$nproc
```

### macOS 12

#### Install command line tools

```bash
xcode-select --install
```

#### Install homebrew

Follow the instructions at [https://brew.sh/](https://brew.sh/).

#### Install dependencies

```bash
brew install cmake python
```

#### Build Kùzu

```bash
make release NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### Windows 10

#### Install Visual Studio

Install Visual Studio 2019 or 2022 with C++ support, CMake, and the SDK for your version of Windows. For detailed instructions, please refer to [Microsoft's documentation](https://docs.microsoft.com/en-us/cpp/build/vscpp-step-0-installation).

#### Install Chocolatey

Follow the instructions at [https://chocolatey.org/install](https://chocolatey.org/install).

#### Install dependencies

```powershell
choco install -y python3 make ninja
```

#### Launch Visual Studio Command Prompt

Follow the instructions at [Microsoft's documentation](https://docs.microsoft.com/en-us/cpp/build/building-on-the-command-line).

#### Build Kùzu

```powershell
make release NUM_THREADS=$env:NUMBER_OF_PROCESSORS
```

## Run Tests

### C/C++ tests

```bash
make test NUM_THREADS=X
```

For additional information regarding the tests, please refer to the documentation for [Testing Framework](./testing-framework.md).

### Python tests

#### Install dependencies

While the Python bindings are built by default, additional dependencies are required to run the Python tests. To install the dependencies, please run the following command.

```bash
pip3 install -r tools/python_api/requirements_dev.txt
```

#### Run Python tests

```bash
make pythontest NUM_THREADS=X
```

### Increase `ulimit` for running tests

For some platforms, such as macOS, the default limit for the number of open files is too low for running tests, which may cause some tests to fail. To increase the limit, please run the following command before running tests.

```bash
ulimit -n 10000
```

## Build Language Bindings

By default, only C and C++ libraries, CLI, and Python bindings are built. To build other language bindings, please follow the instructions below.

### Node.js

#### Prerequisites

Install Node.js and npm. Please refer to [the download page](https://nodejs.org/en/download/) for detailed instructions. The minimum supported version of Node.js is 14.15.0.

#### Install dependencies

```bash
cd tools/nodejs_api && npm i --include=dev
```

#### Build Node.js bindings

```bash
make nodejs NUM_THREADS=X
```

#### Run Node.js tests

```bash
make nodejstest NUM_THREADS=X
```

### Java

#### Prerequisites

The minimum supported version of JDK is 11. Oracle JDK, OpenJDK, and Eclipse Temurin are supported. For detailed instructions on installing JDK, please refer to one of the following links:

- For Oracle JDK, please refer to [the download page](https://www.oracle.com/java/technologies/downloads/).
- For OpenJDK, please refer to [the download page](https://jdk.java.net/).
- For Eclipse Temurin, please refer to [the download page](https://adoptium.net/).

#### Build Java bindings

```bash
make java NUM_THREADS=X
```

#### Run Java tests

```bash
make javatest NUM_THREADS=X
```

### Rust

#### Prerequisites

Rust 1.67.0 or later is required. Installing Rust with [rustup](https://rustup.rs/) is recommended. For detailed instructions, please refer to [the download page](https://www.rust-lang.org/tools/install).

#### Build Rust bindings

```bash
cd tools/rust_api && CARGO_BUILD_JOBS=X cargo build
```

#### Run Rust tests

```bash
cd tools/rust_api && CARGO_BUILD_JOBS=X cargo test --features arrow -- --test-threads=1
```
