---
title: UUID
sidebar_position: 15
---

# UUID

The data type `UUID` stores Universally Unique Identifiers (UUID) as defined by RFC 4122, ISO/IEC 9834-8:2005, and related standards. Kuzu follows the [PostgreSQL's implementation](https://www.postgresql.org/docs/13/datatype-uuid.html) for the format of specifying `UUID`.


### `UUID` creation
```
RETURN UUID('A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11') as result;
```
Output:
```
---------------------------------------------
| result                                    |
---------------------------------------------
| a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11      |
---------------------------------------------
```
