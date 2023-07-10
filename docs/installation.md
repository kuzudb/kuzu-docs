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

```bash
Intel: https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-osx-x86_64.zip
Apple Silicon: https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-osx-arm64.zip
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

```bash
Intel: https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-osx-x86_64.zip
Apple Silicon: https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-osx-arm64.zip
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

<!-- <Tabs
  defaultValue="cmd"
  values={[
      { label: 'Command Line', value: 'cmd', },
      { label: 'Python', value: 'py', },
      { label: 'C/C++', value: 'c', },
      { label: 'NodeJS', value: 'node', },
  ]}
>

<TabItem value="cmd">

```bash
Direct download:
Linux: https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-linux-x86_64.zip
MacOS(Intel): https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-osx-x86_64.zip
MacOS(Apple Silicon): https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-osx-arm64.zip
Windows: https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-windows-x86_64.zip
```

```bash
Source:
Installation:
git clone https://github.com/kuzudb/kuzu.git
cd kuzu && make release NUM_THREADS=10
```

```bash 
Usage:
cd build/release/tools/shell && ./kuzu_shell [db directory]
```

</TabItem>

<TabItem value="py">

```bash
Installation:
pip install kuzu
```

```bash
Usage:
import kuzu
db = kuzu.Database('./test')
conn = kuzu.Connection(db)
conn.execute('RETURN "WELCOME TO KUZU DB!"')
```

</TabItem>

<TabItem value="c">

```bash
Installation:
Linux: https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-linux-x86_64.zip
MacOS(Intel): https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-osx-x86_64.zip
MacOS(Apple Silicon): https://github.com/kuzudb/kuzu/releases/download/v0.0.5/libkuzu-0.0.5-osx-arm64.zip
Windows: https://github.com/kuzudb/kuzu/releases/download/v0.0.5/kuzu_cli-0.0.5-windows-x86_64.zip
```

```bash
C Usage:

#include "include/kuzu.h"

int main()
{
    // Create an empty database.
    kuzu_database *db = kuzu_database_init("test", 0);
    // Connect to the database.
    kuzu_connection *conn = kuzu_connection_init(db);
    // Return a message.
    kuzu_query_result *result = kuzu_connection_query(conn, "RETURN \"WELCOME TO KUZU\"");
    // Destroy result,connection,database instance.
    kuzu_query_result_destroy(result);
    kuzu_connection_destroy(conn);
    kuzu_database_destroy(db);
}
```

```bash
C++ Usage:

#include "include/kuzu.hpp"

using namespace kuzu::main;

int main() {
    // Create an empty database.
    SystemConfig systemConfig;
    auto database = make_unique<Database>("test", systemConfig);

    // Connect to the database.
    auto connection = make_unique<Connection>(database.get());

    // Return a message.
    connection->query("RETURN \"WELCOME TO KUZU\"")->toString();
}
```

</TabItem>

<TabItem value="node">

```bash
npm install kuzu
```

</TabItem>

</Tabs> -->