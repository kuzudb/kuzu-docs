---
title: Array functions
description: Array functions are used specifically to transform or manipulate arrays.
---

This section provides an overview of functions that are specifically designed to work with
`ARRAY` data types. An example of such a class of functions are similarity search functions,
like dot product or cosine similarity. The full list of functions is provided in the table below.

:::caution[Note]
Scroll to the right to see the example usage in the below table.
:::

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| `array_value(arg1, arg2, arg3..)` | creates an array containing the argument values | `array_value(1,2,3,4,5,56,2)` | `[1,2,3,4,5,56,2]` |
| `array_dot_product(array1, array2)` | calculates the dot product of two arrays | `array_dot_product([1,2,3], [4,5,6])` | `32` |
| `array_inner_product(array1, array2)` | calculates the inner product of two arrays | `array_inner_product([1,2,3], [4,5,6])` | `32` |
| `array_cross_product(array1, array2)` | calculates the cross product of two arrays | `array_cross_product([1,2,3], [4,5,6])` | `[[-3,6,-3],[6,-12,6],[-3,6,-3]]` |
| `array_cosine_similarity(array1, array2)` | calculates the cosine similarity of two arrays | `array_cosine_similarity([1,2,3], [4,5,6])` | `0.9746318461970762` |

</div>
