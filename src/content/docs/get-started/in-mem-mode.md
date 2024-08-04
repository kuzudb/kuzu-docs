---
title: "Kùzu under in-memory mode"
---

import { LinkCard } from '@astrojs/starlight/components';

When the database path is specified as empty or `:memory:`, Kùzu will be open under in-memory mode.
Under this mode, no data is persistent to disk. Thus, `CHECKPOINT` will do nothing, and all data are lost when the process finishes.

There are several restrictions on the in-memory mode:
- The database cannot be open as read-only.
- When use [Httpfs](/extensions/httpfs) extension, we don't support file cache.
- [Attaching](/extensions/attach) an in-memory database is not allowed.