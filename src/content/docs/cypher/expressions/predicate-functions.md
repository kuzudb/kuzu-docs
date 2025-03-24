---
title: Predicate Functions
description: Predicates are boolean functions used to determine a given list meets certain criteria.
---

<div class="scroll-table">

| Function | Description | Example |
| ----------- | ----------- |  ----------- |
| `all(variable IN list WHERE predicate)` | returns true if the predicate holds for all elements in the given LIST. | `all(x in [5,6,7] where x > 3)` |
| `any(variable IN list WHERE predicate)` | returns true if the predicate holds for any element in the given LIST | `any(x in [1,3,5] where x > 4)` |
| `none(variable IN list WHERE predicate)` | returns true if the predicate doesn't hold for any element in the given LIST | `none(x in [16,22,33] where x < 10)` |
| `single(variable IN list WHERE predicate)` | returns true if the predicate holds for only one element in the given LIST | `single(x in [1,3,5] where x = 3)` |

</div>
