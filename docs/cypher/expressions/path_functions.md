---
title: Path Functions
description: Path functions are used to manipulate path.
---

# Path Functions

| Function | Description |
| ----------- | ----------- |
| NODES| returns all nodes from path |
| RELS | returns all rels from path |
| PROPERTIES | return given property from nodes/rels |


### NODES

Returns all nodes from path.

**Input Type**: `PATH`

**Output Type**: `LIST[NODE]`

```
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN nodes(p);
```
Output
```
------------------------------------------------------------------------------------
| NODES(p)                                                                         |
------------------------------------------------------------------------------------
| [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name:... |
------------------------------------------------------------------------------------
| [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name:... |
------------------------------------------------------------------------------------
| [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: User, name:... |
------------------------------------------------------------------------------------
| [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: User, name:... |
------------------------------------------------------------------------------------
```
### RELS

Returns all rels from path.

**Input Type**: `PATH`

**Output Type**: `LIST[REL]`

```
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN rels(p);
```
Output
```
------------------------------------------------------------------------------------
| RELS(p)                                                                          |
------------------------------------------------------------------------------------
| [(0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1)]                          |
------------------------------------------------------------------------------------
| [(0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1),(0:1)-{_LABEL: Follows... |
------------------------------------------------------------------------------------
| [(0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2)]                          |
------------------------------------------------------------------------------------
| [(0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2),(0:2)-{_LABEL: Follows... |
------------------------------------------------------------------------------------
```

### PROPERTIES

Return given property from nodes/rels.

**Input Type**: `LIST[NODE/REL]`, `STRING`

```
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN properties(nodes(p), 'name') AS name, properties(rels(p), 'since') AS since;
```
Output:
```
--------------------------------------
| name                 | since       |
--------------------------------------
| [Adam,Karissa]       | [2020]      |
--------------------------------------
| [Adam,Karissa,Zhang] | [2020,2021] |
--------------------------------------
| [Adam,Zhang]         | [2020]      |
--------------------------------------
| [Adam,Zhang,Noura]   | [2020,2022] |
--------------------------------------
```
