import DocCardList from '@theme/DocCardList';

# Python API
This module contains Python API documentaion. Please see the [getting started instructions](../../getting-started/introduction-examples.md#python-api) for
details on installation. Below is an example that demonstrates how to create a database and issue a query.

Currently Kùzu doesn't support manually begin a transaction.

## Example

```
import kuzu
# create database
db = kuzu.Database('./testdb')
# create connection
conn = kuzu.Connection(db)

# create schema
conn.execute("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))")
# load data
conn.execute('COPY User FROM "user.csv"')

# issue a query
results = conn.execute('MATCH (u:User) RETURN u.name;')
# iterate result
while results.has_next():
    print(results.get_next())
```

<DocCardList />