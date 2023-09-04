---
title: DataType
sidebar_position: 1
---

# DataTypes

There are two data type classes in Kùzu, `LogicalType` and `PhysicalType`

## LogicalType

Logical type refers to how data is conceptually organized during query compilation. Logical type does NOT care how data is actually stored and processed during query execution.




without physical storage details. It's important to note that two different logical types may share the same physical storage layout, yet they represent the stored data differently at the logical layer.

## PhysicalType


Logical Type: 

For instance, consider the example of INT32 and DATE in Kuzu. Both of these are logical types, and they happen to share the same physical storage layout, which is INT32. However, at the logical layer, they provide distinct interpretations and representations of the data.


Physical Type: refers to the specific format and organization of data as it is physically stored in the storage layer of kuzu. It defines how data should be structured and stored within the storage medium. It's important to note that different logical types can sometimes share the same physical type when they are stored in an identical format in the storage layer.

Distinction between physical and logical types: While logical types determine how data is perceived and used at the application level, physical types govern the underlying storage details, ensuring data is efficiently stored, retrieved, and managed within the storage medium.