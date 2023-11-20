---
title: Installation
sidebar_position: 0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Command Line
<Tabs groupId="installation" defaultValue="mac" values={[
      { label: 'MacOS', value: 'mac', },
      { label: 'Linux', value: 'linux', },
      { label: 'Windows', value: 'win', },
  ]}
>
<TabItem value="mac">

- Intel
```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.12/kuzu_cli-osx-x86_64.zip
 ```

- Apple Silicon
```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.12/kuzu_cli-osx-arm64.zip
```

</TabItem>

<TabItem value="linux">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.12/kuzu_cli-linux-x86_64.zip
 ```

</TabItem>

<TabItem value="win">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.12/kuzu_cli-windows-x86_64.zip
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

- Intel
```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.12/libkuzu-osx-x86_64.zip
 ```

- Apple Silicon
```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.12/libkuzu-osx-arm64.zip
```

</TabItem>

<TabItem value="linux">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.12/libkuzu-linux-x86_64.zip
 ```

</TabItem>

<TabItem value="win">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.12/libkuzu-windows-x86_64.zip
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
Download the latest version [here](https://github.com/kuzudb/kuzu/releases/latest), and put it under `src/main/resources`. (We assume this is the project directory structure and the project dependency is managed through Apache Maven).

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
    <version>0.0.12</version>
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
    <version>0.0.12</version>
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
    <version>0.0.12</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/src/main/resources/kuzu_java.jar</systemPath>
</dependency>
 ```

</TabItem>

</Tabs>

## Nightly Build
We have setup a nightly build pipeline for those who want to access latest feature set. To use the latest nightly version of Kùzu, follow the instructions below:

For Python API, the latest nightly version can be installed with `pip install --pre kuzu`.

For Node.js API, the latest nightly version can be installed with `npm i kuzu@next`.

For Rust API, the latest nightly version can be found at [crates.io](https://crates.io/crates/kuzu/versions).

For CLI, C and C++ shared library, and Java JAR, the latest nightly version can be downloaded from the latest run of [this GitHub Actions pipeline](https://github.com/kuzudb/kuzu/actions/workflows/build-and-deploy.yml).
