---
title: Path
sidebar_position: 7
---

# PATH
`PATH` is a logical type. Internally, `PATH` is processed as `STRUCT` type, more specifically, a `STRUCT{LIST[NODE], LIST[REL]}`. A `PATH` always contains a nodes field with key `_NODES` and a rels field with key `_RELS`.

### Return `PATH` column
```
MATCH p = (a:User)-[:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
RETURN p;
```
Output:
```
{_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name: Karissa, age: 40}], _RELS: [(0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1)]}
```

### Access all nodes on a path
```
MATCH p = (a:User)-[:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
RETURN nodes(p);
```
Output:
```
[{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name: Karissa, age: 40}]
```

### Access all rels on a path
```
MATCH p = (a:User)-[:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
RETURN rels(p);
```
Output:
```
[(0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1)]
```
