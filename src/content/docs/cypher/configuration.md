---
title: Configuration
description: "Connection and database configuration"
---

The configuration of a Kùzu database or a connection to the database can be changed through a standalone `CALL`
statement, described in this section. Different from [the `CALL` clause](/cypher/query-clauses/call), this statement of changing
configuration **cannot** be used with other query clauses, such as `RETURN`.

### Connection configuration
| Option | Description                                                                    | Default                |
| ----------- |--------------------------------------------------------------------------------|------------------------|
| `THREADS` | number of threads used by execution                                            | system maximum threads |
| `TIMEOUT` | timeout of query execution in ms                                               | N/A                    |
| `VAR_LENGTH_EXTEND_MAX_DEPTH` | maximum depth of recursive extend                                              | 30                     |
| `ENABLE_SEMI_MASK` | enables the semi mask optimization                                             | true                   |
| `HOME_DIRECTORY`| system home directory                                                          | user home directory    |
| `FILE_SEARCH_PATH`| file search path                                                               | N/A                    |
| `PROGRESS_BAR` | enable progress bar in CLI                                                     | false                  |
| `PROGRESS_BAR_TIME` | show progress bar after time in ms                                             | 1000                   |
| `CHECKPOINT_THRESHOLD` | the WAL size threshold in bytes at which to automatically trigger a checkpoint | 16777216 (16MB)        |

### Database configuration
| Option | Description | Default |
| ----------- | --------------- | ------ |
| `CHECKPOINT_THRESHOLD` | the WAL size threshold at which to automatically trigger a checkpoint | 16777216 |


#### Configure execution threads
```cypher
CALL THREADS=5;
```

#### Configure query timeout

```cypher
CALL TIMEOUT=3000;
```

#### Configure maximum depth of recursive extend

```cypher
CALL var_length_extend_max_depth=10;
```

#### Configure semi-mask optimization

```cypher
CALL enable_semi_mask=false;
```

#### Configure home directory
```cypher
CALL home_directory='/kuzu';
```

#### Configure file search path
```cypher
CALL file_search_path='/kuzu/file';
```

#### Configure progress bar
```cypher
CALL progress_bar=true;
```

#### Configure checkpoint threshold
```cypher
CALL checkpoint_threshold=16777216;
```