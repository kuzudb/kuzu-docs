---
title: Map Functions
description: Map functions are used to create and manipulate maps.
---

# Map Functions

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| map(keys, values) | create a map | map([1, 2], ['a', 'b']) | {1=a, 2=b} |
| map_extract(map, key) | returning a list containing the value for given key or empty list if key is not found | map_extract(map([1, 2], ['a', 'b']), 1) | ['a'] |
| element_at(map, key) | alias of map_extract | element_at(map([1, 2], ['a', 'b']), 1) | ['a'] |
| cardinality(map) | returns the size of the map | cardinality(map([1, 2], ['a', 'b'])) | 2 |
| map_keys(map) | returns all keys in the map | map_keys(map([1, 2], ['a', 'b'])) | [1,2] |
| map_values(map) | returns all values in the map | map_values(map([1, 2], ['a', 'b'])) | [a,b] |
