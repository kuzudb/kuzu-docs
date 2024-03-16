---
title: Installation
sidebar_position: 0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kùzu is an embedded graph database that can be used from the command line, as well as
a variety of programming languages. The following sections cover how to install each of the
client libraries.

## Command Line

<Tabs groupId="installation" defaultValue="mac" values={[
      { label: 'MacOS', value: 'mac', },
      { label: 'Linux', value: 'linux', },
      { label: 'Windows', value: 'win', },
  ]}
>
<TabItem value="mac">

```
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/kuzu_cli-osx-universal.tar.gz
```

</TabItem>

<TabItem value="linux">

- x86-64

```
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/kuzu_cli-linux-x86_64.tar.gz
```

- aarch64

```
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/kuzu_cli-linux-aarch64.tar.gz
```

</TabItem>

<TabItem value="win">

```
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/kuzu_cli-windows-x86_64.zip
```

</TabItem>

</Tabs>

## Python

<Tabs groupId="installation" defaultValue="mac" values={[
      { label: 'MacOS', value: 'mac', },
      { label: 'Linux', value: 'linux', },
      { label: 'Windows', value: 'win', },
  ]}
>
<TabItem value="mac">

```bash
pip install kuzu
```

</TabItem>

<TabItem value="linux">

```bash
pip install kuzu
```

</TabItem>

<TabItem value="win">

```bash
pip install kuzu
```

</TabItem>

</Tabs>

## C/C++

<Tabs groupId="installation" defaultValue="mac" values={[
      { label: 'MacOS', value: 'mac', },
      { label: 'Linux', value: 'linux', },
      { label: 'Windows', value: 'win', },
  ]}
>
<TabItem value="mac">

```
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/libkuzu-osx-universal.tar.gz
```

</TabItem>

<TabItem value="linux">

- x86-64

```
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/libkuzu-linux-x86_64.tar.gz
```

- aarch64

```
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/libkuzu-linux-aarch64.tar.gz
```

- x86-64 ([old ABI](https://gcc.gnu.org/onlinedocs/libstdc++/manual/using_dual_abi.html))

```
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/libkuzu-linux-old_abi-x86_64.tar.gz
```

</TabItem>

<TabItem value="win">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.3.1/libkuzu-windows-x86_64.zip
```

</TabItem>

</Tabs>

## NodeJS

<Tabs groupId="installation" defaultValue="mac" values={[
      { label: 'MacOS', value: 'mac', },
      { label: 'Linux', value: 'linux', },
      { label: 'Windows', value: 'win', },
  ]}
>
<TabItem value="mac">

```bash
npm install kuzu
```

</TabItem>

<TabItem value="linux">

```bash
npm install kuzu
```

</TabItem>

<TabItem value="win">

```bash
npm install kuzu
```

</TabItem>

</Tabs>

## Rust

<Tabs groupId="installation" defaultValue="mac" values={[
      { label: 'MacOS', value: 'mac', },
      { label: 'Linux', value: 'linux', },
      { label: 'Windows', value: 'win', },
  ]}
>
<TabItem value="mac">

```bash
cargo add kuzu
```

</TabItem>

<TabItem value="linux">

```bash
cargo add kuzu
```

</TabItem>

<TabItem value="win">

```bash
cargo add kuzu
```

</TabItem>

</Tabs>

## Java

Download the latest version [here](https://github.com/kuzudb/kuzu/releases/download/v0.3.1/kuzu_java.jar), and put it under `src/main/resources`. (We assume this is the project directory structure and the project dependency is managed through Apache Maven).

<Tabs groupId="installation" defaultValue="mac" values={[
      { label: 'MacOS', value: 'mac', },
      { label: 'Linux', value: 'linux', },
      { label: 'Windows', value: 'win', },
  ]}
>
<TabItem value="mac">

```xml
<dependency>
    <groupId>com.kuzudb</groupId>
    <artifactId>kuzudb</artifactId>
    <version>0.3.1</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/src/main/resources/kuzu_java.jar</systemPath>
</dependency>
```

</TabItem>

<TabItem value="linux">

```xml
<dependency>
    <groupId>com.kuzudb</groupId>
    <artifactId>kuzudb</artifactId>
    <version>0.3.1</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/src/main/resources/kuzu_java.jar</systemPath>
</dependency>
```

</TabItem>

<TabItem value="win">

```xml
<dependency>
    <groupId>com.kuzudb</groupId>
    <artifactId>kuzudb</artifactId>
    <version>0.3.1</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/src/main/resources/kuzu_java.jar</systemPath>
</dependency>
```

</TabItem>

</Tabs>

## Nightly Builds

We have setup a nightly build pipeline for those who want to access latest feature set. To use the latest nightly version of Kùzu, follow the instructions below:

For Python API, the latest nightly version can be installed with `pip install --pre kuzu`.

For Node.js API, the latest nightly version can be installed with `npm i kuzu@next`.

For Rust API, the latest version can be installed directly from the GitHub repository.

For CLI, C and C++ shared library, and Java JAR, the latest nightly version can be downloaded from the latest run of [this GitHub Actions pipeline](https://github.com/kuzudb/kuzu/actions/workflows/build-and-deploy.yml).
