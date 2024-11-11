---
title: Pattern-matching functions
description: Pattern-matching functions are used to match strings against regular expressions.
---

Pattern-matching functions are used to match strings against regular expressions.

## Pattern matching operator

Cypher supports regular expression with `=~` operator. The `=~` operator succeeds only if its pattern matches the entire string.

Example:
```cypher
RETURN 'abc' =~ 'abc';
True

RETURN 'abc' =~ 'a';
False

RETURN 'abc' =~ '.*(b|d).*';
True

RETURN 'abc' =~ '(b|c).*';
False
```

### Escaping in regular expressions

To use special characters (e.g. `.`, `*`) without special meaning, escape them with backslash (`\`).

Example:
```cypher
RETURN 'peter_n@example.com' =~ '.*\\.com';
True
```

### Case-insensitive regular expressions
To use case-insensitive regular expressions, preappend a regular expression with `?i`

Example:
```cypher
RETURN 'abc' =~ '(?i)A.*';
True
```

## Regex functions

You can also use regex functions within Cypher to match, extract or replace substrings.

#### `regexp_matches(string, pattern)`

- Description: Returns true if a part of string matches the regex.
- Example: `regexp_matches('aba', '^ab')`
- Result: `true`

#### `regexp_replace(string, pattern, replacement[, options])`

- Description: Replaces the matching part of `string` with `replacement`.
- Example: `regexp_replace('ababbb', 'b.b', 'a')`
- Result: `'aabb'`

See the [options](#global-replacement-options) section for global replacement options.

#### `regexp_extract(string, pattern[, group = 0])`

- Description: Splits the string along the regex and extracts the first occurrence of the group.
- Example: `regexp_extract('abababab', 'b.b', 0)`
- Result: `'bab'`

#### `regexp_extract_all(string, pattern[, group = 0])`

- Description: Splits the string along the regex and extracts all occurrences of the group.
- Example: `regexp_extract_all('abababab', 'b.b', 0)`
- Result: `['bab','bab']`

## Options for regex functions

### Global replacement options

By default, the `regexp_replace` function replaces only the first occurrence of the pattern in the string.

To replace all occurrences of the pattern, use the `g` option.

The following example replaces multiple spaces with an empty string globally across the input string:
```cypher
RETURN regexp_replace('20 main   street', '\\s+', '', 'g') AS global_replace;
```

```
┌────────────────┐
│ global_replace │
│ STRING         │
├────────────────┤
│ 20mainstreet   │
└────────────────┘
```




