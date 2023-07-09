---
title: Tuple
sidebar_position: 4
---

# FlatTuple
`FlatTuple` stores a vector of values.


## Available APIs
## class kuzu::processor::FlatTuple

Stores a vector of Values.  

---
**getValue**

```c++
common::Value* getValue (uint32_t idx)
```

**Parameters**
- `idx` value index to get. 

**Returns:**
- the value stored at idx. 

---
**len**

```c++
uint32_t len ()
```

**Returns:**
- number of values in the FlatTuple. 

---
**toString**

```c++
std::string toString (const std::vector< uint32_t > & colsWidth, const std::string & delimiter = '|', uint32_t maxWidth = -1)
```

**Parameters**
- `colsWidth` The length of each column 
- `delimiter` The delimiter to separate each value. 
- `maxWidth` The maximum length of each column. Only the first maxWidth number of characters of each column will be displayed. 

**Returns:**
- all values in string format. 

---
