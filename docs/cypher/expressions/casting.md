---
title: Casting Functions
description: Casting functions are used to cast values from one type to another.
---

# Casting Functions

Kùzu supports casting  through explicit casting functions. An exception will be thrown if the casting fails.

| Functions | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| date | cast STRING to DATE | DATE('2022-11-12') | 2022-11-12 (DATE) | 
| timestamp | cast STRING to timestamp | TIMESTAMP('2021-10-12 15:21:33') | 2021-10-12 15:21:33 (TIMESTAMP) |
| interval | cast STRING to INTERVAL | INTERVAL('5 DAYS 2 YEARS') | 2 years 4 days (INTERVAL) |
| string | cast ANY to STRING | STRING(561) | '561' |
