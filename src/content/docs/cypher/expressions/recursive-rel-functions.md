---
title: Recursive relationship functions
description: Functions that are used to manipulate recursive relationships
---

| Function | Description |
| ----------- | ----------- |
| `NODES`| returns all nodes from a recursive relationship |
| `RELS` | returns all rels from a recursive relationship |
| `PROPERTIES` | return given property from nodes/relationships |
| `IS_TRAIL` | check if path contains repeated relationships |
| `IS_ACYCLIC` | check if path contains repeated nodes |
| `LENGTH` | returns the number of relationships (path length) in a recursive relationship |

### NODES

Returns all nodes from path.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `LIST[NODE]` |


```cypher
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN nodes(p);
```
Output:
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

Returns all relationships from a recursive relationship.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `LIST[REL]` |

```cypher
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN rels(p);
```
Output:
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

Return given property from nodes/relationships.

| Input type | Output type |
| ----------- | ----------- |
| `LIST[NODE/REL]`, `STRING` | `LIST[ANY]` |

```cypher
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

### IS_TRAIL

Check if a recursive relationship contains repeated relationships.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `BOOLEAN` |

```cypher
MATCH p = (a:User)-[:Follows*2..2]-(b:User) 
WHERE a.name='Adam' 
RETURN properties(rels(p), '_id'), is_trail(p);
```
Output
```
-----------------------------------------
| PROPERTIES(RELS(p),_id) | IS_TRAIL(p) |
-----------------------------------------
| [2:1,2:1]               | False       |
-----------------------------------------
| [2:0,2:0]               | False       |
-----------------------------------------
| [2:1,2:2]               | True        |
-----------------------------------------
| [2:0,2:2]               | True        |
-----------------------------------------
| [2:1,2:3]               | True        |
-----------------------------------------
```

### IS_ACYCLIC

Check if a recursive relationship contains repeated nodes.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `BOOLEAN` |

```cypher
MATCH p = (a:User)-[:Follows*2..2]-(b:User) 
WHERE a.name='Adam' 
RETURN properties(nodes(p), 'name'), is_acyclic(p);
```
Output:
```
---------------------------------------------
| PROPERTIES(NODES(p),name) | IS_ACYCLIC(p) |
---------------------------------------------
| [Adam,Zhang,Adam]         | False         |
---------------------------------------------
| [Adam,Karissa,Adam]       | False         |
---------------------------------------------
| [Adam,Zhang,Karissa]      | True          |
---------------------------------------------
| [Adam,Karissa,Zhang]      | True          |
---------------------------------------------
| [Adam,Zhang,Noura]        | True          |
---------------------------------------------
```

### LENGTH

Return the number of relationships (path length) in a recursive relationship.

```cypher
MATCH p = (a:User)-[f:Follows*1..2]->(b:User) 
RETURN LENGTH(p);
```
```
----------------
| LENGTH(p)    |
----------------
| 1            |
----------------
| 2            |
----------------
| 1            |
----------------
| 2            |
----------------
```

The `LENGTH` function when applied to a recursive relationship is shorthand for `SIZE(rels(p))`,
which also returns the same result.
