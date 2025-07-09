---
title: Example database
---

We use the following example graph dataset that
consists of `User` and `City` nodes, `Follows` relationships between users,
and `LivesIn` relationships between users and cities.

![](/img/running-example.png)

```cypher
CREATE NODE TABLE User(name STRING PRIMARY KEY, age INT64);
CREATE NODE TABLE City(name STRING PRIMARY KEY, population INT64);
CREATE REL TABLE Follows(FROM User TO User, since INT64);
CREATE REL TABLE LivesIn(FROM User TO City);

CREATE
    (adam:User {name: 'Adam', age: 30}),
    (karissa:User {name: 'Karissa', age: 40}),
    (zhang:User {name: 'Zhang', age: 50}),
    (noura:User {name: 'Noura', age: 25}),

    (waterloo:City {name: 'Waterloo', population: 150000}),
    (kitchener:City {name: 'Kitchener', population: 200000}),
    (guelph:City {name: 'Guelph', population: 75000}),

    (adam)-[:Follows {since: 2020}]->(karissa),
    (adam)-[:Follows {since: 2020}]->(zhang),
    (karissa)-[:Follows {since: 2021}]->(zhang),
    (zhang)-[:Follows {since: 2022}]->(noura),

    (adam)-[:LivesIn]->(waterloo),
    (karissa)-[:LivesIn]->(waterloo),
    (zhang)-[:LivesIn]->(kitchener),
    (noura)-[:LivesIn]->(guelph)
;
```
