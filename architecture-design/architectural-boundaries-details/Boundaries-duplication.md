---
description: Why duplication is not always bad and how architectural boundaries can create false duplication
last_modified: 2020-07-03T15:50:17.635Z
---

# Boundaries and duplication

## Contents

-   [False duplication](#false-duplication)
-   [Data duplication and bounded contexts](#data-duplication-and-bounded-contexts)
-   [Resources](#resources)

## False duplication

Watch out for _false duplication_!

-   Real duplication: duplicates always have to change together
    -   This is the kind of duplication you really want to avoid
-   False duplication: code/structures/... that are identical now but likely to change at different times or for different reasons
    -   Common with vertical slicing, where certain functionalities may start out looking similar but end up diverging significantly
    -   Can also happen with horizontal slicing, for example the apparent duplication between a database row and the corresponding structure we send to the UI
        -   It may be tempting to pass the database row directly to the UI, and in some cases this can be a good idea, but it isn’t hard to imagine that the structure of the data to show in the UI and the structure of the data in the DB could have to change independently of each other
    -   The fact that two things are the same at this moment does not necessarily mean that they are real duplicates and that that apparent duplication is a bad thing
    -   Attempts to get rid of false duplication tend to lead to unnecessary coupling through shared code, which will then come back to bite you when the “duplicates” suddenly need to change independently of each other

Advice:

-   Don't blindly follow the **Don't Repeat Yourself** ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) whenever you see duplication
-   What typically happens when trying to get rid of false duplication:
    1.  Someone sees the duplication and creates an abstraction (function, class, ...) holding the duplicated code. The abstraction is now shared between all places that had the duplicated code before.
    2.  Requirements change and one of the places that had the duplicated code now needs to do something slightly different.
    3.  The developer implementing the change sees the abstraction and feels obligated to keep it. They extend it with a parameter to trigger the slightly different behavior.
    4.  Repeat 3 and 4 until the abstraction's code becomes a mess containing way too much behavior as well as being very risky and hard to modify when needed.
-   Better principle to follow: **Avoid Hasty Abstractions** ([AHA Programming](https://kentcdodds.com/blog/aha-programming))
    -   "Prefer duplication over the wrong abstraction"

## Data duplication and bounded contexts

See [Microservices](../reference-architectures/Microservices.md)

## Resources

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))
-   [AHA Programming](https://kentcdodds.com/blog/aha-programming)
-   [The Wrong Abstraction](https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
