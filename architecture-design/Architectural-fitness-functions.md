---
description: An overview of architectural fitness functions as a way to check if your architecture matches your needs
last_modified: 2021-01-03T11:43:26.276Z
---

# Architectural fitness functions

## Contents

-   [Basic idea](#basic-idea)
-   [Categorizing fitness functions](#categorizing-fitness-functions)
    -   [Atomic versus holistic](#atomic-versus-holistic)
    -   [Triggered (batch) versus continuous](#triggered-batch-versus-continuous)
    -   [Static versus dynamic](#static-versus-dynamic)
    -   [Automated versus manual](#automated-versus-manual)
    -   [Temporal](#temporal)
-   [Example fitness functions](#example-fitness-functions)
    -   [Atomic and triggered](#atomic-and-triggered)
    -   [Holistic and triggered](#holistic-and-triggered)
    -   [Atomic and continuous](#atomic-and-continuous)
    -   [Holistic and continuous](#holistic-and-continuous)
-   [Resources](#resources)

## Basic idea

Architectural fitness functions:

-   Allow us to evaluate to what extent our architecture has the properties we want it to have
-   Assess goals like performance, reliability, security, operability, coding standards, ...
    -   Focus on what is really important for the specific system based on business requirements, technical capabilities, scale, ...
        -   This also means not spending time and money on things that are not really important!
    -   For every system, a crucial early architecture decision is to define the most important dimensions (scalability, performance, security, ...) to take into account
        -   Can help to prioritize riskier work to get the risky stuff out of the way as soon as possible
        -   Can lead to an architecture that makes certain concerns explicit instead of having them scattered across the codebase
        -   This can still evolve! some fitness functions will emerge during development of the system
-   Provide guidance in evolving our architecture
    -   Help finding areas that need improvement
    -   Evaluate how certain changes affect how well the architecture satisfies our goals
    -   Allow us to make tradeoffs between different goals if needed

Important building block of evolutionary architectures

-   _"An evolutionary architecture supports guided, incremental change as a first principle across multiple dimensions"_
-   Guidance is provided by fitness functions

## Categorizing fitness functions

### Atomic versus holistic

Atomic fitness functions:

-   Test one particular aspect of the architecture
-   Example: unit test checking for cyclic dependencies in a certain package

Holistic fitness functions:

-   Test a combination of architectural aspects
-   Useful for assessing the interactions between different architectural concerns
-   Lots of combinations possible, need to focus on most important ones
-   Example:
    -   Data freshness
    -   Scalability: number of concurrent users within a certainly latency range
        -   Developers make this work by implementing caching, but this influences freshness of data
    -   Very helpful to have a fitness function that tests for freshness of data with the caching enabled

### Triggered (batch) versus continuous

Triggered fitness functions:

-   Executed in response to some particular event
-   Examples:
    -   A developer executing a unit test
    -   A QA person performing exploratory testing

Continuous fitness functions:

-   Perform constant verification of architectural aspects
-   Example: monitoring
    -   [Monitoring-Driven Development](https://nl.devoteam.com/en/blog-post/monitoring-driven-development-making-money/)

### Static versus dynamic

Static fitness function:

-   Fixed predefined acceptable values: binary, a certain number range, ...
-   Example: binary pass/fail of a unit test

Dynamic fitness function:

-   Acceptable values depend on context
-   Example: acceptable latency might depend on actual scale of the system

### Automated versus manual

Automated fitness function:

-   Automated unit tests, deployment pipelines, stress tests, ...
-   Ideally as much automation as possible!

Manual fitness functions:

-   Some things impossible to automate, for example when certain changes need manual approval for legal reasons
-   Some things may not be properly automated yet, for example QA
-   For some tests, it might be more efficient to determine success/failure manually

### Temporal

Temporal fitness functions:

-   Have a particular time component
-   Example: temporal fitness function as a reminder to check to see if important security updates have been performed

## Example fitness functions

### Atomic and triggered

Typically run by developers and in deployment pipeline

See also [Static analysis](../processes-techniques/Static-analysis.md)

### Holistic and triggered

Typically run by developers and in deployment pipeline

Example: testing what kind of impact tighter security has on scalability

### Atomic and continuous

Run as part of the deployed architecture

Example: monitoring

Example: logging

### Holistic and continuous

Run as part of the deployed architecture

Example: Netflix's [Chaos Monkey](https://github.com/netflix/chaosmonkey)

-   Designed to test resilience to instance failures
-   Runs in production and randomly terminates instances
-   Forces teams to build resilient services while still taking into account other architectural goals

## Resources

-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))
