---
title: C++
sidebar_position: 3
---

[Detailed C++ API documentation can be found here](https://kuzudb.com/api-docs/cpp/annotated.html). This page is a brief guide 
on how to get started with the Kùzu C++ API.

The Kùzu C++ API is distributed as so/dylib/dll+lib library files along with a header file (`kuzu.hpp`). 
The C++ API can be downloaded [here](https://github.com/kuzudb/kuzu/releases/latest). 
Once you've downloaded and extracted the C++ API into a directory, it's ready to use without any additional installation. Just need to specify the library search path for the linker.
Below is a brief guide on how to get started.

- Setup:
In this example, we assume that the so/dylib/dll+lib, the header file, the CSV files, and the cpp code file is under the same directory:

```
├── include                                    
│   ├── kuzu.hpp
│   └── ......
├── libkuzu.so / libkuzu.dylib / kuzu_shared.dll + kuzu_shared.lib
├── test.cpp                                            
├── user.csv
├── city.csv
├── follows.csv
└── lives-in.csv
```

- The `test.cpp` program:

```cpp
#include <iostream>

#include "include/kuzu.hpp"

using namespace kuzu::main;
using namespace std;

int main() {
    // Create an empty database.
    SystemConfig systemConfig;
    auto database = make_unique<Database>("test", systemConfig);

    // Connect to the database.
    auto connection = make_unique<Connection>(database.get());

    // Create the schema.
    connection->query("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))");
    connection->query("CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))");
    connection->query("CREATE REL TABLE Follows(FROM User TO User, since INT64)");
    connection->query("CREATE REL TABLE LivesIn(FROM User TO City)");

    // Load data.
    connection->query("COPY User FROM \"user.csv\"");
    connection->query("COPY City FROM \"city.csv\"");
    connection->query("COPY Follows FROM \"follows.csv\"");
    connection->query("COPY LivesIn FROM \"lives-in.csv\"");

    // Execute a simple query.
    auto result =
        connection->query("MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name;");

    // Output query result.
    while (result->hasNext()) {
        auto row = result->getNext();
        std::cout << row->getValue(0)->getValue<string>() << " "
                  << row->getValue(1)->getValue<int64_t>() << " "
                  << row->getValue(2)->getValue<string>() << std::endl;
    }
    return 0;
}
```

- Compile and run `test.cpp`:
Since we did not install the `libkuzu` as a system library, we need to override the linker search path to correctly compile the C++ code and run the compiled program.
On Linux:
```bash
env LIBRARY_PATH=. LD_LIBRARY_PATH=. g++ test.cpp -std=c++2a -lkuzu -lpthread
env LIBRARY_PATH=. LD_LIBRARY_PATH=. ./a.out
```
On macOS:
```bash
env DYLD_LIBRARY_PATH=. LIBRARY_PATH=. clang++ test.cpp -std=c++20 -lkuzu
env DYLD_LIBRARY_PATH=. LIBRARY_PATH=. ./a.out
```
On Windows the library file is passed to the compiler directly and the current directory is used automatically when searching for `kuzu_shared.dll` at runtime:
```
cl /std:c++20 /EHsc test.cpp kuzu_shared.lib
./test.exe
```
Expected output:
```
Adam 2020 Karissa
Adam 2020 Zhang
Karissa 2021 Zhang
Zhang 2022 Noura
```
