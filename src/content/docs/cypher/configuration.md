---
title: Connection configuration
---

The configuration of a connection to Kùzu database can be changed through a standalone `CALL`
statement, described in this section. Different from the `CALL` clause, this statement of changing
configuration **cannot** be used with other query clauses.

| Option | Description | Default |
| ----------- | --------------- |
| `THREADS` | number of threads used by execution | system maximum threads |
| `TIMEOUT` | timeout of query execution in ms | N/A |
| `VAR_LENGTH_EXTEND_MAX_DEPTH` | maximum depth of recursive extend | 30 |
| `ENABLE_SEMI_MASK` | enables the semi mask optimization | true |
| `HOME_DIRECTORY`| system home directory | |
| `FILE_SEARCH_PATH`| file search path | N/A | |
| `PROGRESS_BAR` | enable progress bar in CLI  |
| `PROGRESS_BAR_TIME` | show progress bar after time in ms  |

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