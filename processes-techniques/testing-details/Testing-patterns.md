---
description: Some useful patterns for writing tests or making production code more testable
last_modified: 2022-01-27T17:10:03.008Z
---

# Testing patterns

## Contents

-   [Humble Object pattern](#humble-object-pattern)
-   [Clock Wrapper pattern](#clock-wrapper-pattern)
-   [Object Mother pattern](#object-mother-pattern)
-   [Resources](#resources)

## Humble Object pattern

-   Problem: some behavior is hard to test
    -   Example: the way data is presented in the UI
-   Solution:
    -   Extract as much of the behavior as possible into an easy-to-test part
    -   What's left is a Humble Object containing the hard-to-test stuff stripped down to the bare essence

See also separate note for [Humble Object pattern](../../architecture-design/Humble-Object-pattern.md)

## Clock Wrapper pattern

-   Problem: Behavior depending on current time can be hard to test
-   Solution: Don't get current time directly, but access it through some kind of wrapper that allows you to manually set the time to a specific value for testing purposes
-   Alternative: Pass in current time as a parameter for code you want to keep easy to test (more functional approach)
-   Alternative: Some testing tools can hook into the language's default clock/timers functionality
    -   Example: [Cypress cy.clock()](https://docs.cypress.io/guides/guides/stubs-spies-and-clocks#Clock)

You can also wrap other dependencies that are hard to control or mock

## Object Mother pattern

-   Problem: creating data for tests can be tedious and complex
    -   You may need to create a complex hierarchy of objects before you can create object you are interested in
-   Solution: set up an "Object Mother" that creates predefined standard objects with all required data
    -   Can make sense to have a few standard objects of the same type to represent variations
        -   Example: fresh hire "John" and long-time employee "Heather"
    -   Standard objects become familiar to the team and sometimes even enter functional discussions
        -   Similar to personas, but not always people: can also be insurance policies, supplier contracts, ...
    -   Often, standard objects need a bit of additional setup for the specific test
        -   Avoid adding new standard objects, focus on small set that team is familiar with
    -   Can have different Object Mothers for different object types
-   Drawback: coupling
    -   Many tests will depend on the exact data specified in the Object Mother
    -   Changing the standard data can have large impact

## Resources

-   Martin Fowler's [Software Testing Guide](https://martinfowler.com/testing/):
    -   [Humble Object](https://martinfowler.com/bliki/HumbleObject.html)
    -   [Clock Wrapper](https://martinfowler.com/bliki/ClockWrapper.html)
    -   [Object Mother](https://martinfowler.com/bliki/ObjectMother.html)
-   Building Microservices (book by Sam Newman)
