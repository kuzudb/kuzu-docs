---
title: Pattern Matching Functions
description: Pattern matching functions are used to match strings against regular expressions.
---

# Pattern Matching Operator =~

Cypher supports regular expression with `=~` operator. The `=~` operator succeeds only if its pattern matches the entire string.

Examples
```
RETURN 'abc' =~ 'abc';
True

RETURN 'abc' =~ 'a';
False

RETURN 'abc' =~ '.*(b|d).*';
True

RETURN 'abc' =~ '(b|c).*';
False
```

### Escaping in Regular Expressions

To use special characters (e.g. `.`, `*`) without special meaning, escape them with backslash (`\`).

Example
```
RETURN 'peter_n@example.com' =~ '.*\\.com';
True
```

### Case-insensitive Regular Expressions
To use case-insensitive regular expressions, preappend a regular expression with `?i`

Example
```
RETURN 'abc' =~ '(?i)A.*';
True
```

# Regex functions

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| regexp_matches(string, regex) | returns true if a part of string matches the regex. | regexp_matches('aba', '^ab') | true |
| regexp_replace(string, regex, replacement) | Replaces the first occurrence of regex with the replacement. | regexp_replace('ababbb', 'b.b', 'a') | 'aabb' |
| regexp_extract(string, regex[, group = 0]) | split the string along the regex and extract first occurrence of group. | regexp_extract('abababab', 'b.b', 0) | 'bab' |
| regexp_extract_all(string, regex[, group = 0]) | split the string along the regex and extract all occurrences of group. | regexp_extract_all('abababab', 'b.b', 0) | ['bab','bab'] |

