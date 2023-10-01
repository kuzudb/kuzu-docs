---
title: Value
sidebar_position: 4
---

## struct kuzu_node_val

kuzu internal node type which stores the nodeID, label and properties of a node in graph.  

---

## struct kuzu_rel_val

kuzu internal rel type which stores the relID, src/dst nodes and properties of a rel in graph.  

---

## struct kuzu_value

kuzu_value is used to represent a value with any kuzu internal dataType.  

---



```c++
KUZU_C_API kuzu_internal_id_t kuzu_node_val_get_id (kuzu_value * node_val)
```
Returns the internal id value of the given node value as internal_id. 

**Parameters**
- `node_val` The node value to return. 

---

```c++
KUZU_C_API kuzu_value* kuzu_node_val_get_id_val (kuzu_value * node_val)
```
Returns the internal id value of the given node value as a kuzu value. 

**Parameters**
- `node_val` The node value to return. 

---

```c++
KUZU_C_API char* kuzu_node_val_get_label_name (kuzu_value * node_val)
```
Returns the label value of the given node value as string. 

**Parameters**
- `node_val` The node value to return. 

---

```c++
KUZU_C_API kuzu_value* kuzu_node_val_get_label_val (kuzu_value * node_val)
```
Returns the label value of the given node value as a label value. 

**Parameters**
- `node_val` The node value to return. 

---

```c++
KUZU_C_API char* kuzu_node_val_get_property_name_at (kuzu_value * node_val, uint64_t index)
```
Returns the property name of the given node value at the given index. 

**Parameters**
- `node_val` The node value to return. 
- `index` The index of the property. 

---

```c++
KUZU_C_API uint64_t kuzu_node_val_get_property_size (kuzu_value * node_val)
```
Returns the number of properties of the given node value. 

**Parameters**
- `node_val` The node value to return. 

---

```c++
KUZU_C_API kuzu_value* kuzu_node_val_get_property_value_at (kuzu_value * node_val, uint64_t index)
```
Returns the property value of the given node value at the given index. 

**Parameters**
- `node_val` The node value to return. 
- `index` The index of the property. 

---

```c++
KUZU_C_API char* kuzu_node_val_to_string (kuzu_value * node_val)
```
Converts the given node value to string. 

**Parameters**
- `node_val` The node value to convert. 

---

```c++
KUZU_C_API kuzu_internal_id_t kuzu_rel_val_get_dst_id (kuzu_value * rel_val)
```
Returns the internal id value of the destination node of the given rel value. 

**Parameters**
- `rel_val` The rel value to return. 

---

```c++
KUZU_C_API kuzu_value* kuzu_rel_val_get_dst_id_val (kuzu_value * rel_val)
```
Returns the internal id value of the destination node of the given rel value as a kuzu value. 

**Parameters**
- `rel_val` The rel value to return. 

---

```c++
KUZU_C_API char* kuzu_rel_val_get_label_name (kuzu_value * rel_val)
```
Returns the label of the given rel value. 

**Parameters**
- `rel_val` The rel value to return. 

---

```c++
KUZU_C_API char* kuzu_rel_val_get_property_name_at (kuzu_value * rel_val, uint64_t index)
```
Returns the property name of the given rel value at the given index. 

**Parameters**
- `rel_val` The rel value to return. 
- `index` The index of the property. 

---

```c++
KUZU_C_API uint64_t kuzu_rel_val_get_property_size (kuzu_value * rel_val)
```
Returns the number of properties of the given rel value. 

**Parameters**
- `rel_val` The rel value to return. 

---

```c++
KUZU_C_API kuzu_value* kuzu_rel_val_get_property_value_at (kuzu_value * rel_val, uint64_t index)
```
Returns the property of the given rel value at the given index as kuzu value. 

**Parameters**
- `rel_val` The rel value to return. 
- `index` The index of the property. 

---

```c++
KUZU_C_API kuzu_internal_id_t kuzu_rel_val_get_src_id (kuzu_value * rel_val)
```
Returns the internal id value of the source node of the given rel value. 

