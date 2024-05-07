---
title: Testing framework
---

## Introduction

Testing is a crucial part of Kùzu to ensure the correct functioning of the
system. Our general principle for testing is to avoid testing components individually --
instead we route all tests, when possible, end-to-end (e2e) via Cypher statements.

In order to use the e2e testing framework, developers are required to generate
a `.test` file, which should be placed in the `test/test_files` directory. Each
test file comprises two key sections: the test header and test body. In the header section,
you must specify the dataset to be used and other optional
parameters such as `BUFFER_POOL_SIZE`.

Here is a basic example of a test:

```
# test/test_files/basic.test
# comments can also be addressed
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
TEST_F(basic, BasicTest) {
...
}
```

The test group name will be the relative path of the file under the `test/test_files` directory, delimited by `~`, followed by a dot and the test case name.

The testing framework will test each logical plan created from the prepared
statements and assert the result.

## Running the tests

Our primary tool for generating the test list and executing it is `ctest`. Use the command
`make test` to build and run all tests. By default, the tests will run
concurrently on 10 jobs, but it is also possible to change the number of parallel jobs by
running `make test TEST_JOBS=X` where `X` is the desired number of jobs to be run in parallel.

### Running a specific group or test case

There are two ways to run a specific e2e test or group of tests:

#### 1. Using ctest and specifying the name of the test

Example:

```
# Run the all tests from `test/test_files/common/types/interval.test`
$ ctest -R common~types~interval

# Run only the DifferentTypesCheck test
$ ctest -R common~types~interval.DifferentTypesCheck

# Run in verbose mode
$ ctest -V -R common~types~interval.DifferentTypesCheck

# Run in parallel
$ ctest -j 10
```

#### 2. Running directly from `e2e_test` binary

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

:::caution[Note]
Some test files contain multiple test cases, and sometimes it is not easy
to find the output from a failed test. In this situation, the flag
`--gtest_break_on_failure` might be helpful to break the test on failure.
:::

## Test file header

The `.test` file header contains one required parameter:
`-DATASET`, to specify the test group name and the dataset to be used. If no
dataset is required, use the keyword 'empty'.

### Specifying the Dataset

| Property                         | Description                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `-DATASET [type] [dataset name]` | **Type:** CSV, PARQUET, NPY or empty<br/> **Dataset name:** the name of the directory inside `dataset/`. i.e. tinysnb. |

Examples:

```bash
-DATASET CSV tinysnb
--
```

```
-DATASET PARQUET demo-db/parquet
--
```

#### Converting CSV to Parquet

It is also possible to make a conversion from CSV dataset to PARQUET file format
using `CSV_TO_PARQUET(dataset path)`. This case is especially useful to ensure
the expected result remains the same for both CSV and PARQUET file format
without storing the same dataset in the codebase twice.

```
-DATASET PARQUET CSV_TO_PARQUET(tinysnb)
--
```

### Other properties

Other optional parameters include `-BUFFER_POOL_SIZE`, `-CHECKPOINT_WAIT_TIMEOUT` and `-SKIP`. By including
`-SKIP` in the header, the entire suite will be deactivated, but the tests
will still be displayed as disabled when running through `ctest`.

## Test case

The following example illustrates a basic structure of how to create a test case:

```
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
`-STATEMENT` is followed by 4 dashes `----` alongside the expected result (error, success, hash, or the number of the tuples).

When specifying a number after the dashes, it's necessary to add the same number of tuples in the
next following lines.

If the subsequent lines contain additional statements to validate, they will be incorporated into the same test case
unless a new `-CASE` is written.

### Results

There are three ways to specify the expected result:

| Result                             | Description                                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `---- error`                       | The following lines must be the expected error message.                                                                    |
| `---- error(regex)`                | The following lines must be a regex pattern matching the expected error message.                                           |
| `---- ok`                          | does not require any additional information below the line.                                                                |
| `---- hash`                        | A single line must follow containing the number of values in the query results and the md5 hash value of the query result. |
| `---- [number of expected tuples]` | The following lines must be exactly the query results.                                                                     |

:::note[Note]
By default, the expected result tuples can be written in any order. The framework will sort the
actual and expected results before comparing. If you need the results not to be sorted, you can
set it by adding `-CHECK_ORDER` before the statement. However, the hash of the query result is the
hash of a string of the result. As a consequence, the order of the tuples in the output must match
the order of the tuples in the expected result when using hash. More detail on hashing is included
in its own section.
:::

```
# Expects error message
-STATEMENT MATCH (p:person) RETURN COUNT(intended-error);
---- error
Error: Binder exception: Variable intended is not in scope.

# Expects regex-matching error message
-STATEMENT MATCH (p:person) RETURN COUNT(intended-error);
---- error(regex)
^Error: Binder exception: Variable .* is not in scope\.$

