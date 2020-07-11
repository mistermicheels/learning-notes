---
description: Why duplication is not always bad
last_modified: 2020-07-11T16:56:51.577Z
---

# Duplication

## Contents

-   [Real versus false duplication](#real-versus-false-duplication)
-   [Resources](#resources)

## Real versus false duplication

-   **Real duplication:** duplicates always have to change together
    -   This is the kind of duplication you really want to avoid
    -   Good use case for the **Don't Repeat Yourself** ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) principle
-   **False duplication:** code/structures/... that are identical now but likely to change independently of each other in the future
    -   The fact that two things are the same at this moment does not necessarily mean that they are real duplicates and that that apparent duplication is a bad thing
    -   Attempts to get rid of false duplication tend to lead to unnecessary coupling through shared code, which will then come back to bite you when the “duplicates” suddenly need to change independently of each other
    -   What typically happens when trying to get rid of false duplication:
        1.  Someone sees the duplication and creates an abstraction (function, class, ...) holding the duplicated code. The abstraction is now shared between all places that had the duplicated code before.
        2.  Requirements change and one of the places that had the duplicated code now needs to do something slightly different.
        3.  The developer implementing the change sees the abstraction and feels obligated to keep it. They extend it with a parameter to trigger the slightly different behavior.
        4.  Repeat 3 and 4 until the abstraction's code becomes a mess containing way too much behavior as well as being very risky and hard to modify when needed.

Advice:

-   Don't blindly follow the Don't Repeat Yourself ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) principle whenever you see duplication
    -   First, find out whether you're dealing with real or false duplication
-   Better principle to follow: **Avoid Hasty Abstractions** ([AHA Programming](https://kentcdodds.com/blog/aha-programming))
    -   "Prefer duplication over the wrong abstraction"

## Resources

-   [AHA Programming](https://kentcdodds.com/blog/aha-programming)
-   [The Wrong Abstraction](https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
-   [Beginner’s Guide To Abstraction](https://jesseduffield.com/beginners-guide-to-abstraction/)
