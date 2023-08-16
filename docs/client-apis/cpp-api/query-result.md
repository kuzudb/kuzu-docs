---
title: Query Result
sidebar_position: 3
---

# QueryResult
`QueryResult` captures all information related to the execution of a query. Each returned tuple is wrapped into a [FlatTuple](flat-tuple.md) where each entry is wrapped as a [Value](value.md).
You can also obtain a `QuerySummary` from a QueryResult, to learn profiling information, such as execution time, about the query you executed.

## Example
```
unique_ptr<QueryResult> result = connection.query("MATCH (a:person) RETURN COUNT(*);");
if (!result->isSuccess()) {
    std::cout << result->getErrorMessage() << endl;
}
while (result->hasNext()) {
    auto row = result->getNext();
    std::cout << row->getResultValue(0)->getInt64Val() << std::endl;
}
```

## Available APIs

## class kuzu::main::QueryResult

QueryResult stores the result of a query execution.  

---
**getColumnDataTypes**

```c++
std::vector<common::DataType> getColumnDataTypes ()
```

**Returns:**
- dataType of each column in query result. 

---
**getColumnNames**

```c++
std::vector<std::string> getColumnNames ()
```

**Returns:**
- name of each column in query result. 

---
**getErrorMessage**

```c++
std::string getErrorMessage ()
```

**Returns:**
- error message of the query execution if the query fails. 

---
**getNext**

```c++
std::shared_ptr<processor::FlatTuple> getNext ()
```

**Returns:**
- next flat tuple in the query result. 

---
**getNumColumns**

```c++
size_t getNumColumns ()
```

**Returns:**
- number of columns in query result. 

---
**getNumTuples**

```c++
uint64_t getNumTuples ()
```

**Returns:**
- num of tuples in query result. 

---
**getQuerySummary**

```c++
QuerySummary* getQuerySummary ()
```

**Returns:**
- query summary which stores the execution time, compiling time, plan and query options. 

---

```c++
bool hasNext ()
```

**Returns:**
- whether there are more tuples to read. 

---
**isSuccess**

```c++
bool isSuccess ()
```

**Returns:**
- query is executed successfully or not. 

---
**writeToCSV**

```c++
void writeToCSV (const std::string & fileName, char delimiter = ',', char escapeCharacter = ''', char newline = 'n')
```
writes the query result to a csv file. 

**Parameters**
- `fileName` name of the csv file. 
- `delimiter` delimiter of the csv file. 
- `escapeCharacter` escape character of the csv file. 
- `newline` newline character of the csv file. 

---

**getArrowSchema**

```c++
std::unique_ptr<ArrowSchema> getArrowSchema() const;
```

**Returns:**
- the arrow schema of the query result.

---

**getNextArrowChunk**

```c++
std::unique_ptr<ArrowArray> getNextArrowChunk(int64_t chunkSize);
```

**Parameters**
- `chunkSize`: number of tuples to return in the chunk.

**Returns:**
- the next chunk of the query result as an arrow array. The arrow array internally stores an arrow struct with fields for each of the columns.

## class kuzu::main::QuerySummary

QuerySummary stores the execution time, plan, compiling time and query options of a query.  

---
**getCompilingTime**

```c++
double getCompilingTime ()
```

**Returns:**
- query compiling time. 

---
**getExecutionTime**

```c++
double getExecutionTime ()
```

**Returns:**
- query execution time. 

---
**getPlan**

```c++
std::string getPlan ()
```

**Returns:**
- physical plan for query in string format. 

---
