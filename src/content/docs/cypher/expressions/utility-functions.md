---
title: Utility functions
description: Utility functions are used to perform miscellaneous operations and transformations.
---

This section is to provide an overview of specific functions that are difficult to categorize,
but are broadly useful.

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| `coalesce(element1, element2)` | returns the first non-NULL value from the list of elements | `coalesce(NULL, 'a', NULL)` | `'a'` |
| `ifnull(element1, element2)` | a two-argument version of coalesce | `ifnull(NULL, 'a')` | `'a'` |

</div>