---
description: What inversion of control means and why it's useful when building applications
last_modified: 2020-12-31T13:17:37.794Z
---

# Inversion of control

## Contents

-   [Basic idea](#basic-idea)
-   [Implementation](#implementation)
-   [Resources](#resources)

## Basic idea

-   Separate code defining **how** something is done from code defining **when** it is done
-   Ensure that both of these parts know as little as possible about each other

Benefits:

-   Decoupling between "how" and "when" parts
    -   The less they need to know about each other, the easier it is to replace/adjust one without breaking the other
-   More focused classes/modules

## Implementation

-   Events
    -   Separate code handling events ("how" part) from code triggering events ("when part")
-   Dependency injection
    -   Pass dependencies of a class/function/module as constructor arguments, method parameters, ...
    -   "How" is defined inside the dependencies that are injected + in the code that determines which specific implementation will be injected (as opposed to the class/function/module instantiating its own dependencies)
        -   Second part is very useful for reusability and also makes it easy to pass in specific implementations for running automated tests
    -   "When" is defined by the code of the class/function/module that uses the dependencies
-   The [Template method pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
    -   Separate implementation of template method ("how" part) from logic for calling the template method ("when" part)
-   The [Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern)
    -   Strategy itself defines the "how" part, code calling strategy defines the "when" part
    -   Good use case for dependency injection

## Resources

-   [Inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control)
-   [What is Inversion of Control?](https://stackoverflow.com/questions/3058/what-is-inversion-of-control)
-   [Inversion of Control vs Dependency Injection](https://stackoverflow.com/questions/6550700/inversion-of-control-vs-dependency-injection)
-   [Template method pattern](https://en.wikipedia.org/wiki/Template_method_pattern)
-   [Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern)
