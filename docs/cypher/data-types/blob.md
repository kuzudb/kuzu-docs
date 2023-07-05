---
title: String
sidebar_position: 10
---

# BLOB

`BLOB`(<strong>B</strong>inary <strong>L</strong>arge <strong>OB</strong>ject) allows user to store an arbitrary binary object with up to 4KB in size in Kùzu. Blob type can store any type of binary data (e.g. images, sound), thus it is typically used to store objects that Kùzu doesn't have explicitly support for.  

### Create a blob object with 3 bytes (188, 189, 186, 170)
```
RETURN BLOB('\xBC\xBD\xBA\xAA') as result;
```
Output:
```
---------------------------------------------
| result                                    |
---------------------------------------------
| \xBC\xBD\xBA\xAA                          |
---------------------------------------------
```
