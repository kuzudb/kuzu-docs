---
title: Timestamp
sidebar_position: 3
---

# TIMESTAMP
`TIMESTAMP` combines date and a time (hour, minute, second, millisecond) and is formatted according to the ISO 8601 format (`YYYY-MM-DD hh:mm:ss[.zzzzzz][+-TT[:tt]]`),
which specifies the date (`YYYY-MM-DD`), time (`hh:mm:ss[.zzzzzz]`) and a time offset `[+-TT[:tt]]`. Only the Date part is mandatory. If time is specified, then the millisecond `[.zzzzzz]` part and the time offset are optional. 


### `TIMESTAMP` creation
```
RETURN timestamp("1970-01-01 00:00:00.004666-10") as x;
```
Output:
```
------------------------------
| x                          |
------------------------------
| 1970-01-01 10:00:00.004666 |
------------------------------
```
