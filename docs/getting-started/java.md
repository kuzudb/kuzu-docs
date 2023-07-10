---
title: Java
sidebar_position: 7
---

The Kùzu Java API is packaged and distributed as a jar file. 
You can manually download the latest version [here](https://github.com/kuzudb/kuzu/releases/latest).
After the jar file is downloaded and placed into the project directory, it can be referenced in classpath manually with the `-cp` option.

- Setup: In this example, we assume the jar file and the Java code reside in the following directory structure:
```
|-- dataset
|   |-- user.csv
|   |-- city.csv
|   |-- follows.csv
|   |-- lives-in.csv
|-- src/main
|   |-- java/org/example/Main.java
|   |-- resources/kuzu_java.jar
```

- Below is a Main example class demonstrating typical usage:
```java
package org.example;
import com.kuzudb.*;

public class Main {

    public static void main(String[] args) throws KuzuObjectRefDestroyedException {
        String db_path = "./testdb";
        KuzuDatabase db = new KuzuDatabase(db_path, 0);
        KuzuConnection conn = new KuzuConnection(db);

        // Create tables.
        conn.query("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))");
        conn.query("CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))");
        conn.query("CREATE REL TABLE Follows(FROM User TO User, since INT64)");
        conn.query("CREATE REL TABLE LivesIn(FROM User TO City)");

        // Load data.
        KuzuQueryResult r1 = conn.query("COPY User FROM './dataset/user.csv'");
        System.out.println(r1.toString());

        KuzuQueryResult r2 = conn.query("COPY City FROM './dataset/city.csv'");
        System.out.println(r2.toString());

        KuzuQueryResult r3 = conn.query("COPY Follows FROM './dataset/follows.csv'");
        System.out.println(r3.toString());

        KuzuQueryResult r4 = conn.query("COPY LivesIn FROM './dataset/lives-in.csv'");
        System.out.println(r4.toString());

        // Execute a simple query.
        KuzuQueryResult result =
                conn.query("MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name;");
        System.out.println("Num tuples: " + result.getNumTuples());

        while (result.hasNext()) {
            KuzuFlatTuple row = result.getNext();
            System.out.println("Row: " + row);
            row.destroy();
        }
        result.destroy();
    }
}
```

- To execute the example, navigate to the project root directory and run the following command:
```shell
java -cp '.:src/main/resources/kuzu_java.jar' src/main/java/org/example/Main.java
```

- For users who prefer Maven, our jar file can also be manually referenced from your Maven configuration:
```xml
<dependency>
    <groupId>com.kuzudb</groupId>
    <artifactId>kuzudb</artifactId>
    <version>0.0.5</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/src/main/resources/kuzu_java.jar</systemPath>
</dependency>
```

Please note that we will soon provide a more convenient Maven-based solution for installing our API directly from Maven Central.
