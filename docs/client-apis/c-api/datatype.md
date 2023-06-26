---
title: Data Type
sidebar_position: 5
---

## class kuzu_logical_type

kuzu_logical_type is the kuzu internal representation of data types.  

---

## class kuzu_date_t

kuzu internal date type which stores the number of days since 1970-01-01 00:00:00 UTC.  

---

## class kuzu_interval_t

kuzu internal interval type which stores the months, days and microseconds.  

---


## class kuzu_timestamp_t

kuzu internal timestamp type which stores the number of microseconds since 1970-01-01 00:00:00 UTC.  

---

## class kuzu_internal_id_t

kuzu internal internal_id type which stores the table_id and offset of a node/rel.  

---

```c++
KUZU_C_API kuzu_logical_type* kuzu_data_type_clone (kuzu_logical_type * data_type)
```
Creates a new data type instance by cloning the given data type instance. 

**Parameters**
- `data_type` The data type instance to clone. 

---

```c++
KUZU_C_API kuzu_logical_type* kuzu_data_type_create (kuzu_data_type_id id, kuzu_logical_type * child_type, uint64_t fixed_num_elements_in_list)
```
Creates a data type instance with the given id, childType and fixed_num_elements_in_list. Caller is responsible for destroying the returned data type instance. 

**Parameters**
- `id` The enum type id of the datatype to create. 
- `child_type` The child type of the datatype to create(only used for nested dataTypes). 
- `fixed_num_elements_in_list` The fixed number of elements in the list(only used for FIXED_LIST). 

---

```c++
KUZU_C_API void kuzu_data_type_destroy (kuzu_logical_type * data_type)
```
Destroys the given data type instance. 

**Parameters**
- `data_type` The data type instance to destroy. 

---

```c++
KUZU_C_API bool kuzu_data_type_equals (kuzu_logical_type * data_type1, kuzu_logical_type * data_type2)
```
Returns true if the given data type is equal to the other data type, false otherwise. 

**Parameters**
- `data_type1` The first data type instance to compare. 
- `data_type2` The second data type instance to compare. 

---

```c++
KUZU_C_API uint64_t kuzu_data_type_get_fixed_num_elements_in_list (kuzu_logical_type * data_type)
```
Returns the number of elements per list for fixedSizeList. 

**Parameters**
- `data_type` The data type instance to return. 

---

```c++
KUZU_C_API kuzu_data_type_id kuzu_data_type_get_id (kuzu_logical_type * data_type)
```
Returns the enum type id of the given data type. 

**Parameters**
- `data_type` The data type instance to return. 

---
