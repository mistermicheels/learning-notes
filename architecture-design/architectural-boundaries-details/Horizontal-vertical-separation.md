---
description: The benefits and drawbacks of horizontal and vertical boundaries
last_modified: 2020-11-28T17:53:12.418Z
---

# Horizontal versus vertical separation

## Contents

-   [Horizontal slicing](#horizontal-slicing)
-   [Vertical slicing](#vertical-slicing)
-   [Resources](#resources)

## Horizontal slicing

-   Boundaries between different technical areas (layers) of the system
-   Example: a layer for the API, a layer the business logic and a layer for communicating with the database
-   Benefit: allow for technological flexibility (for example, relatively easy to switch to other kind of DB)
-   Drawback: single functional change is likely to affect multiple layers

## Vertical slicing

-   Boundaries between different functional areas of the system
-   Example: functionality for managing customers can be separated from functionality for placing orders
-   Benefit: Changes within a single functional domain can happen within a single part of the system
    -   Especially helpful if different parts maintained by different teams!
    -   Changes within a single functional domain can happen within a single team and coordination with other teams is only required if the communication with other functional domains needs changes as well
    -   See [Architecture and people - Conway's law](../Architecture-people.md#conways-law)
    -   See [microservices](../reference-architectures/Microservices.md), where different small teams each maintain one or more microservices that encapsulate a certain functional area across several layers of the technical stack, even down to the database

## Resources

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))
-   [Conway’s Corollary](http://www.ianbicking.org/blog/2015/08/conways-corollary.html)
