---
description: Separating hard-to-test and easy-to-test behavior
last_modified: 2020-12-31T13:17:37.792Z
---

# Humble Object pattern

## Contents

-   [Basic idea](#basic-idea)
-   [Values as boundaries](#values-as-boundaries)
-   [Resources](#resources)

## Basic idea

-   Problem: some behavior (like how data is represented on a screen) is hard to test
-   Solution: split the behavior into two parts
    -   Humble Object containing the hard-to-test stuff, stripped down to the bare essence
    -   Other, easily testable part which contains everything stripped from the Humble Object

Example: showing data in a UI

-   Create a view model that describes as much as possible about how the data will be shown
    -   Dates already converted to correct format
    -   Flags describing if elements should be disabled, hidden, ...
-   Humble Object is a view which does nothing more than showing contents of view model on the screen

## Values as boundaries

See this talk: [Boundaries](https://www.destroyallsoftware.com/talks/boundaries)

Same idea as Humble Object pattern, but taken to a more architectural level:

-   Core: all decision logic sits here, no mutation, input and output are just values (see below)
    -   Pure functions: output depends on input only, not on some other kind of state
    -   Very easy and efficient to unit test
-   Shell: layer around the core, holds dependencies, takes care of interaction with the outside world (DB, web, screen, keyboard, ...)
    -   Contains the slow code that can fail
    -   Hard to test, but there shouldn't be much to test (a few integration or end-to-end tests should give you all the confidence you need)
-   System can consist of multiple shells (each with their own core) that communicate with each other

The definition of a _value_ in this context: anything immutable

-   Could be a simple integer
-   Could be an object with immutable state, plus methods whose result depends on that state (and thus doesn't change either)
-   Every mutating operation should return a new object rather than mutating an existing object's state
    -   Example: Java's String class

Additional benefit of these values (in addition to testability): values like these are easy to pass as messages. This way, values can be used as boundaries between classes, subsystems, processes and even different machines.

## Resources

-   Clean Architecture (book by Robert C. Martin)
-   [TDD Patterns: Humble Object](https://ieftimov.com/post/tdd-humble-object/)
