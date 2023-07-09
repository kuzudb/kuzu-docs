---
title: Value
sidebar_position: 5
---

# Value
`Value` can hold data of different types.

## Available APIs
## class kuzu::common::NodeVal

NodeVal represents a node in the graph and stores the nodeID, label and properties of that node.  

---
**NodeVal**

```c++
NodeVal (std::unique_ptr< Value > idVal, std::unique_ptr< Value > labelVal)
```
Constructs the NodeVal object with the given idVal and labelVal. 

**Parameters**
- `idVal` the nodeID value. 
- `labelVal` the name of the node. 

---
**NodeVal**

```c++
NodeVal (const NodeVal & other)
```
Constructs the NodeVal object from the other. 

**Parameters**
- `other` the NodeVal to copy from. 

---
**addProperty**

```c++
void addProperty (const std::string & key, std::unique_ptr< Value > value)
```
Adds a property with the given {key,value} pair to the NodeVal. 

**Parameters**
- `key` the name of the property. 
- `value` the value of the property. 

---
**copy**

```c++
std::unique_ptr<NodeVal> copy ()
```

**Returns:**
- a copy of the current node. 

---
**getLabelName**

```c++
std::string getLabelName ()
```

**Returns:**
- the name of the node in string format. 

---
**getLabelVal**

```c++
Value* getLabelVal ()
```

**Returns:**
- the name of the node as a Value. 

---
**getNodeID**

```c++
nodeID_t getNodeID ()
```

**Returns:**
- the nodeID of the node as a nodeID struct. 

---
**getNodeIDVal**

```c++
Value* getNodeIDVal ()
```

**Returns:**
- the nodeID as a Value. 

---
**getProperties**

```c++
const std::vector<std::pair<std::string, std::unique_ptr<Value> > >& getProperties ()
```

**Returns:**
- all properties of the NodeVal. 

---
**toString**

```c++
std::string toString ()
```

**Returns:**
- the current node values in string format. 

---

## class kuzu::common::RelVal

RelVal represents a rel in the graph and stores the relID, src/dst nodes and properties of that rel.  

---
**RelVal**

```c++
RelVal (std::unique_ptr< Value > srcNodeIDVal, std::unique_ptr< Value > dstNodeIDVal, std::unique_ptr< Value > labelVal)
```
Constructs the RelVal based on the srcNodeIDVal, dstNodeIDVal and labelVal. 

**Parameters**
- `srcNodeIDVal` the src node. 
- `dstNodeIDVal` the dst node. 
- `labelVal` the name of the rel. 

---
**RelVal**

```c++
RelVal (const RelVal & other)
```
Constructs a RelVal from other. 

**Parameters**
- `other` the RelVal to copy from. 

---
**addProperty**

```c++
void addProperty (const std::string & key, std::unique_ptr< Value > value)
```
Adds a property with the given {key,value} pair to the RelVal. 

**Parameters**
- `key` the name of the property. 
- `value` the value of the property. 

---
**copy**

```c++
std::unique_ptr<RelVal> copy ()
```

**Returns:**
- a copy of the RelVal. 

---
**getDstNodeID**

```c++
nodeID_t getDstNodeID ()
```

**Returns:**
- the dst nodeID value of the RelVal as nodeID struct. 

---
**getDstNodeIDVal**

```c++
Value* getDstNodeIDVal ()
```

**Returns:**
- the dst nodeID value of the RelVal in Value. 

---
**getLabelName**

```c++
std::string getLabelName ()
```

**Returns:**
- the name of the RelVal. 

---
**getProperties**

```c++
const std::vector<std::pair<std::string, std::unique_ptr<Value> > >& getProperties ()
```

**Returns:**
- all properties of the RelVal. 

---
**getSrcNodeID**

```c++
nodeID_t getSrcNodeID ()
```

**Returns:**
- the src nodeID value of the RelVal as nodeID struct. 

---
**getSrcNodeIDVal**

```c++
Value* getSrcNodeIDVal ()
```

**Returns:**
- the src nodeID value of the RelVal in Value. 

---
**toString**

```c++
std::string toString ()
```

**Returns:**
- the value of the RelVal in string format. 

---

## class kuzu::common::Value



---
**Value**

```c++
Value (bool val_)
```

**Parameters**
- `val_` the boolean value to set. 

**Returns:**
- a Value with BOOL type and val_ value. 

---
**Value**

```c++
Value (int32_t val_)
```

