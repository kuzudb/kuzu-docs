---
title: Sequence functions
description: Sequence functions are used to manipulate sequences.
---

The follow are functions that can be applied to sequences created with `CREATE SEQUENCE`.

<div class="scroll-table">

| Function                   | Description                               | Example                  | Result |
| -------------------------- | ----------------------------------------- | ------------------------ | ------ |
| `currval('sequence_name')` | returns the current value of the sequence | `currval('id_sequence')` | `0`    |
| `nextval('sequence_name')` | returns the next value of the sequence    | `currval('id_sequence')` | `1`    |

</div>
