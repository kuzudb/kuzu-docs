---
title: DataType
sidebar_position: 1
---

# DataTypes

There are two data type classes in Kùzu, `LogicalType` and `PhysicalType`.

## LogicalType

Logical type refers to how data is conceptually organized. Logical type does NOT care how data is actually stored. Different logical types may have the same physical type during storage/query processing, e.g. both `INT32` and `DATE` logical type will have `INT32` physical type.

During query compilation i.e. parsing, binding and planning, logical type should always be used.


## PhysicalType

Physical type refers to the specific format of data as it is physically stored on disk and in memory.

Physical type is preferred in storage and query processing. E.g. columns are constructed based on physical types. comparison operators only care about the physical types. Using physical type is not mandatory, if you need to make a distinction between logical types, then you will need to fall back to logical type.
