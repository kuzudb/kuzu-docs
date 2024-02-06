---
title: List Functions
description: List functions are used to create and manipulate lists.
---
# List Functions

| Function | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| list_creation(arg1, arg2, arg3..) | creates a LIST containing the argument values | list_creation(1,2,3,4,5,56,2) | [1,2,3,4,5,56,2] |
| size(list) | returns the size of the list | size([1,2,3]) | 3 |
| list_extract(list, index) | extracts the indexth (1-based) value from the list | list_extract([1,2,3], 2) | 2 |
| list_element(list, index) | alias of list_extract | list_element([7,234,3], 1) | 7 |
| list_concat(list1, list2) | concatenates two lists | list_concat([7,234,3], [1,3]) | [7,234,3,1,3] |
| list_cat(list1, list2) | alias of list_concat | list_cat(['7','3'], ['1']) | ['7','3','1'] |
| array_concat(list1, list2) | alias of list_concat | array_concat([['7','2'],['3']], [['1']]) | [['7','2'],['3'],['1']] |
| array_cat(list1, list2) | alias of list_concat | array_cat([4.23,5.25], [4.1]) | [4.23,5.25,4.1] |
| list_append(list, element) | appends the element to list | list_append([3,5,9],4) | [3,5,9,4] |
| array_append(list, element) | alias of list_append | array_append([2,1],3) | [2,1,3] |
| array_push_back(list, element) | alias of list_append | array_push_back([3,6],4) | [3,6,4] |
| list_prepend(list, element) | prepends the element to list | list_prepend([3,6],4) | [4,3,6] |
| array_prepend(list, element) | alias of list_prepend | array_prepend([3,6],4) | [4,3,6] |
| array_push_front(list, element) | alias of list_prepend | array_push_front([1,2],3) | [3,1,2] |
| list_position(list, element) | returns the position of element in the list | list_position([3,4,5], 5) | 3 |
| list_indexof(list, element) | alias of list_position | list_indexof([3,4,5], 5) | 3 |
| array_position(list, element) | alias of list_position | array_position([3,4,5], 5) | 3 |
| array_indexof(list, element) | alias of list_position | array_indexof([3,4,5], 5) | 3 |
| list_contains(list, element) | returns true if the list contains the element | list_contains([3,4,5], 5) | true |
| list_has(list, element) | alias of list_contains | list_has([3,4,5], 5) | true |
| array_contains(list, element) | alias of list_contains | array_contains([3,4,5], 5) | true |
| array_has(list, element) | alias of list_contains | array_has([3,4,5], 5) | true |
| list_slice(list, begin, end) | extracts a sublist using slice conventions and negative values are accepted. | list_slice([3,4,5], 2, 3) | [4] |
| array_slice(list, begin, end) | alias of list_slice | array_slice([6,7,1], 1, 3) | [6,7] |
| list_sort(list) | sorts the elements of the list. More configurations available [here](#list_sort-function) | list_sort([3,10,4]) | [3,4,10] |
| list_reverse_sort(list) | alias of list_sort(list, 'DESC') | list_reverse_sort([3,10,4]) | [10,4,3] |
| list_sum(list) | sums the elements of the list. | list_sum(1,2,3) | 6 |
| list_product(list) | multiply elements of the list. | list_product([1, 2, 3]) | 6 |
| list_distinct(list) | removes NULLs and duplicate values from the list. | list_distinct(3,3,3,NULL) | [3] |
| list_unique(list) | counts number of unique elements of the list. NULLs are ignored. | list_unique(3,3,3,NULL) | 1 |
| list_any_value(list) | returns the first non-NULL value of the list | list_any_value(NULL, 'a', NULL) | 'a' |

## LIST_SORT
LIST_SORT function takes can be configured to sort in ascending or descending order as well as whether `NULL` values should be put at the beginning or at the end of the list. By default, LIST_SORT will sort in ascending order and put NULL values at first. User can change sort order with `ASC` or `DESC` key word as the 
second argument and change `NULL` values position with `NULLS FIRST` or `NULLS LAST` as the third argument.

#### LIST_SORT IN DESCENDING ORDER
```
RETURN list_sort([3,10, NULL, 4], 'DESC') AS result;
```
Output:
```
-------------
| result    |
-------------
| [,10,4,3] |
-------------
```
#### LIST_SORT IN DESCENDING ORDER WITH NULL AT LAST
```
RETURN list_sort([3,10, NULL, 4], 'DESC', 'NULLS LAST') AS result;
```
Output:
```
-------------
| result    |
-------------
| [10,4,3,] |
-------------
```

## RANGE
- `range(start, stop)`: returns a list of value from start to stop. Both ends are inclusive.

```
RETURN range(1,3);
--------------
| RANGE(1,3) |
--------------
| [1,2,3]    |
--------------
```

- `range(start, stop, step)`
```
RETURN range(1,10,2);
-----------------
| RANGE(1,10,2) |
-----------------
| [1,3,5,7,9]   |
-----------------
```
