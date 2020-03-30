# Separation mechanisms

See:

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](https://www.slideshare.net/thekua/building-evolutionary-architectures))

## Contents

-   [Source-level boundaries](#source-level-boundaries)
    -   [Abstraction](#abstraction)
    -   [Encapsulation](#encapsulation)
    -   [Data transfer objects](#data-transfer-objects)
    -   [Combining the above](#combining-the-above)
    -   [Simpler boundaries](#simpler-boundaries)
-   [Dynamically-linked deployable components](#dynamically-linked-deployable-components)
-   [Local processes](#local-processes)
-   [Services](#services)

## Source-level boundaries

-   Lowest-level boundaries
-   Use mechanisms offered by the programming language (classes, interfaces, packages, modules, …)
-   Communication through simple method calls
    -   Fast, don't have to worry about amount of communication passing boundary
-   Not visible at deployment time
    -   Does not mean they are not important! When set up correctly, they can still help to isolate different parts of the system from each other in order to facilitate independent development by multiple persons or teams
-   Only kind of boundary in monolithic systems

### Abstraction

Use your language's abstraction mechanisms to separate clients from implementations

Example: [Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern)

![Strategy pattern](_img/Separation-mechanisms/strategy-pattern.png)

### Encapsulation

Divide the code into modules where classes outside of a module can only see the classes that that module explicitly exposes

Examples in Java:

-   Making classes package protected (limitation: Java does not have real notion of nested packages)

-   The [Java Platform Module System](../../java/Java-Platform-Module-System.md)

If your language doesn't provide something like this, you may be able to set it up using linting rules or automated tests that analyze dependencies

### Data transfer objects

When passing data between components, the components can be more decoupled if the objects crossing the boundary are simple data transfer objects instead of actual specific classes that are being used on either side

### Combining the above

Example of combining the above: use case boundary as specified by the Clean Architecture

![Clean Architecture boundary](_img/Separation-mechanisms/clean-architecture-boundary.jpg)

([image source](https://softwareengineering.stackexchange.com/questions/380251/clean-architecture-what-is-the-view-model))

-   Abstraction, specifying interfaces for both client and provider
-   Data transfer objects for input and output data
-   Ideally, encapsulation is used to prevent clients from calling the implementation(s) of the input boundary interface directly

Also note that the Dependency Inversion Principle (from the [SOLID principles](../oo-design/SOLID-principles.md)) has been used to make sure all dependencies point from the component calling the use case to the use case component itself.

### Simpler boundaries

An example of a simpler boundary is the [Facade pattern](https://en.wikipedia.org/wiki/Facade_pattern). Here, you take a complex subsystem and put it behind a class that exposes a nice interface to that subsystem. This does not provide the same amount of separation as the use of abstractions and does not allow you to control the direction of dependencies, but it can help with managing complexity and potentially prepare for the creation of a full boundary.

![Clean Architecture boundary](_img/Separation-mechanisms/facade-pattern.jpg)

## Dynamically-linked deployable components

-   Parts separated by the boundaries are separately developable and deployable components
    -   Example: DLL or JAR files
-   Deployed independently, but they still run in the same address space
    -   Communication still through simple method calls
-   When different components are developed independently from each other, you need some kind of versioning and release management system that allows developers depending on a component to decide if and when to upgrade to its next version
-   Dependencies between components need to be managed carefully in order to prevent dependency cycles
    -   See Dependency Inversion Principle (from the [SOLID principles](../oo-design/SOLID-principles.md))

See also [Deployable components](../Deployable-components.md)

## Local processes

-   Separate parts deployed as local processes
-   Still live on the same machine, but they do not share the same address space (unless some memory sharing involved)
    -   Inter-process communication through shared memory, sockets or potentially some OS-specific mechanisms
    -   Context switching between processes (and potential marshalling and unmarshalling) means that the communication between processes has more overhead than just simple method calls. Where possible, unnecessary back-and-forth should be avoided.

## Services

-   Strongest, highest-level boundary
-   Different services are assumed to live on different machines and communicate only over the network
    -   Communication often happens over HTTP or some kind of message queue
    -   Communication between services is expensive from a performance point of view
-   Each service typically developed and operated by a separate team that takes ownership of the service, including its tech stack and data
    -   Sharing of a database between services is generally considered bad practice, because it prevents services from independently making changes to their database structure (or independently choosing the database technology which makes the most sense for the service)
-   Freedom and flexibility: Ideally, changes to a service, except for its communication with other services, do not have any effect on other services
-   Still some coupling! The fact that services communicate with each other means that services will still depend on each other to some extent
    -   Example: If your service needs customer data, there are scenarios where a change to the Customer service could impact you.
    -   These dependencies should be carefully managed

See also [Microservices](../reference-architectures/Microservices.md)
