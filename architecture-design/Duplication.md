---
description: Why duplication is not always bad
last_modified: 2021-12-27T16:49:37.759Z
---

# Duplication

## Contents

-   [Real versus false duplication](#real-versus-false-duplication)
-   [Drawbacks of duplication](#drawbacks-of-duplication)
-   [Benefits of duplication](#benefits-of-duplication)
-   [The dangers of removing false duplication](#the-dangers-of-removing-false-duplication)
-   [Advice](#advice)
-   [Resources](#resources)

## Real versus false duplication

-   **Real duplication:** duplicates will always need to do the exact same thing
    -   This is the kind of duplication you really want to avoid
    -   Good use case for the **Don't Repeat Yourself** ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) principle
-   **False duplication:** code/structures/... that are identical now but likely to change independently of each other in the future
    -   The fact that two things are the same at this moment does not necessarily mean that they are real duplicates and that that apparent duplication is a bad thing
    -   Attempts to get rid of false duplication tend to lead to unnecessary coupling through shared code, which will then come back to bite you when the “duplicates” suddenly need to change independently of each other

## Drawbacks of duplication

-   Duplicated work when making changes, because changes need to get applied to every duplicate
-   Developers can forget to adjust (some of) the duplicates when fixing bugs, adding behavior, ...
-   Inconsistencies between duplicates could lead to unexpected behavior, corrupted data, incorrectly believing that the team has removed a certain important bug, ...
-   Developers might refactor some of the duplicates while forgetting others, making it much harder to recognize the duplication in the future

## Benefits of duplication

Mostly, it's about flexibility!

-   Allows for duplicates to evolve in different directions if needed
-   Later on, you can still decide to merge (part of) the duplicated code into an abstraction to reduce duplication

## The dangers of removing false duplication

What typically happens when trying to get rid of false duplication:

1.  Someone sees the duplication and creates an abstraction (function, class, ...) holding the duplicated code. The abstraction is now shared between all places that had the duplicated code before.
2.  Requirements change and one of the places that had the duplicated code now needs to do something slightly different.
3.  The developer implementing the change sees the abstraction and feels obligated to keep it. They extend it with "just one more parameter" or "just one more condition" to trigger the slightly different behavior. This makes the logic just a bit more complex and makes it just a bit more difficult to follow what the code is doing in one of the originally duplicated cases.
4.  Repeat 2 and 3 until the abstraction's code becomes a mess containing way too much behavior as well as being very risky and hard to modify when needed. At this point, it's often even unclear which parts of the behavior belong to which of the original 'duplicates'.

In the end, you have a tangled, hard-to-maintain mess that is also hard to split up into different, more maintainable parts.

## Advice

-   Don't blindly follow the Don't Repeat Yourself ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) principle whenever you see any kind of duplication
    -   Check whether you're dealing with real or false duplication
    -   Don't take DRY to its extreme, it's ok that some things are defined in multiple places
        -   Example: Fields in DB vs fields in UI. In theory, you could generate a UI based on DB structure, or generate both DB structure and UI based from a single place in the codebase. However, this would likely result in a UI with terrible user experience. DB design and UI design have very different purposes, which means they likely need to represent data in a different way, even if it's technically the same data.
-   Better principle to follow: **Avoid Hasty Abstractions** ([AHA Programming](https://kentcdodds.com/blog/aha-programming))
    -   _"Prefer duplication over the wrong abstraction"_
-   If you're not sure whether duplicates will need to change independently in the future, it's probably best to keep the duplication for the sake of future flexibility
    -   Only apply DRY once you are confident that you're dealing with real duplication
    -   The more you know about the requirements and the directions in which they can change, the more DRY you can make your code

## Resources

-   [AHA Programming](https://kentcdodds.com/blog/aha-programming)
-   [The Wrong Abstraction](https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
-   [Beginner’s Guide To Abstraction](https://jesseduffield.com/Beginners-Guide-To-Abstraction/)
-   [Moist code - Why code should not be completely DRY](https://startup-cto.net/moist-code-why-code-should-not-be-completely-dry)
