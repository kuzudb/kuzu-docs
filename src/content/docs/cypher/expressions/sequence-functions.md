---
title: Sequence functions
description: Sequence functions are used to manipulate sequences.
---

The following are functions that can be applied to sequences created with `CREATE SEQUENCE`. The examples are calls made on a sequence created by:

```cypher
CREATE SEQUENCE id_sequence START 0 MINVALUE 0;
return nextval('id_sequence');
```

<div class="scroll-table">

| Function                   | Description                               | Example                         | Result |
| -------------------------- | ----------------------------------------- | ------------------------------- | ------ |
| `currval('sequence_name')` | returns the current value of the sequence | `return currval('id_sequence')` | `0`    |
| `nextval('sequence_name')` | returns the next value of the sequence    | `return nextval('id_sequence')` | `1`    |

</div>
