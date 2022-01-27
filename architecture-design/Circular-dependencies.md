---
description: Different kinds of circular dependencies, how to detect them and how to get rid of them if needed
last_modified: 2022-01-27T17:10:02.914Z
---

# Circular dependencies

## Contents

-   [Forms of circular dependencies](#forms-of-circular-dependencies)
    -   [Between classes or files](#between-classes-or-files)
    -   [Between folders, Java packages, ...](#between-folders-java-packages-)
    -   [Between deployable components](#between-deployable-components)
    -   [Between microservices](#between-microservices)
-   [Detecting them](#detecting-them)
-   [Getting rid of them](#getting-rid-of-them)
-   [Resources](#resources)

## Forms of circular dependencies

### Between classes or files

-   Can lead to unexpected behavior, depending on the language
    -   In Node.js, circular dependencies between files mean that one of the files will get an incomplete copy of the other on initialization (see [CommonJS modules - Cycles](https://nodejs.org/api/modules.html#modules_cycles))
-   Can lead to issues with dependency injection
    -   If A's constructor needs an instance of B and B's constructor needs an instance of A, how will they ever both get constructed?
    -   Some dependency injection frameworks cleverly work around this by passing proxy objects to the constructor and only instantiating the real objects when methods are called on those proxy objects (works fine as long as two objects don't call methods on each other in their constructors)
-   Sometimes unavoidable (for example, defining ORM classes for tables that hold a reference to each other)

### Between folders, Java packages, ...

-   These are things that group files for organizational purposes but have no effect on deployment etc.
-   Circular dependencies between them could be a code smell but are often not an issue
-   Plenty of well-known open source libraries have circular dependencies at this level
-   Might be a cause for concern if you later want to turn these into separate developable and deployable components

### Between deployable components

-   Independently developable, independently deployable
    -   This includes JAR files, DLL files, npm packages, ...
-   Circular dependencies at this level are bad, since they prevent the components from really being independently developable and deployable (and testable)
-   Might even lead to problems in building the components, depending on the language
-   See [Deployable components - Acyclic Dependencies Principle](./Deployable-components.md#acyclic-dependencies-principle)

### Between microservices

-   Somewhat similar to deployable components
-   No compile time dependencies, so likely no issues in building the services
-   Breaking changes require careful coordination, but this is always the case with microservices (since depending services have no control over when they start using the new version of the service)
-   If a service fails because of a failure in an upstream dependency, it's hard to find the root cause if the service that failed is part of a cycle (the bigger the cycle, the harder this can get)

## Detecting them

See [Static analysis - Internal dependencies](../processes-techniques/Static-analysis.md#internal-dependencies)

## Getting rid of them

Potential approaches:

-   Reverse the direction of a dependency using the Dependency Inversion Principle (DIP) (see [Dependency inversion principle (DIP)](./oo-design/SOLID-principles.md#dependency-inversion-principle-dip))
-   Reverse the direction of a dependency using events
    -   Before: A depends on B and sends commands to it
    -   After: B depends on A and listens to events from it
-   Extract something new that involved parts can depend on instead of depending on each other
    -   It's possible that some of the involved parts have more than one responsibility and that extracting that responsibility automatically solves the circular dependency
        -   Example: [How to solve circular dependency?](https://softwareengineering.stackexchange.com/questions/306483/how-to-solve-circular-dependency)
    -   Special case: splitting CRUD functionality into separate read functionality and create/update/delete functionality
        -   This way, create/update/delete functionality for both A and B can depend on read functionality for both A and B without creating circular dependencies
-   Merge the involved parts together
    -   Example: a circular dependency between microservices might be a sign that the splitting has been taken too far and that the involved microservices should actually become one service

## Resources

-   [How to deal with cyclic dependencies in Node.js](https://stackoverflow.com/questions/10869276/how-to-deal-with-cyclic-dependencies-in-node-js)
-   [CommonJS modules - Cycles](https://nodejs.org/api/modules.html#modules_cycles)
-   [How to handle “circular dependency” in dependency injection](https://softwareengineering.stackexchange.com/questions/253646/how-to-handle-circular-dependency-in-dependency-injection)
-   [Why do all of the leading open-source Java libraries have circular dependencies among their packages?](https://stackoverflow.com/questions/33809884/why-do-all-of-the-leading-open-source-java-libraries-have-circular-dependencies)
-   [Cyclic dependencies in microservices](https://softwareengineering.stackexchange.com/questions/398453/cyclic-dependencies-in-microservices)
-   [What are the potential problems with operational circular dependency between microservices](https://softwareengineering.stackexchange.com/questions/350155/what-are-the-potential-problems-with-operational-circular-dependency-between-mic)
-   [How to solve circular package dependencies](https://softwareengineering.stackexchange.com/questions/186921/how-to-solve-circular-package-dependencies)
-   [How to solve circular dependency?](https://softwareengineering.stackexchange.com/questions/306483/how-to-solve-circular-dependency)
