---
title: Testing Framework
sidebar_position: 2
---

# Testing Framework
![](https://codecov.io/github/kuzudb/kuzu/branch/master/graph/badge.svg?token=N1AT6H79LM")  

## Introduction

Testing is a crucial part of Kùzu to ensure the correct functioning of the
system. The general principle for our testing is to avoid testing components individually, 
instead we should route all tests, when possible, in the end-to-end way through Cypher statements.
In this way, we have designed a bespoke testing framework, which facilitates comprehensive end-to-end tests via Cypher statements.

In order to use the e2e testing framework, developers are required to generate
a `.test` file, which should be placed in the `test/test_files` directory. Each
test file comprises two key sections: the test header and test body.  In the header section, 
the developer specifies the dataset to be used, the test group name and other optional 
parameters such as `BUFFER_POOL_SIZE`.

Here is a basic example of a test:

```
# test/test_files/basic.test
# comments can also be addressed
-GROUP Basic 
-DATASET CSV tinysnb
-BUFFER_POOL_SIZE 64000000
--

-CASE BasicTest
-STATEMENT MATCH (p:person) RETURN COUNT(*);
---- 1
6000
```

The first three lines represents the header, separated by `--`. The testing
framework will parse the file and register a [GTest
programatically](http://google.github.io/googletest/advanced.html#registering-tests-programmatically).
When it comes to the test case name, the provided example above would be equivalent to:

```
TEST_F(Basic, BasicTest) {
...
}
```

The test framework will test each logical plan created from the prepared
statements and assert the result. 

## Running the tests

Our primary tool for generating the test list and executing it is `ctest`. Use the command
`make test` to build and run all tests. By default, the tests will run 
concurrently on 10 jobs, but it is also possible to change the number of parallel jobs by
running `make test TEST_JOBS=<desired number of jobs to run in parallel>`.

### Running a specific group or test case

There are two ways to run a specific e2e test or group of tests:

### 1. Using ctest and specifying the name of the test. Example: 

```
# Run the all tests from StringPrimaryKeyTest group
$ ctest -R StringPrimaryKeyTest

# Run only PrimaryKeySecondColumn test
$ ctest -R StringPrimaryKeyTest.PrimaryKeySecondColumn

# Run in verbose mode
$ ctest -V -R BinderErrorTest.MatchBuiltIn

# Run in parallel
$ ctest -j 10
```

### 2. Running directly from `e2e_test` binary

The test binaries are available in `build/release[or debug]/test/runner`
folder. You can run `e2e_test` specifying the relative path file inside
`test_files`:

```
# Run all tests inside test/test_files/copy
$ ./e2e_test copy

# Run all tests from test/test_files/long_string_pk.test file
$ ./e2e_test long_string_pk/long_string_pk.test

# Run all tests
$ ./e2e_test .
```

> **_Note:_** Some test files contain multiple test cases, and sometimes it is not easy 
to find the output from a failed test. In this situation, parameter
`--gtest_break_on_failure` might be helpful to break the test on failure.


## Test file header

The `.test` file header contains two required parameters: `-GROUP` and
`-DATASET`, to specify the test group name and the dataset to be used. If no
dataset is required, use the keyword 'empty'.

### Specifying the Dataset

| Property | Description |
|---|---|
| `-DATASET [type] [dataset name]` | **type:** CSV, PARQUET, NPY or empty<br/> **dataset name:** the name of the directory inside  `dataset/`. i.e. tinysnb. |

Examples:

```
-GROUP MyTest
-DATASET CSV tinysnb
--
```

```
-GROUP MyTest
-DATASET PARQUET demo-db/parquet
--
```

#### Converting CSV to Parquet

It is also possible to make a conversion from CSV dataset to PARQUET file format
using `CSV_TO_PARQUET(dataset path)`. This case is especially useful to ensure
the expected result remains the same for both CSV and PARQUET file format
without storing the same dataset in the codebase twice.


```
-GROUP MyTest
-DATASET PARQUET CSV_TO_PARQUET(tinysnb)
--
```

> **_Note:_** for the conversion, the framework does not match the current schema to
the parquet files. It relies on arrow to auto detect the datatype when reading
and convering the CSV to Parquet.


### Other properties


Other optional parameters include `-BUFFER_POOL_SIZE`, `-CHECKPOINT_WAIT_TIMEOUT` and `-SKIP`. By including 
`-SKIP` in the header, the entire suite will be deactivated, but the tests 
will still be displayed as disabled when running through `ctest`.


## Test case

The following example illustrates a basic structure of how to create a test case:

```
-GROUP Test
-DATASET tinysnb
--

-CASE MyTest
-LOG Test A Count
-STATEMENT MATCH (p:person) RETURN COUNT(*);
---- 1
6000
```

In the example above:

`-CASE` is the name of the test case, analogous to `TEST_F(Test, MyTest)` in C++.  
`-LOG` is optional and will be only used for display purposes when running in verbose mode.  
`-STATEMENT` is followed by 4 dashes `----` alongside the expected result (error, success or the number of the tuples).   

When specifying a number after the dashes, it's necessary to add the same number of tuples in the
next following lines.  

If the subsequent lines contain additional statements to validate, they will be incorporated into the same test case
unless a new `-CASE` is written.

### Results

There are three ways to specify the expected result:

| Result | Description |
|---|---|
| `---- error` | The following lines must be the expected error message. |
| `---- ok` | does not require any additional information below the line.  |
| `---- [number of expected tuples]` | The following lines must be exactly the query results. |

> **_Note:_** By default, the expected result tuples can be written in any
> order. The framework will sort the actual &amp; expected results before
> comparing. If you need the results not to be sorted, you can set it by adding
> `-CHECK_ORDER` before the statement.


```
# Expects error message 
-STATEMENT MATCH (p:person) RETURN COUNT(intended-error);
---- error
Error: Binder exception: Variable intended is not in scope.

# Success results don't need anything after the dashes
-STATEMENT CREATE NODE TABLE  Person (ID INT64, PRIMARY KEY (ID));
---- ok

-STATEMENT MATCH (a:person) RETURN a.fName LIMIT 4
---- 4
Alice
Bob
Carol
Dan
```

Query results can also be stored in a file. By using `<FILE>:`, the testing
framework reads the results from the file and compare to the actual query
result. The file must be created inside `test/answers/<name-of-the-file.txt>`. 

```
-STATEMENT MATCH (p0:person)-[r:knows]->(p1:person) RETURN ID(r)
---- 5001
<FILE>:file_with_answers.txt
```

### Additional properties 

It is also possible to use the additional properties inside each test case:

| Property | Parameter | Description |
|---|---|---|
| `-LOG` | any string | Define a name for each block for informational purposes |
| `-SKIP` | none | Register the test but skip the whole test case. When a test is skipped, it will display as disabled in the test run |
| `-PARALLELISM` | integer | Default: 4. The number of threads that will be set by `connection.setMaxNumThreadForExec()` |
| `-BEGIN_WRITE_TRANSACTION` | none | Call `connection.beginWriteTransaction()` before the subsequent statements. |
| `-CHECK_ORDER` | none | By default, the query results and expected results are ordered before asserting comparison. |

### Defining variables

A variable can be defined and re-used inside a statement, results or error
message:

```
-DEFINE EXPECTED_RESULT "0|1:0|0"
-CASE Backward
-STATEMENT MATCH (p0:person)<-[r:knows]-(p1:person) WHERE p0.ID = 0 RETURN p0.ID, ID(r), p1.ID
---- 1
${EXPECTED_RESULT}

-CASE Forward
-STATEMENT MATCH (p0:person)-[r:knows]->(p1:person) WHERE p0.ID = 0 RETURN p0.ID, ID(r), p1.ID
---- 1
${EXPECTED_RESULT}
```

A more practical example is using functions alongside `-DEFINE`. The framework
currently support the following functions: 

| Function | Description | Example |
|---|---|---|
| `-DEFINE [var] ARANGE [start] [end]` | Generate a list of numbers from start to end | `-DEFINE STRING_OVERFLOW ARANGE 0 5` <br/> generates `STRING_OVERFLOW = [0,1,2,3,4,5]` |
| `-DEFINE [var] REPEAT [count] "[text]"` | Repeat the text multiple times | `-DEFINE MY_STR REPEAT 3 "MyString"`<br/> generates `MY_STR = "MyStringMyStringMyString"` |

#### Pre-defined variables

The following variables are available to use inside the statements:

| Variable| Description |
|---|---
| `${KUZU_ROOT_DIRECTORY}` | Kùzu directory path |
| `${DATABASE_PATH}` | When a test case runs, a temporary database path is created and cleaned up after the suite finishes. This variable represents the path of the running test case. |


### Defining statement blocks

A statement block can be defined and re-used along the test file.  
`-DEFINE_STATEMENT_BLOCK` define a block that can be used by
calling `-INSERT_STATEMENT_BLOCK` in any part of the test case body. It
can be useful to perform checks without having to re-write the same staments
again.


```
-DEFINE_STATEMENT_BLOCK CREATE_PERSON_REL [
-STATEMENT MATCH (a:person), (b:person) WHERE a.ID=10 AND b.ID=20 CREATE (a)-[e:knows]->(b)
---- ok
-STATEMENT MATCH (a:person), (b:person) WHERE a.ID=1 AND b.ID=2 CREATE (a)-[e:knows]->(b)
---- ok
]

-CASE TestCaseA
-INSERT_STATEMENT_BLOCK CREATE_PERSON_REL
-STATEMENT ...
---- ok

-CASE TestCaseB
-INSERT_STATEMENT_BLOCK CREATE_PERSON_REL
-STATEMENT ...
---- ok
```
### Multiple connections
The following example illustrates how to use multiple connections:

```
-GROUP Set_Transaction
-DATASET CSV tinysnb

--

-CASE TimeoutErrorTest
-CHECKPOINT_WAIT_TIMEOUT 10000
-CREATE_CONNECTION conn_read
-CREATE_CONNECTION conn_write
-STATEMENT [conn_read] BEGIN READ TRANSACTION;
---- ok
-STATEMENT [conn_write] BEGIN WRITE TRANSACTION;
---- ok
-STATEMENT [conn_write] MATCH (a:person) WHERE a.ID=0 set a.age=70;
---- ok
-STATEMENT [conn_write] COMMIT
---- error
Timeout waiting for read transactions to leave the system before committing and checkpointing a write transaction. If you have an open read transaction close and try again.
-STATEMENT [conn_read] MATCH (a:person) WHERE a.ID=0 RETURN a.age;
---- 1
35

```

In the example above:

`-CREATE CONNECTION conn.*` initiates a connection to the database. It's essential that the connection name matches the specified prefix `conn`, like `conn_write`, `conn_read`.   
`-STATEMENT` is followed by a connection name that was defined in the `-CREATE CONNECTION` statement. If a connection name is not explicitly mentioned in a statement, the testing framework will default to using the default connection.

### Batch statements
We can use `-BATCH_STATEMENTS` to test a batch of query statments from a file:

```
-BATCH_STATEMENTS <FILE:>small_list_becomes_large_list_after_insertion.cypher
---- ok
```

In the example above:

`-BATCH_STATEMENTS` is followed by `<FILE>:` , indicating that you're specifying a file to be used. The file must be created inside `test/statements/<name-of-the-file.cypher>`. By doing so, the testing framework reads the query statements from the file and execute each query statement.

## Examples

Full example with comments.

```
# Header
# We can add -SKIP here if we need to temporarily skip the whole file
-GROUP Create
-TEST CreateRelTest
-BUFFER_POOL_SIZE 64000000
-CHECKPOINT_WAIT_TIMEOUT 10000
-DATASET PARQUET CSV_TO_PARQUET(tinysnb)

--

-DEFINE_STATEMENT_BLOCK create_rel_set [
-STATEMENT MATCH (a:person), (b:person) 
                 WHERE a.ID=10 AND b.ID=20 
                 CREATE (a)-[e:knows]->(b);
---- ok
-STATEMENT MATCH (a:person), (b:person) 
                 WHERE a.ID=1 AND b.ID=2
                 CREATE (a)-[e:knows]->(b);
---- ok
]

-CASE TestRelationSet

-LOG Current Relaaation Test
-STATEMENT MATCH (a:person)-[e:knows]->(b:person) RETURN COUNT(*)
---- 1
2

# This is also part of TestRelationSet test case
-LOG Create Relation Set
-INSERT_STATEMENT_BLOCK create_rel_set
-STATEMENT MATCH (a:person)-[e:knows]->(b:person) RETURN COUNT(*)
---- 1
4

# This is also part of TestRelationSet test case
-LOG Test Duplicated Primary Key
-STATEMENT MATCH (a:person), (b:person)
                 WHERE a.ID=1 AND b.ID=20 
                 CREATE (a)-[e:knows]->(b);
---- error
"Exception: Duplicate primary key"


# New test case. Start a new database
-CASE OrderCheck

-CHECK_ORDER
-PARALLELISM 1
-STATEMENT MATCH (a:person)-[:studyAt]->(b:organisation) 
             WHERE b.name = "Waterloo"
             RETURN a.name,
                    a.age ORDER BY a.age DESC;
---- 2
Karissa|40
Adam|30

# Read query results from a file to compare 
-CASE PersonOrganisationRelTest 
-STATEMENT MATCH (a:person)-[:studyAt]->(b:organisation)
RETURN a.ID, b.ID
---- 16
<FILE>:person_study_at_answers.txt

```

Example of `BEGIN_WRITE_TRANSACTION`:

```
-CASE ParsingErrorRollbackTest

-BEGIN_WRITE_TRANSACTION
-STATEMENT CREATE (p:person {ID: 100})
---- ok
-STATEMENT MATCH (:person) RETURN count(*)
---- 1
9
-STATEMENT RETURN make_date(2011,1,32)
---- error
Date out of range: 2011-1-32.
-STATEMENT MATCH (:person) RETURN count(*)
---- 1
8
```

| File | Description|
|---|---|
| [set.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/tinysnb/update_node/set.test#LL78C33-L78C36) | ARANGE example |
| [copy_long_string.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/copy/copy_long_string.test) | REPEAT example | 
| [copy_multiple_files.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/copy/copy_multiple_files.test) | Using statement blocks |
| [catalog.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/exceptions/catalog/catalog.test) | Dealing with exceptions |
