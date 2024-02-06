---
title: C
sidebar_position: 3
---
[Detailed C API documentation can be found here](https://kuzudb.com/api-docs/c/kuzu_8h.html). This page is a brief guide
on how to get started with the Kùzu C API.

The Kùzu C API shares the same so/dylib/dll+lib library files with the C++ API and can be used by including the C header file (`kuzu.h`). The C API can be downloaded [here](https://github.com/kuzudb/kuzu/releases/latest).

- Setup:
In this example, we assume that the so/dylib, the header file, the CSV files, and the C code file is under the same directory:

```
├── include                                    
│   ├── kuzu.h
│   └── ......
├── libkuzu.so / libkuzu.dylib
├── test.c                                           
├── user.csv
├── city.csv
├── follows.csv
└── lives-in.csv
```

- The `test.c` program:

```c
#include <stdio.h>

#include "include/kuzu.h"

int main()
{
    // Create kuzu system config with 512MB buffer pool size and 2 threads.
    kuzu_system_config config = {.buffer_pool_size = 512 * 1024 * 1024, .max_num_threads = 2, .enable_compression = true, .read_only = false};
    // Create an empty database.
    kuzu_database *db = kuzu_database_init("test", config);

    // Connect to the database.
    kuzu_connection *conn = kuzu_connection_init(db);

    // Create the schema.
    kuzu_query_result *result = kuzu_connection_query(conn, "CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))");
    kuzu_query_result_destroy(result);
    result = kuzu_connection_query(conn, "CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))");
    kuzu_query_result_destroy(result);
    result = kuzu_connection_query(conn, "CREATE REL TABLE Follows(FROM User TO User, since INT64)");
    kuzu_query_result_destroy(result);
    result = kuzu_connection_query(conn, "CREATE REL TABLE LivesIn(FROM User TO City)");
    kuzu_query_result_destroy(result);

    // Load data.
    result = kuzu_connection_query(conn, "COPY User FROM \"user.csv\"");
    kuzu_query_result_destroy(result);
    result = kuzu_connection_query(conn, "COPY City FROM \"city.csv\"");
    kuzu_query_result_destroy(result);
    result = kuzu_connection_query(conn, "COPY Follows FROM \"follows.csv\"");
    kuzu_query_result_destroy(result);
    result = kuzu_connection_query(conn, "COPY LivesIn FROM \"lives-in.csv\"");
    kuzu_query_result_destroy(result);

    // Execute a simple query.
    result = kuzu_connection_query(conn, "MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name;");

    // Output query result.
    while (kuzu_query_result_has_next(result))
    {
        kuzu_flat_tuple *tuple = kuzu_query_result_get_next(result);

        kuzu_value *value = kuzu_flat_tuple_get_value(tuple, 0);
        char *name = kuzu_value_get_string(value);
        kuzu_value_destroy(value);

        value = kuzu_flat_tuple_get_value(tuple, 1);
        int64_t since = kuzu_value_get_int64(value);
        kuzu_value_destroy(value);

        value = kuzu_flat_tuple_get_value(tuple, 2);
        char *name2 = kuzu_value_get_string(value);
        kuzu_value_destroy(value);

        printf("%s follows %s since %lld \n", name, name2, since);
        free(name);
        free(name2);
        kuzu_flat_tuple_destroy(tuple);
    }

    kuzu_query_result_destroy(result);
    kuzu_connection_destroy(conn);
    kuzu_database_destroy(db);
    return 0;
}
```

- Compile and run `test.c`:
Since we did not install the `libkuzu` as a system library, we need to override the linker search path to correctly compile the C code and run the compiled program.

On Linux:
```bash
env LIBRARY_PATH=. LD_LIBRARY_PATH=. gcc test.c -lkuzu
env LIBRARY_PATH=. LD_LIBRARY_PATH=. ./a.out
```
On macOS:
```bash
env DYLD_LIBRARY_PATH=. LIBRARY_PATH=. clang test.c -lkuzu
env DYLD_LIBRARY_PATH=. LIBRARY_PATH=. ./a.out
```
On Windows the library file is passed to the compiler directly and the current directory is used automatically when searching for `kuzu_shared.dll` at runtime:
```
cl test.c kuzu_shared.lib
./test.exe
```
Expected output:
```
Adam follows Karissa since 2020 
Adam follows Zhang since 2020 
Karissa follows Zhang since 2021 
Zhang follows Noura since 2022 
```