# Success results don't need anything after the dashes
-STATEMENT CREATE NODE TABLE  Person (ID INT64, PRIMARY KEY (ID));
---- ok

-CHECK_COLUMN_NAMES
-STATEMENT MATCH (a:person) RETURN a.fName LIMIT 4
---- 5
a.fName
Alice
Bob
Carol
Dan

# Using hash with a query equivalent to the above
-STATEMENT MATCH (a:person) RETURN a.fName LIMIT 4
-CHECK_ORDER # order matters with hashes
---- hash
4 c921eb680e6d000e4b65556ae02361d2
```

:::caution[Info]
Any number of tokens may be in between the number of expected
values and the md5 hash. As such,
`4 values hashing to c921eb680e6d000e4b65556ae02361d2`
is an equivalent line
:::

Query results can also be stored in a file. By using `<FILE>:`, the testing
framework reads the results from the file and compare to the actual query
result. The file must be created inside `test/answers/<name-of-the-file.txt>`.

```
-STATEMENT MATCH (p0:person)-[r:knows]->(p1:person) RETURN ID(r)
---- 5001
<FILE>:file_with_answers.txt
```

### Hash details

When hashing an expected output, it's best to add the `-CHECK_ORDER` flag.
If you don't want to check the order of the expected output, then you have to
sort the expected output by line (with string comparison) before creating
the hash

### Additional properties

It is also possible to use the additional properties inside each test case:

| Property              | Parameter      | Description                                                                                                         |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `-LOG`                | any string     | Define a name for each block for informational purposes                                                             |
| `-SKIP`               | none           | Register the test but skip the whole test case. When a test is skipped, it will display as disabled in the test run |
| `-PARALLELISM`        | integer        | Default: 4. The number of threads that will be set by `connection.setMaxNumThreadForExec()`                         |
| `-CHECK_ORDER`        | none           | By default, the query results and expected results are ordered before asserting comparison.                         |
| `-CHECK_COLUMN_NAMES` | none           | Includes the column names as the first row of query result. Requires +1 to number of expected tuples.               |
| `-RELOADDB`           | none           | Reload database from file system.                                                                                   |
| `-REMOVE_FILE`        | file path      | Delete the file at the given path.                                                                                  |
| `-IMPORT_DATABASE`    | directory path | Close current database. Open a new database in the given directory.                                                 |
| `-CHECK_PRECISION`    | none           | Checks floating point columns using machine epsilon precision. Requires `-CHECK_ORDER` enabled.                     |

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

| Function                                | Description                                  | Example                                                                                   |
| --------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `-DEFINE [var] ARANGE [start] [end]`    | Generate a list of numbers from start to end | `-DEFINE STRING_OVERFLOW ARANGE 0 5` <br/> generates `STRING_OVERFLOW = [0,1,2,3,4,5]`    |
| `-DEFINE [var] REPEAT [count] "[text]"` | Repeat the text multiple times               | `-DEFINE MY_STR REPEAT 3 "MyString"`<br/> generates `MY_STR = "MyStringMyStringMyString"` |

#### Pre-defined variables

The following variables are available to use inside the statements:

| Variable                 | Description                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `${KUZU_ROOT_DIRECTORY}` | Kùzu directory path                                                                                                                                              |
| `${DATABASE_PATH}`       | When a test case runs, a temporary database path is created and cleaned up after the suite finishes. This variable represents the path of the running test case. |

### Multiple queries

A statement can contain multiple queries, each separated by semi-colons, as per normal usage.
The statement would then have multiple results, in the order of the queries.

```
-STATEMENT CREATE NODE TABLE V1 (id UUID, PRIMARY KEY(id));
           CREATE NODE TABLE V2 (id INT64, PRIMARY KEY(id));
           WITH NULL as bid MATCH (b:V1 {id: bid}) RETURN b;
---- ok
---- ok
---- 0
```

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

You can use `-BATCH_STATEMENTS` to test a batch of query statements from a file:

```
-BATCH_STATEMENTS <FILE:>small_list_becomes_large_list_after_insertion.cypher
---- ok
```

In the example above:

`-BATCH_STATEMENTS` is followed by `<FILE>:` , indicating that you're specifying a file to be used.
The file must be created inside `test/statements/<name-of-the-file.cypher>`. By doing so, the testing
framework reads the query statements from the file and execute each query statement.

## Examples

### Full example with comments

```
# Header
# We can add -SKIP here if we need to temporarily skip the whole file
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

### Sample test log

| File                                                                                                                                                   | Description             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| [set.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/tinysnb/update_node/set.test#LL78C33-L78C36)   | ARANGE example          |
| [copy_long_string.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/copy/copy_long_string.test)       | REPEAT example          |
| [copy_multiple_files.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/copy/copy_multiple_files.test) | Using statement blocks  |
| [catalog.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/exceptions/catalog/catalog.test)           | Dealing with exceptions |
