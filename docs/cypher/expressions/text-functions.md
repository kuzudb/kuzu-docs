---
title: Text Functions
description: Text functions are used to manipulate text.
---

# Text Operators

| Operator | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| [index] | alias of array extract | STRING("TEXT")[1]  | "T" | 
| [begin:end] | alias of array slice | STRING("TEXT")[1:3] | "TEX" |

# Text Functions

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| array_extract(list, index) | extracts a single character from string using 1-based index | array_extract("year", 2) | "e" |
| array_slice(list, begin, end) | slices a string using 1-based index | array_slice("year", 1, 4) | "year" |
| concat(string1, string2) | concatenates two string | concat("university", " of waterloo") | "university of waterloo" |
| ends_with(string1, string2) | alias of suffix | ends_with("best student", "student") | true  |
| lcase(string) | alias of lower | lcase("UPPER CASE") | "upper case" |
| left(string, count) | returns the left most count number of characters from string | left("long string", 2) | "lo" |
| length(string) | returns the number of characters in string | length("database") | 8 |
| list_element(string, index) | alias of array_extract | list_element("university", 3) | "i" | 
| list_extract(string, index) | alias of array_extract | list_extract("waterloo", 2) | "a" |
| lower(string) | returns the string in lower case | lower("WaterLoo") | "waterloo" |
| lpad(string, count, character) | pads the string with the character from the left until it has count characters | lpad("WaterLoo", 10, ">") | ">>WaterLoo" |
| ltrim(string) | removes any white spaces on the left of the string | ltrim("  waterloo  ") | "waterloo  " |
| prefix(string, search_string) | returns whether the string starts with serach_string | prefix("good university", "good") | True |
| repeat(string, count) | repeats the string count number of times | repeat("##", 5) | "##########" |
| reverse(string)	| reverses the string | reverse("<<12345>>") | ">>54321<<" |
| right(string, count) | returns the right most count number of characters from string | right("toronto", 2) | "to" |
| rpad(string, count, character) | pads the string with the character from the right until it has count characters | rpad("toronto", 10, '<') | "toronto<<<" |
| rtrim(string)	| removes any white spaces on the right of the string | rtrim("  toronto  ") | "  toronto" |
| starts_with(string1, string2) | alias of prefix | starts_with("best student", "best") | True |
| substr(string, start, length) | alias of substring | substr("long str", 2, 3) | "ong" |
| substring(string, start, length) | extracts the string from start position until length number of characters using 1-based index | substring("toronto", 1, 2) | "to" |
| suffix(string, search_string) | returns whether the string ends with search_string | suffix("toronto12", "12") | True |
| trim(string) | removes any white spaces either on the left or right of the string | trim("  good  ") | "good" |
| ucase(string) | alias of upper | ucase("small case") | "SMALL CASE" |
| upper(string) | returns the string in upper case | upper("small case") | "SMALL CASE" |
