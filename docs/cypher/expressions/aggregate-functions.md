---
title: Aggregate Functions
description: Aggregate functions are used to compute a single result from a set of input values.
---

# Aggregate Functions

| Function | Description | Example |
| ----------- | ----------- |  ----------- |
| avg(arg) | returns the average value of all tuples in arg | avg(a.length) |
| count(arg) | returns the number of tuples in arg | count(a.ID) |
| min(arg) | returns the minimum value of arg | min(a.legnth) | 
| max(arg) | returns the maximum value of arg | max(a.length) | 
| sum(arg) | returns the sum value of all tuples in arg | sum(a.length) |
| collect(arg) | returns a list containing values returned by arg expression | collect(a.age) |
