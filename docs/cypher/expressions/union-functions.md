---
title: Union Functions
description: Union functions are used to create and extract union.
---

# Union Functions

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| union_value(tag := value) | create a union with given value | union_value(a := 1) | 1 |
| union_tag(union) | return the tag of union | union_tag(union_value(a := 1)) | a |
| union_extract(union, tag) | return the value for given tag | union_extract(union_value(a := 1), 'a') | 1 |
