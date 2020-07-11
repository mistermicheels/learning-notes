---
description: How architectural boundaries can create false duplication
last_modified: 2020-07-11T16:56:51.566Z
---

# Boundaries and duplication

## Contents

-   [Basic idea](#basic-idea)
-   [Resources](#resources)

## Basic idea

Setting proper architectural boundaries can create **false duplication**, where things are the same right now but likely to change independently of each other in the future

-   Common with vertical slicing, where certain functionalities may start out looking similar but end up diverging significantly
-   Can also happen with horizontal slicing, for example the apparent duplication between a database row and the corresponding structure we send to the UI
    -   It may be tempting to pass the database row directly to the UI, and in some cases this can be a good idea, but it isn’t hard to imagine that the structure of the data to show in the UI and the structure of the data in the DB could have to change independently of each other
-   Splitting into microservices can lead to some (apparent) duplication of data between databases
    -   See also [Microservices - Data duplication and bounded contexts](../reference-architectures/Microservices.md#data-duplication-and-bounded-contexts)

Trying to get rid of this kind of duplication is likely a bad idea (see also [Duplication](../Duplication.md))

## Resources

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))