**Parameters**
- `val_` the int64_t value to set. 

**Returns:**
- a Value with INT64 type and val_ value. 

---
**Value**

```c++
Value (int64_t val_)
```

**Parameters**
- `val_` the int64_t value to set. 

**Returns:**
- a Value with INT64 type and val_ value. 

---
**Value**

```c++
Value (double val_)
```

**Parameters**
- `val_` the double value to set. 

**Returns:**
- a Value with DOUBLE type and val_ value. 

---
**Value**
```c++
Value (date_t val_)
```

**Parameters**
- `val_` the date value to set. 

**Returns:**
- a Value with DATE type and val_ value. 

---
**Value**

```c++
Value (timestamp_t val_)
```

**Parameters**
- `val_` the timestamp value to set. 

**Returns:**
- a Value with timestamp type and val_ value. 

---
**Value**

```c++
Value (interval_t val_)
```

**Parameters**
- `val_` the interval value to set. 

**Returns:**
- a Value with INTERVAL type and val_ value. 

---
**Value**

```c++
Value (internalID_t val_)
```

**Parameters**
- `val_` the internalID value to set. 

**Returns:**
- a Value with INTERNAL_ID type and val_ value. 

---
**Value**

```c++
Value (const char * val_)
```

**Parameters**
- `val_` the string value to set. 

**Returns:**
- a Value with STRING type and val_ value. 

---
**Value**

```c++
Value (const std::string & val_)
```

**Parameters**
- `val_` the string value to set. 

**Returns:**
- a Value with STRING type and val_ value. 

---
**Value**

```c++
Value (DataType dataType, std::vector< std::unique_ptr< Value >> vals)
```

**Parameters**
- `vals` the list value to set. 

**Returns:**
- a Value with dataType type and vals value. 

---
**Value**

```c++
Value (std::unique_ptr< NodeVal > val_)
```

**Parameters**
- `val_` the node value to set. 

**Returns:**
- a Value with NODE type and val_ value. 

---
**Value**

```c++
Value (std::unique_ptr< RelVal > val_)
```

**Parameters**
- `val_` the rel value to set. 

**Returns:**
- a Value with REL type and val_ value. 

---
**Value**

```c++
Value (DataType dataType, const uint8_t * val_)
```

**Parameters**
- `val_` the value to set. 

**Returns:**
- a Value with dataType type and val_ value. 

---
**Value**

```c++
Value (const Value & other)
```

**Parameters**
- `other` the value to copy from. 

**Returns:**
- a Value with the same value as other. 

---
**copy**

```c++
std::unique_ptr<Value> copy ()
```

**Returns:**
- a copy of the current value. 

---
**copyValueFrom**

```c++
void copyValueFrom (const uint8_t * value)
```
Copies from the value. 

**Parameters**
- `value` value to copy from. 

---
**copyValueFrom**

```c++
void copyValueFrom (const Value & other)
```
Copies from the other. 

**Parameters**
- `other` value to copy from. 

---
**createDefaultValue**

```c++
static Value createDefaultValue (const DataType & dataType)
```

**Parameters**
- `dataType` the type of the non-NULL value. 

**Returns:**
- a default non-NULL value of the given type. 

---
**createNullValue**

```c++
static Value createNullValue ()
```

**Returns:**
- a NULL value of ANY type. 

---
**createNullValue**

```c++
static Value createNullValue (DataType dataType)
```

**Parameters**
- `dataType` the type of the NULL value. 

**Returns:**
- a NULL value of the given type. 

---
**createValue**

```c++
template<class T > static Value createValue (T value)
```

**Parameters**
- `value` the value to Value object. 

**Returns:**
- a Value object based on value. 

---
**createValue**

```c++
template<> Value createValue (bool val)
```

**Parameters**
- `val` the boolean value 

**Returns:**
- a Value with BOOL type and val value. 

---
**createValue**

```c++
template<> Value createValue (int64_t val)
```

**Parameters**
- `val` the int64 value 

**Returns:**
- a Value with INT64 type and val value. 

---
**createValue**

```c++
template<> Value createValue (double val)
```

**Parameters**
- `val` the double value 

**Returns:**
- a Value with DOUBLE type and val value. 

---
**createValue**

```c++
template<> Value createValue (date_t val)
```

**Parameters**
- `val` the date_t value 

**Returns:**
- a Value with DATE type and val value. 

---
**createValue**

```c++
template<> Value createValue (timestamp_t val)
```