**Parameters**
- `rel_val` The rel value to return. 

---

```c++
KUZU_C_API kuzu_value* kuzu_rel_val_get_src_id_val (kuzu_value * rel_val)
```
Returns the internal id value of the source node of the given rel value as a kuzu value. 

**Parameters**
- `rel_val` The rel value to return. 

---

```c++
KUZU_C_API char* kuzu_rel_val_to_string (kuzu_value * rel_val)
```
Converts the given rel value to string. 

**Parameters**
- `rel_val` The rel value to convert. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_clone (kuzu_value * value)
```
Creates a new value based on the given value. Caller is responsible for destroying the returned value. 

**Parameters**
- `value` The value to create from. 

---

```c++
KUZU_C_API void kuzu_value_copy (kuzu_value * value, kuzu_value * other)
```
Copies the other value to the value. 

**Parameters**
- `value` The value to copy to. 
- `other` The value to copy from. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_bool (bool val_)
```
Creates a value with boolean type and the given bool value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The bool value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_date (kuzu_date_t val_)
```
Creates a value with date type and the given date value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The date value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_default (kuzu_logical_type * data_type)
```
Creates a value of the given data type with default non-NULL value. Caller is responsible for destroying the returned value. 

**Parameters**
- `data_type` The data type of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_double (double val_)
```
Creates a value with double type and the given double value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The double value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_float (float val_)
```
Creates a value with float type and the given float value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The float value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_int16 (int16_t val_)
```
Creates a value with int16 type and the given int16 value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The int16 value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_int32 (int32_t val_)
```
Creates a value with int32 type and the given int32 value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The int32 value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_int64 (int64_t val_)
```
Creates a value with int64 type and the given int64 value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The int64 value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_int8 (int8_t val_)
```
Creates a value with int8 type and the given int8 value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The int8 value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_internal_id (kuzu_internal_id_t val_)
```
Creates a value with internal_id type and the given internal_id value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The internal_id value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_interval (kuzu_interval_t val_)
```
Creates a value with interval type and the given interval value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The interval value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_null_with_data_type (kuzu_logical_type * data_type)
```
Creates a value of the given data type. Caller is responsible for destroying the returned value. 

**Parameters**
- `data_type` The data type of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_string (const char * val_)
```
Creates a value with string type and the given string value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The string value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_timestamp (kuzu_timestamp_t val_)
```
Creates a value with timestamp type and the given timestamp value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The timestamp value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_uint16 (uint16_t val_)
```
Creates a value with uint16 type and the given uint16 value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The uint16 value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_uint32 (uint32_t val_)
```
Creates a value with uint32 type and the given uint32 value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The uint32 value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_uint64 (uint64_t val_)
```
Creates a value with uint64 type and the given uint64 value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The uint64 value of the value to create. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_create_uint8 (uint8_t val_)
```
Creates a value with uint8 type and the given uint8 value. Caller is responsible for destroying the returned value. 

**Parameters**
- `val_` The uint8 value of the value to create. 

---

```c++
KUZU_C_API void kuzu_value_destroy (kuzu_value * value)
```
Destroys the value. 

**Parameters**
- `value` The value to destroy. 

---

```c++
KUZU_C_API uint8_t* kuzu_value_get_blob (kuzu_value * value)
```
Returns the blob value of the given value. The returned buffer is null-terminated similar to a string. The value must be of type BLOB. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API bool kuzu_value_get_bool (kuzu_value * value)
```
Returns the boolean value of the given value. The value must be of type BOOL. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API kuzu_logical_type* kuzu_value_get_data_type (kuzu_value * value)
```
Returns internal type of the given value. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API kuzu_date_t kuzu_value_get_date (kuzu_value * value)
```
Returns the date value of the given value. The value must be of type DATE. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API double kuzu_value_get_double (kuzu_value * value)
```
Returns the double value of the given value. The value must be of type DOUBLE. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API float kuzu_value_get_float (kuzu_value * value)
```
Returns the float value of the given value. The value must be of type FLOAT. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API int16_t kuzu_value_get_int16 (kuzu_value * value)
```
Returns the int16 value of the given value. The value must be of type INT16. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API int32_t kuzu_value_get_int32 (kuzu_value * value)
```
Returns the int32 value of the given value. The value must be of type INT32. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API int64_t kuzu_value_get_int64 (kuzu_value * value)
```
Returns the int64 value of the given value. The value must be of type INT64 or SERIAL. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API int8_t kuzu_value_get_int8 (kuzu_value * value)
```
Returns the int8 value of the given value. The value must be of type INT8. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API kuzu_internal_id_t kuzu_value_get_internal_id (kuzu_value * value)
```
Returns the internal id value of the given value. The value must be of type INTERNAL_ID. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API kuzu_interval_t kuzu_value_get_interval (kuzu_value * value)
```
Returns the interval value of the given value. The value must be of type INTERVAL. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_get_list_element (kuzu_value * value, uint64_t index)
```
Returns the element at index of the given value. The value must be of type VAR_LIST. 

**Parameters**
- `value` The VAR_LIST value to return. 
- `index` The index of the element to return. 

---

```c++
KUZU_C_API uint64_t kuzu_value_get_list_size (kuzu_value * value)
```
Returns the number of elements per list of the given value. The value must be of type FIXED_LIST. 

**Parameters**
- `value` The FIXED_LIST value to get list size. 

---

```c++
KUZU_C_API char* kuzu_value_get_string (kuzu_value * value)
```
Returns the string value of the given value. The value must be of type STRING. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API char* kuzu_value_get_struct_field_name (kuzu_value * value, uint64_t index)
```
Returns the field name at index of the given struct value. The value must be of physical type STRUCT (STRUCT, NODE, REL, RECURSIVE_REL, UNION). 

