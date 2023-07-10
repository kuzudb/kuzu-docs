import DocCardList from '@theme/DocCardList';

# Client APIs
You can interact with Kùzu through the CLI and client APIs in C, C++, Python, Node.js, Rust, and Java.

Each query to Kùzu through its CLI or client APIs are transactional, satisfying serializability, atomicity and durability.
More details on this part are given in the [transactions](transactions.md) section.

## Note on Connecting to the Same Database Directory From Multiple `Database` Instances
Each way ultimately creates a `Database` instance in C++ (Kùzu's CLI is written in C++, so is a C++
process, and Kùzu's Python API, through which you create a `PyDatabase` instance is a binding to Kùzu's C++ API
and so ultimately creates a `Database` instance. Similar for other language APIs). Each database you create is identified by its directory. 
While it's possible to create multiple `Database` instances that connect to the same database directory, you should only issue read queries in such scenarios.
This is because writes from one `Database` instance will not be visible to another, leading to potential database corruption.

As of now, Kùzu does not ensure that you are connecting to the same database directory through a single `Database` instance. 
That being said, *you're free to open multiple connections to the same database from the same `Database` instance.*  But you shouldn't concurrently have a CLI open that writes to the same database directory and a separate C++ or Python process
that reads from the database in that directory.

<DocCardList />
