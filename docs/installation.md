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
https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-osx-x86_64.zip
 ```

- Apple Silicon
```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-osx-arm64.zip
```

</TabItem>

<TabItem value="linux">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-linux-x86_64.zip
 ```

</TabItem>

<TabItem value="win">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-windows-x86_64.zip
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
https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-osx-x86_64.zip
 ```

- Apple Silicon
```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-osx-arm64.zip
```

</TabItem>

<TabItem value="linux">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-linux-x86_64.zip
 ```

</TabItem>

<TabItem value="win">

```bash
https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-windows-x86_64.zip
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
Download the latest version [here](https://github.com/kuzudb/kuzu/releases/latest), and put it under `src/main/resources`. (We assume this is the project directory structure and the project dependency is managed through Maen).

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
    <version>0.0.5</version>
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
    <version>0.0.5</version>
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
    <version>0.0.5</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/src/main/resources/kuzu_java.jar</systemPath>
</dependency>
 ```

</TabItem>

</Tabs>
