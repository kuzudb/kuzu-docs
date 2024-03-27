---
title: Numeric operators
description: Numeric operators are used to perform operations on numeric data types.
---

Numeric operators are used to perform operations on numeric data types.

| Operator | Description | Example | Result |
| :-----------: | ----------- |  ----------- |  ----------- |
| + | addition | `2 + 3.5` | `5.5 `|
| - | subtraction | `4.5 - 2` | `2.5` |
| * | multiplication | `3.2 * 2` | `6.4` |
| / | division | `9 / 5` | `1` |
| % | module(remainder) | `9 % 5` | `4` |
| ^ | power | `4 ^ 5` | `1024.0` |

Appropriate types are cast wherever possible. For example, in `9 / 5`, the result is `1` because both operands
are integers. In `9.0 / 5`, the result is `1.8` because one of the operands is a float.

:::danger[Note]
The following numeric operators are not supported:
`**`, `&`, `|`, `<<`, `>>`, `!`
:::
