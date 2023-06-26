# Database

<a name="Database"></a>

- [Database](#database)
  - [new Database(databasePath, bufferManagerSize)](#new-databasedatabasepath-buffermanagersize)
  - [database.init()](#databaseinit)
  - [database.setLoggingLevel(loggingLevel)](#databasesetlogginglevellogginglevel)

<a name="new_Database_new"></a>

### new Database(databasePath, bufferManagerSize)
Initialize a new Database object. Note that the initialization is done
lazily, so the database file is not opened until the first query is
executed. To initialize the database immediately, call the `init()`
function on the returned object.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| databasePath | <code>String</code> |  | path to the database file. |
| bufferManagerSize | <code>Number</code> | <code>0</code> | size of the buffer manager in bytes. |

<a name="Database+init"></a>

### database.init()
Initialize the database. Calling this function is optional, as the
database is initialized automatically when the first query is executed.

**Kind**: instance method of [<code>Database</code>](#Database)  
<a name="Database+setLoggingLevel"></a>

### database.setLoggingLevel(loggingLevel)
Set the logging level for the database.

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| loggingLevel | <code>kuzu.LoggingLevel</code> | the logging level to set. |

