---
title: Blob
sidebar_position: 10
---

# BLOB

`BLOB`(<strong>B</strong>inary <strong>L</strong>arge <strong>OB</strong>ject) allows user to store an arbitrary binary object with up to 4KB in size in Kùzu.The database process binary data as it is without knowing what the actual data (e.g. image, video) it represents.

### Create a blob object with 3 bytes (188, 189, 186, 170)
```
RETURN BLOB('\\xBC\\xBD\\xBA\\xAA') as result;
```
Output:
```
---------------------------------------------
| result                                    |
---------------------------------------------
| \xBC\xBD\xBA\xAA                          |
---------------------------------------------
```
