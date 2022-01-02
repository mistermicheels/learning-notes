---
description: Why testing in production (rather than before deploying) could make sense in some cases
last_modified: 2022-01-02T14:25:32.148Z
---

# Testing after production

## Contents

-   [Basic idea](#basic-idea)
-   [Mean time between failures versus mean time to repair](#mean-time-between-failures-versus-mean-time-to-repair)
-   [Separating deployment from release](#separating-deployment-from-release)
-   [Monitoring and logging](#monitoring-and-logging)
-   [Synthetic monitoring](#synthetic-monitoring)
-   [Resources](#resources)

## Basic idea

-   Tests will never be perfect, we can't catch everything! Impossible to reduce chance of failure to zero
-   It might be impractical and not worth the effort to test certain things before putting them in production

## Mean time between failures versus mean time to repair

-   Mean time between failures (MTBF): indication of how often issues make it to production
-   Mean time to repair (MTTR): indication of how long it takes you to detect and fix such issues

Tradeoff MTBF versus MTTR:

-   Sometimes, it's more efficient to spend effort on getting better at detecting and fixing issues in production than on adding more automated tests
-   Best tradeoff depends on your organization
-   Do not completely abandon one in favor of the other
    -   It's probably not a good idea to just throw stuff into production without any level of testing
    -   Even with great tests, you need to be prepared for a bug popping up in production

## Separating deployment from release

Basic idea: after deploying something, don't immediately direct full production load to it

Useful techniques:

-   **Smoke tests**:
    -   Tests designed to check that deployment was successful and software runs properly in current environment
    -   Should ideally be run automatically on deploy
-   **Blue/green deployment**:
    -   Run old and new next to each other
    -   New can get smoke tested while old still handles production load, then we can switch
    -   After switching to new, we can quickly switch back if necessary
-   **Canary releasing**:
    -   Keep old and new next to each other for longer time
    -   Only direct a fraction of production load to new, increase as confidence increases
-   **Branch By Abstraction** and **application strangulation** (see [Branch By Abstraction and application strangulation](../Branch-by-abstraction-application-strangulation.md)):
    -   Techniques to gradually migrate to new code or even new system
    -   Possible to direct production traffic to existing code/system but also send a copy of it to new code/system to check for differences in behavior

## Monitoring and logging

-   Monitor CPU, memory, ...
-   Monitor application itself: response time, number of errors returned to client, number of submitted forms, ...
-   Collect logs about what the system is doing
    -   It's especially important to log any errors that happen
-   Set up dashboards so people can quickly get an idea of the system's state
-   Set up alerts based on resource use, response time, error rates, 500 responses, ...
    -   Alert early enough so team can act before things really get bad
    -   Watch your signal-to-noise ratio, so people don't start ignoring alerts

## Synthetic monitoring

(also called **semantic monitoring**)

Basic idea: monitor health of system as whole by running end-to-end scenarios against it

Approach:

-   Define important scenarios or user journeys
-   Write tests for them (often make sense to start from end-to-end tests)
-   Periodically run these against production
    -   Depending on importance of scenario or journey, failure can trigger on-call alert

Benefits/challenges:

-   Often way better at finding out if something's wrong than lower-level metrics
    -   Still, you'll likely need lower-level metrics to help you find the exact location of the issue
-   Make sure it doesn't affect actual production customers!

## Resources

-   Martin Fowler's [Software Testing Guide](https://martinfowler.com/testing/):
    -   [QA in Production](https://martinfowler.com/articles/qa-in-production.html)
    -   [Synthetic Monitoring](https://martinfowler.com/bliki/SyntheticMonitoring.html)
-   Building Microservices (book by Sam Newman)
