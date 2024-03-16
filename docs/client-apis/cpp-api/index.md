import DocCardList from '@theme/DocCardList';

# C++ API

[Detailed C++ API documentation can be found here](https://kuzudb.com/api-docs/cpp/annotated.html).

This module contains C++ API documentaion. Please
see the [getting started instructions](../../getting-started/quick-start/cpp.md) for details on installation and environment setup.
Here is a short example on a small program that
demonstrates how to construct at `Database` instance and issue a query.

```
DatabaseConfig databaseConfig("testdb");
SystemConfig systemConfig(1ull << 31 /* set buffer manager size to 2GB */);
Database database(databaseConfig, systemConfig);

// connect to the database
auto connection = Connection(&database);

// create the schema
connection.query("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))");
// load data
connection.query("COPY User FROM \"user.csv\"");
// issue a query
auto result = connection.query("MATCH (a:User) RETURN a.name");
// iterate result
while (result->hasNext()) {
  auto row = result->getNext();
  std::cout << row->getResultValue(0)->getStringVal() << std::endl;
}
```
<DocCardList />