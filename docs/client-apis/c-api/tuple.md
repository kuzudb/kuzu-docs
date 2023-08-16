---
title: Tuple
sidebar_position: 3
---

## struct kuzu_flat_tuple

kuzu_flat_tuple stores a vector of values.  

---

```c
void kuzu_flat_tuple_destroy (kuzu_flat_tuple * flat_tuple)
```
Destroys the given flat tuple instance. 

**Parameters**
- `flat_tuple` The flat tuple instance to destroy. 

---

```c
kuzu_value* kuzu_flat_tuple_get_value (kuzu_flat_tuple * flat_tuple, uint64_t index)
```
Returns the value at index of the flat tuple. 

**Parameters**
- `flat_tuple` The flat tuple instance to return. 
- `index` The index of the value to return. 

---

```c
char* kuzu_flat_tuple_to_string (kuzu_flat_tuple * flat_tuple)
```
Converts the flat tuple to a string. 

**Parameters**
- `flat_tuple` The flat tuple instance to convert. 

---