**Parameters**
- `val` the timestamp_t value 

**Returns:**
- a Value with TIMESTAMP type and val value. 

---
**createValue**

```c++
template<> Value createValue (interval_t val)
```

**Parameters**
- `val` the interval_t value 

**Returns:**
- a Value with INTERVAL type and val value. 

---
**createValue**

```c++
template<> Value createValue (nodeID_t val)
```

**Parameters**
- `val` the nodeID_t value 

**Returns:**
- a Value with NODE_ID type and val value. 

---
**createValue**

```c++
template<> Value createValue (std::string val)
```

**Parameters**
- `val` the string value 

**Returns:**
- a Value with STRING type and val value. 

---
**createValue**

```c++
template<> Value createValue (const std::string & val)
```

**Parameters**
- `val` the string value 

**Returns:**
- a Value with STRING type and val value. 

---
**createValue**

```c++
template<> Value createValue (const char * value)
```

**Parameters**
- `val` the string value 

**Returns:**
- a Value with STRING type and val value. 

---
**getDataType**

```c++
DataType getDataType ()
```

**Returns:**
- the dataType of the value. 

---
**getListValReference**

```c++
const std::vector<std::unique_ptr<Value> >& getListValReference ()
```

**Returns:**
- a reference to the list value. 

---
**getValue**

```c++
template<class T > T getValue ()
```

**Returns:**
- the value of the given type. 

---
**getValue**

```c++
template<> bool getValue ()
```

**Returns:**
- boolean value. 

---
**getValue**

```c++
template<> int64_t getValue ()
```

**Returns:**
- int64 value. 

---
**getValue**

```c++
template<> double getValue ()
```

**Returns:**
- double value. 

---
**getValue**

```c++
template<> date_t getValue ()
```

**Returns:**
- date_t value. 

---
**getValue**

```c++
template<> timestamp_t getValue ()
```

**Returns:**
- timestamp_t value. 

---
**getValue**

```c++
template<> interval_t getValue ()
```

**Returns:**
- interval_t value. 

---
**getValue**

```c++
template<> internalID_t getValue ()
```

**Returns:**
- internal_t value. 

---
**getValue**

```c++
template<> std::string getValue ()
```

**Returns:**
- string value. 

---
**getValue**

```c++
template<> NodeVal getValue ()
```

**Returns:**
- NodeVal value. 

---
**getValue**

```c++
template<> RelVal getValue ()
```

**Returns:**
- RelVal value. 

---
**getValueReference**

```c++
template<class T > T& getValueReference ()
```

**Returns:**
- a reference to the value of the given type. 

---
**getValueReference**

```c++
template<> bool& getValueReference ()
```

**Returns:**
- the reference to the boolean value. 

---
**getValueReference**

```c++
template<> int64_t& getValueReference ()
```

**Returns:**
- the reference to the int64 value. 

---
**getValueReference**

```c++
template<> double& getValueReference ()
```

**Returns:**
- the reference to the double value. 

---
**getValue**

```c++
template<> date_t& getValueReference ()
```

**Returns:**
- the reference to the date value. 

---
**getValueReference**

```c++
template<> timestamp_t& getValueReference ()
```

**Returns:**
- the reference to the timestamp value. 

---
**getValueReference**

```c++
template<> interval_t& getValueReference ()
```

**Returns:**
- the reference to the interval value. 

---
**getValueReference**

```c++
template<> nodeID_t& getValueReference ()
```

**Returns:**
- the reference to the internal_id value. 

---
**getValueReference**

```c++
template<> std::string& getValueReference ()
```

**Returns:**
- the reference to the string value. 

---
**getValueReference**

```c++
template<> NodeVal& getValueReference ()
```

**Returns:**
- the reference to the NodeVal value. 

---
**getValueReference**

```c++
template<> RelVal& getValueReference ()
```

**Returns:**
- the reference to the RelVal value. 

---
**isNull**

```c++
bool isNull ()
```

**Returns:**
- whether the Value is null or not. 

---
**setDataType**

```c++
void setDataType (const DataType & dataType_)
```
Sets the data type of the Value. 

**Parameters**
- `dataType_` the data type to set to. 

---
**setNull**

```c++
void setNull (bool flag)
```
Sets the null flag of the Value. 

**Parameters**
- `flag` null value flag to set. 

---
**toString**

```c++
std::string toString ()
```

**Returns:**
- the current value in string format. 

---
