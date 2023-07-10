import DocCardList from '@theme/DocCardList';

# C++ API

This module contains C++ API documentaion. Please
see the [getting started instructions](../../getting-started/cpp.md) for details on installation and environment setup. This part
of the documentation gives details about the different classes in the C++
API and their functions. Here is a short example on a small program that
demonstrates how to construct at `Database` instance and issue a query.

Currently Kùzu supports manually beginning a transaction,
issuing multiple commands within a transaction and then committing or rolling
back, only through its C++ API. Please see the details on transactions
[here](../transactions.md).


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