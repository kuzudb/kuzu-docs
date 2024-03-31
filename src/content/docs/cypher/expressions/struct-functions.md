---
title: Struct Functions
description: Struct functions are used to create and extract fields from structs.
---

Structs are commonly known as dictionaries or key-value pairs. The key is a string and the value
can be any data type. The following table lists the operators that can be used with structs. The
following operators work on structs:

<div class="scroll-table">

| Operator | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| `{key:value,}` | creates a struct of key-value pairs | `{name: 'Alice', age: 20}` | `{NAME: Alice, AGE: 20}` |
| `struct.field_name` | alias of struct_extract | `{name: 'Alice', age: 20}.name` | `'Alice'` |

</div>

The functions that can be used with structs are as follows:

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| `struct_extract(struct, 'field_name')` | extracts named field from struct | `struct_extract({name: 'Alice', age: 20}, 'name')` | `'Alice'` |

</div>