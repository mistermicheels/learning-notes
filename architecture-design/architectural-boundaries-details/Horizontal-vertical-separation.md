---
description: The benefits and drawbacks of horizontal and vertical boundaries
---

# Horizontal versus vertical separation

See:

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](https://www.slideshare.net/thekua/building-evolutionary-architectures))
-   [Conway’s Corollary](http://www.ianbicking.org/blog/2015/08/conways-corollary.html)

## Contents

-   [Horizontal slicing](#horizontal-slicing)
-   [Vertical slicing](#vertical-slicing)
-   [Conway's Law](#conways-law)

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
    -   See [microservices](../reference-architectures/Microservices.md), where different small teams each maintain one or more microservices that encapsulate a certain functional area across several layers of the technical stack, even down to the database

## Conway's Law

Conway's Law is as follows:

> organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations

Such designs actually make sense as well: if changes within a single part of the system can happen within a single team, it’s way easier to plan and execute these changes

Consequence: if there is a mismatch between the team structure within your organization and the architecture of the application you’re working on, building the application is likely to be a struggle

You can use Conway’s Law to your advantage by structuring your application (and thus your teams) in such a way that changes to the system are pretty likely to be confined to a single part of the application. In practice, it seems that vertical slicing is typically the best way to do that.
