---
title: Vector types
---

## ValueVector

Value vector is Kùzu's column-oriented in-memory data structure to store a chunk of data of the same data type. The size of `ValueVector` is defined by `DEFAULT_VECTOR_CAPACITY`, which is 2048. This is an empirically selected value with the presumption that the data stored in the value vector will fit into CPU cache.

A value vector has the following core fields:
- `data`: Stores the actual data which is a trivial byte array managed by a unique pointer. 
- `nullMask`: Aligned with `data` and indicate if each entry is `NULL` or not.
- `auxilaryBuffer`: Keeps track of additional data that does NOT fit in `data`.

#### Primitive Type ValueVector

For primitive data type, we can represent data in the `data` field, for example, to represent 0 to 99 elements with `INT64` data type, `data` is simply a `int64_t[]` with size 100.

#### String Type ValueVector

Earlier versions of the storage layer required each element to have a fixed size. This however, does NOT work with the `STRING` type, whose size may vary. We implement `STRING` as a 16 byte data structure with first 8 bytes as prefix and last 8 bytes as a pointer that points to a memory location storing the rest of string. The fixed length part of `STRING` is stored in `data` and the overflow part is stored in `auxiliaryBuffer`.

#### Nested Type ValueVector

Although nested type value vectors can be organized as overflow in the same way as `STRING`, we want to utilize the fact that the child type of a nested type is known and can still be stored in column-oriented value vector.

For `STRUCT` type, we store children vectors in `auxilaryBuffer`.

Example:

```
Data to represent:
    [{11,12}, {13,14}, {15,16}]

STRUCT value vector
    data: [0, 1, 2] // offset
    auxilaryBuffer:
        child vector:
            data: [11, 13, 15]
        child vector
            data: [12, 14, 16]
```

For `VAR_LIST` type, we store size and offset of each entry in `data` and elements in `auxilaryBuffer`.

Example:
```
Data to represent:
    [[10], [11,12], [13,14,15]]

List value vector
    data: [(0,1), (1,2), (3,3)] // offset,size
    auxilaryBuffer:
        child vector:
            data: [10,11,12,13,14,15]
```

## SelectionState

Selection state keeps track of data that are valid. This is mainly used to select a subset of data (e.g. data that satisfy a filter) without performing a copy.

A selection state has the following core fields:
- `selectedPositions`: a vector of `uint16_t` that maps to a position of `data` vector.
- `selectedSize`: size of selected positions

Example:

```
Value vector
    data: [10, 11, 12, 13, 14]

Selection state:
    selectedPositions: [0, 2]
    selectedSize: 2

Data being represented:
    [10, 12]
```

## DataChunk

A data chunk is a collection of value vector with the same state.

Example:

```
Data chunk
    Value vector: [1, 2, 3]
    Value vector: [a, b, c]


Data being represented:
[(1,a), (2,b), (3,c)]
```

## ResultSet

A result set is a collection of data chunks that forms a cartesian product.

Example:
```
Result set
    Data chunk
        Value vector: [1, 2, 3]
        Value vector: [a, b, c]
    Data Chunk
        Value vector: [10, 11]

Data being represented:
    [(1,a,10), (2,b,10), (3,c,10), (1,a,11), (2,b,11), (3,c,11)]
```