**Parameters**
- `value` The STRUCT value to get field name. 
- `index` The index of the field name to return. 

---

```c++
KUZU_C_API kuzu_value* kuzu_value_get_struct_field_value (kuzu_value * value, uint64_t index)
```
Returns the field value at index of the given struct value. The value must be of physical type STRUCT (STRUCT, NODE, REL, RECURSIVE_REL, UNION). 

**Parameters**
- `value` The STRUCT value to get field value. 
- `index` The index of the field value to return. 

---

```c++
KUZU_C_API uint64_t kuzu_value_get_struct_num_fields (kuzu_value * value)
```
Returns the number of fields of the given struct value. The value must be of type STRUCT. 

**Parameters**
- `value` The STRUCT value to get number of fields. 

---

```c++
KUZU_C_API kuzu_timestamp_t kuzu_value_get_timestamp (kuzu_value * value)
```
Returns the timestamp value of the given value. The value must be of type TIMESTAMP. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API uint16_t kuzu_value_get_uint16 (kuzu_value * value)
```
Returns the uint16 value of the given value. The value must be of type UINT16. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API uint32_t kuzu_value_get_uint32 (kuzu_value * value)
```
Returns the uint32 value of the given value. The value must be of type UINT32. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API uint64_t kuzu_value_get_uint64 (kuzu_value * value)
```
Returns the uint64 value of the given value. The value must be of type UINT64. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API uint8_t kuzu_value_get_uint8 (kuzu_value * value)
```
Returns the uint8 value of the given value. The value must be of type UINT8. 

**Parameters**
- `value` The value to return. 

---

```c++
KUZU_C_API bool kuzu_value_is_null (kuzu_value * value)
```
Returns true if the given value is NULL, false otherwise. 

**Parameters**
- `value` The value instance to check. 

---

```c++
KUZU_C_API void kuzu_value_set_null (kuzu_value * value, bool is_null)
```
Sets the given value to NULL or not. 

**Parameters**
- `value` The value instance to set. 
- `is_null` True if sets the value to NULL, false otherwise. 

---

```c++
KUZU_C_API char* kuzu_value_to_string (kuzu_value * value)
```
Converts the given value to string. 

**Parameters**
- `value` The value to convert. 

---
