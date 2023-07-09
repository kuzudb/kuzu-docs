---
title: C++
sidebar_position: 3
---

Kùzu C++ API is distributed as so/dylib/dll+lib library files and a header file (`kuzu.hpp`). The C++ API can be downloaded [here](https://github.com/kuzudb/kuzu/releases/latest). After the C++ API is downloaded and extracted into a directory, it can be used without installation by just specifying the library search path for the linker.
Below is a short example of how to get started. Details of the [C++ API is here](../client-apis/cpp-api).
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
└── lives_in.csv
```

- A `test.cpp` program:

```
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
    connection->query("COPY LivesIn FROM \"lives_in.csv\"");

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
```
env LIBRARY_PATH=. LD_LIBRARY_PATH=. g++ test.cpp -std=c++2a -lkuzu -lpthread -D_GLIBCXX_USE_CXX11_ABI=0
env LIBRARY_PATH=. LD_LIBRARY_PATH=. ./a.out
```
On macOS:
```
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
