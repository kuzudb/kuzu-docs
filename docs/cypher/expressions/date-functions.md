---
title: Date Functions
description: Date functions are used to manipulate date values.
---

# Date Operators

| Operator | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| + | addition of INT64 | DATE('2022-11-12') + 5  | 2022-11-17 (DATE) | 
| + | addition of INTERVAL | DATE('2021-10-12') + INTERVAL(3 DAYS) | 2021-10-15 (DATE) |
| - | subtraction of INT64 | DATE('2022-11-12') - DATE(2022-11-11) | 1 (INT64)|
| - | subtraction of INTERVAL | DATE('2023-10-11') - INTERVAL(10 DAYS) | 2023-10-01 (DATE) |

# Date Functions

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| date_part(part, date) | returns the subfield of the date | date_part('year', DATE('1995-11-02')) | 1995 (INT64) |
| datepart(part, date) | alias of date_part | datepart('month', DATE('1933-12-12')) | 12 (INT64) |
| date_trunc(part, date) | returns the date with specified precision | date_trunc('month', DATE('2011-11-21')) | 2011-11-01 (DATE) |
| datetrunc(part, date)	| alias of date_trunc | datetrunc('year', DATE('2005-12-11')) | 2005-12-01 (DATE) |
| dayname(date) | returns the english name of the day of the date | dayname(DATE('2022-11-07')) | "Monday" (STRING) | 
| greatest(date, date) | returns the later of the two dates | greatest(DATE('2013-12-11'), DATE('2005-11-12')) | 2013-12-11 (DATE) |
| last_day(date) | returns the last day of the month of the date | last_day(DATE('2022-10-11')) | 2022-10-31 (DATE) |
| least(date, date) | returns the earlier of the two dates | least(DATE('2013-12-11'), DATE('2005-11-12')) | 2005-11-12 (DATE) |
| make_date(INT64, INT64, INT64)	 | returns the date based on the given parts | make_date(1952,11,22) | 1952-11-22 (DATE) |
| monthname(date) | returns the english name of the month of the date | monthname(DATE('2022-11-07')) | "November" (STRING) |
