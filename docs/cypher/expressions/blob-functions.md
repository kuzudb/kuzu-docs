---
title: Blob Functions
description: Blob functions are used to create and manipulate Blob.
---
# Blob Functions

| Function | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| BLOB(string) | creates a BLOB object using string | blob('\xAA\xBD') | '\xAA\xBD' |
| encode(string) | converts the given string to blob. UTF-8 characters are converted using literal encoding | encode('this 中文') | 'this \xE4\xB8\xAD\xE6\x96\x87' |
| decode(blob) | converts the given blob to string. Throws exception if blob is not valid UTF-8 string | decode('this \xE4\xB8\xAD\xE6\x96\x87') | 'this 中文' |
| octet_length(blob) | returns the number of bytes of the given blob oject | octet_length('\xAA\xDE\xAD') | 3 |
