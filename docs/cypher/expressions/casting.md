---
title: Casting Functions
description: Casting functions are used to cast values from one type to another.
---

# Casting Functions

Kùzu supports casting through explicit casting functions `CAST(source, type)`.
```
RETURN CAST("[1,2,3]", "INT[]") AS l;
-----------
| l       |
-----------
| [1,2,3] |
-----------
RETURN CAST(2.3, "INT8") AS l;
-----
| l |
-----
| 2 |
-----
``` 

Not all casts are defined. For example, `INT[]` can not be casted to `INT`. Even if a cast is defined, it could still fail and throw a runtime exception. For example, cast `STRING` to `INT` is defined, but cast `"abc"` to `INT` will throw an exception.


**The follow cast functions are deprecated. We recommend to use `CAST(source, type)`.**

| Functions | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| date | cast STRING to DATE | DATE('2022-11-12') | 2022-11-12 (DATE) | 
| timestamp | cast STRING to timestamp | TIMESTAMP('2021-10-12 15:21:33') | 2021-10-12 15:21:33 (TIMESTAMP) |
| interval | cast STRING to INTERVAL | INTERVAL('5 DAYS 2 YEARS') | 2 years 4 days (INTERVAL) |
| string | cast ANY to STRING | STRING(561) | '561' |
| to_int8 | cast numerical types to INT8 | to_int8(5) | 5 |
| to_int16 | cast numerical types to INT16 | to_int16(5) | 5 |
| to_int32 | cast numerical types to INT32 | to_int32(5) | 5 |
| to_int64 | cast numerical types to INT64 | to_int64(5) | 5 |
| to_uint8 | cast numerical types to UINT8 | to_uint8(5) | 5 |
| to_uint16 | cast numerical types to UINT16 | to_uint16(5) | 5 |
| to_uint32 | cast numerical types to UINT32 | to_uint32(5) | 5 |
| to_uint64 | cast numerical types to UINT64 | to_uint64(5) | 5 |
| to_int128 | cast numerical types to INT128 | to_int128(5) | 5 |
| to_float | cast numerical types to FLOAT | to_float(5) | 5.000000 |
| to_double | cast numerical types to DOUBLE | to_double(5) | 5.000000 |
