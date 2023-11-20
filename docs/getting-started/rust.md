---
title: Rust
sidebar_position: 5
---

The rust API can be used by adding the kuzu crate to your dependencies in `Cargo.toml`:
```toml
[dependencies]
kuzu = "0.0.9"
```
Below is an example to get you started. Full documentation can be found [here](https://docs.rs/kuzu/latest/kuzu/).

The kuzu crate will by default build and statically link kuzu's C++ library from source. You can also link against the dynamic release libraries (see [the docs](https://docs.rs/kuzu/latest/kuzu/#building) for details).

```rust
use kuzu::{Database, Connection, Error, SystemConfig};

fn main() -> Result<(), Error> {
    // Create an empty database and connect to it
    let db = Database::new("./test", SystemConfig::default())?;
    let conn = Connection::new(&db)?;

    // Create the tables
    conn.query(
        "CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))"
    )?;
    conn.query(
        "CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))"
    )?;
    conn.query("CREATE REL TABLE Follows(FROM User TO User, since INT64)")?;
    conn.query("CREATE REL TABLE LivesIn(FROM User TO City)")?;

    // Load the data
    conn.query("COPY User FROM 'user.csv'")?;
    conn.query("COPY City FROM 'city.csv'")?;
    conn.query("COPY Follows FROM 'follows.csv'")?;
    conn.query("COPY LivesIn FROM 'lives-in.csv'")?;

    let query_result = conn.query("MATCH (u:User) RETURN u.name, u.age;")?;

    // Print the rows
    for row in query_result {
        println!("Name: {}, Age: {}", row[0], row[1]);
    }
    Ok(())
}
```

Output:
```
Name: Adam, Age: 30
Name: Karissa, Age: 40
Name: Zhang, Age: 50
Name: Noura, Age: 25
```
