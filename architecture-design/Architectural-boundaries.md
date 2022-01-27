---
description: The importance of boundaries in architecture, different kinds of boundaries, costs and evolution of boundaries, etc.
last_modified: 2022-01-27T10:39:48.371Z
---

# Architectural boundaries

## Contents

-   [Architecture is about boundaries](#architecture-is-about-boundaries)
-   [Different kinds of boundaries](#different-kinds-of-boundaries)
    -   [Horizontal versus vertical separation](#horizontal-versus-vertical-separation)
    -   [Separation mechanisms](#separation-mechanisms)
    -   [Combining different kinds of boundaries](#combining-different-kinds-of-boundaries)
-   [The costs of boundaries](#the-costs-of-boundaries)
-   [Evolving boundaries](#evolving-boundaries)
-   [Boundaries and the database](#boundaries-and-the-database)
-   [Boundaries and the web](#boundaries-and-the-web)
-   [Boundaries and third-party dependencies](#boundaries-and-third-party-dependencies)
-   [Boundaries and duplication](#boundaries-and-duplication)
-   [Resources](#resources)

## Architecture is about boundaries

System's architecture defines shape of the system:

-   How the system is divided into components
-   How those components are arranged
-   What kinds of boundaries exist between different components
-   How components communicate across those boundaries

Not only technical components but also components within the codebase itself!

Boundaries separate parts of the system that shouldn’t know too much about each other

Benefits of this separation: **flexibility**!

-   **Lower coupling**: Decouple components so changes in one component don't require changes in other components
-   **Higher cohesion**: Group together things that change at the same rate and for the same reasons (cohesion)
    -   Manifestation of the Single Responsibility Principle (from the [SOLID principles](./oo-design/SOLID-principles.md)), but this time at the architectural level
-   Low coupling and higher cohesion are basically about **encapsulating volatility**. When one part of your system needs to change, you want to prevent others from having to change as well. In particular, you don't want change in the more volatile parts of your system force change in the more stable parts of your system.
-   Ability to **delay choices** until last possible moment

Example: Separating main business logic from persistence logic

-   If the main business logic doesn’t have any idea about the database we use (or potentially even the fact that we use a database), we have the flexibility to change the database that our system depends on without having to make any kind of changes to the main business logic
-   If we need to make changes to the main business logic that do not influence the kind of data that needs to be persisted, we can make those changes without the persistence code having to know anything about them

Example: Separating different functional areas from each other

-   Low coupling and high cohesion helps to scale the team! Can allow different functional parts of the system to be developed by different teams while keeping the required amount of coordination between teams manageable

Flexibility provided by boundaries is important, especially for maintenance (typically the most risky and expensive part). Often, the first version of a system making it to production is only the start, and most of the work will happen after that. Additional requirements will be added, existing functionality will need to be changed, and so on. Adequate boundaries will provide the necessary flexibility to make this kind of maintenance possible, allowing the system to grow without exponentially increasing the work needed to add or adjust a piece of functionality.

## Different kinds of boundaries

### Horizontal versus vertical separation

See [Horizontal versus vertical separation](./architectural-boundaries-details/Horizontal-vertical-separation.md)

### Separation mechanisms

See [Separation mechanisms](./architectural-boundaries-details/Separation-mechanisms.md)

### Combining different kinds of boundaries

There is no need to choose only one kind of boundary! Different kinds of boundaries can be useful at different levels of your architecture.

Example: You could have a set of microservices which you have obtained using vertical slicing. However, each of those microservices could have a layered architecture using horizontal slicing to separate different technical parts, either through source-level boundaries or as separately deployable components.

## The costs of boundaries

Benefits of boundaries do not come for free!

-   Potentially some performance impact
-   Most costly impact: development and maintenance effort!
    -   Boundaries need to be developed and maintained
    -   Boundaries' decoupling mechanisms can increase the complexity of the system as a whole

If you have five teams working on a system, they will likely benefit from having five clearly separated parts with stable interfaces connecting them. The same architecture could hurt productivity if there is only a single small team working on the system. The experience and knowledge of different team members also plays a part. 

When in doubt, keep it simple! 

-   If there is no clear need for a boundary, it is likely that adding the boundary would be a case of over-engineering.
-   Already plenty of horror stories about systems with so many layers of abstraction that it is almost impossible to figure out where certain logic sits in the codebase or where a certain new feature should be implemented

Main conclusion: You have to make a tradeoff between the benefits and costs of each boundary instead of just blindly introducing boundaries and abstraction everywhere

See also [Keep it simple](../mindset/Keep-it-simple.md)

## Evolving boundaries

Deciding on boundaries requires careful consideration:

-   Boundaries are expensive
-   Introducing a new boundary which was not there before is typically very expensive

However, it is impossible to know everything beforehand when building a system:

-   Context and requirements for the system are likely to change throughout its lifetime
-   Likely impossible to foresee all technical challenges

This means that the architecture of the system and the boundaries defining it will need to evolve along with the system itself.

Some things that may need to evolve:

-   The location of the boundaries
    -   It’s possible that, as the system and the team grows, additional boundaries are needed to be able to maintain productivity
    -   On the other hand, the cost of maintaining certain boundaries may no longer outweigh the benefits they bring
-   The separation mechanism used by a boundary
    -   An application could start as a monolith with some well-placed source-level boundaries, but over time it could make sense to start breaking up different parts into separate components or even separate services
    -   Ideally, a boundary should allow you to move to a higher (or lower) level of separation without the majority of the code having to know anything about the change

A good architect will keep on watching the system for signs of parts that need additional separation or boundaries that have become less relevant. They will then make the necessary adjustments, taking into account both the benefits and costs associated with changing boundaries. This way, the architecture of the system will keep on evolving to suit the needs of the system and team.

Evolution of boundaries could be guided by [Architectural fitness functions](./Architectural-fitness-functions.md)

## Boundaries and the database

See [Boundaries and the database](./architectural-boundaries-details/Boundaries-database.md)

## Boundaries and the web

See [Boundaries and the web](./architectural-boundaries-details/Boundaries-web.md)

## Boundaries and third-party dependencies

See [Boundaries and third-party dependencies](./architectural-boundaries-details/Boundaries-third-party-dependencies.md)

## Boundaries and duplication

See [Boundaries and duplication](./architectural-boundaries-details/Boundaries-duplication.md)

## Resources

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))
-   [Conway’s Corollary](http://www.ianbicking.org/blog/2015/08/conways-corollary.html)
-   [Our Software Dependency Problem](https://research.swtch.com/deps)
