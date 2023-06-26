import DocCardList from '@theme/DocCardList';

# Client APIs
You can interact with Kùzu through its CLI or client APIs in C, C++, Python, and Node.js.

Each query to Kùzu through its CLI or client APIs are transactional, 
satisfying serializability, atomicity and durability.
This part of the documentation also gives details of Kùzu [transactions](transactions.md). 

## Note on Connecting to the Same Database Directory From Multiple `Database` Instances
Each of these three ways ultimately creates a `Database` instance in C++ (Kùzu's CLI is written in C++, so is a C++
process, and Kùzu's Python API, through which you create a `PyDatabase` instance is a binding to Kùzu's C++ API
and so ultimately creates a `Database` instance). Each database you create is identified by
its directory. If you are going to concurrently interact with the same database through more than one
`Database` instances, you should
ensure that you only issue read queries to the system. Your writes from one `Database` instance
will not be visible to your other program and you can easily corrupt your database. Kùzu currently does not ensure 
that you are connecting to the same database directory through a single `Database` instance. 
*You can however open multiple connections to the same database from the same `Database` instance.* So you can 
have as many connections to the same database using the same `Database` or `PyDatabase` instance. But you shouldn't
concurrently have a CLI open that writes to the same database directory and a separate C++ or Python process
that reads from the database in that directory.

<DocCardList />
