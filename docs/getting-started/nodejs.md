---
title: Node.js
sidebar_position: 5
---

Kùzu Node.js API can be installed with npm: `npm install kuzu`. 

Once the Node.js API is installed, you can import it in Node.js and use it to perform Cypher queries. Below is a short example
of how to get started. Details of the [Node.js API is here](../client-apis/nodejs-api).

```
// Import library
const kuzu = require("kuzu");

(async () => {
  // Create an empty database and connect to it
  const db = new kuzu.Database("./test");
  const conn = new kuzu.Connection(db);

  // Create the tables
  await conn.query(
    "CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))"
  );
  await conn.query(
    "CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))"
  );
  await conn.query("CREATE REL TABLE Follows(FROM User TO User, since INT64)");
  await conn.query("CREATE REL TABLE LivesIn(FROM User TO City)");

  // Load the data
  await conn.query('COPY User FROM "user.csv"');
  await conn.query('COPY City FROM "city.csv"');
  await conn.query('COPY Follows FROM "follows.csv"');
  await conn.query('COPY LivesIn FROM "lives_in.csv"');

  const queryResult = await conn.query("MATCH (u:User) RETURN u.name, u.age;");

  // Get all rows from the query result
  const rows = await queryResult.getAll();

  // Print the rows
  for (const row of rows) {
    console.log(row);
  }
})();
```

Output:
```
{ 'u.name': 'Adam', 'u.age': 30 }
{ 'u.name': 'Karissa', 'u.age': 40 }
{ 'u.name': 'Zhang', 'u.age': 50 }
{ 'u.name': 'Noura', 'u.age': 25 }
```
