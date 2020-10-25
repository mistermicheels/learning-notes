---
description: A way to build flexibility into your codebase, allowing some features or alternate code paths to be toggled on or off at will
last_modified: 2020-10-25T21:56:09.027Z
---

# Feature flags

## Contents

-   [Basic idea](#basic-idea)
-   [Feature flag use cases](#feature-flag-use-cases)
-   [Categorizing feature flags](#categorizing-feature-flags)
    -   [Lifetime](#lifetime)
    -   [Dynamic nature](#dynamic-nature)
    -   [Flags changing throughout their lifetime](#flags-changing-throughout-their-lifetime)
-   [Implementation techniques](#implementation-techniques)
    -   [Basic flag check](#basic-flag-check)
    -   [Additional layer of decision logic](#additional-layer-of-decision-logic)
    -   [Injecting decisions](#injecting-decisions)
    -   [Injecting strategies](#injecting-strategies)
-   [Where to put toggle points](#where-to-put-toggle-points)
-   [Feature flag configuration](#feature-flag-configuration)
-   [Feature flags and testing](#feature-flags-and-testing)
-   [Feature flags and database changes](#feature-flags-and-database-changes)
-   [Managing the number of flags](#managing-the-number-of-flags)
-   [General best practices](#general-best-practices)
-   [Resources](#resources)

## Basic idea

Feature flags = a way to build flexibility into your codebase, allowing some features or alternate code paths to be toggled on or off at will

Simple example:

```javascript
function calculateTotal() {
    if (newAlgorithmEnabled) {
        return calculateTotalUsingNewSummationAlgorithm();
    } else {
        return calculateTotalUsingOldSummationAlgorithm();
    }
}
```

Point where we decide which behavior to invoke based on state of flag = _toggle point_

Typically, there is a _toggle router_ that determines the state of the flag in a dynamic way. Example:

```javascript
function calculateTotal() {
    if (featureIsEnabled("use-new-calculation-algorithms")) {
    // ...  
```

Toggle router gives more flexibility:

-   State of the flag could potentially be changed from within the code by making a call to the toggle router
    -   Useful for testing
-   State of the flag could be determined based on config file, DB, or even the current user executing the request

## Feature flag use cases

-   _Decoupling deployment from release_: Feature flags allow a team to deploy a new version of the codebase, containing some code for an unfinished new feature, without that new feature affecting the users yet. This is particularly useful when practicing [Trunk Based Development](https://convincedcoder.com/2019/02/16/Trunk-based-development/).
-   _Incremental releasing_: 
    -   _Canary release_ or _percentage deploy_: Use feature flags that are toggled on or off dynamically based on the user to turn a feature on for a small percentage of the users and monitor its effect before rolling out the feature to all users.
        -   Is essentially a way to test in production, with real user behavior and real data, while limiting risk
    -   _Ring deploys_: Same mechanism, but the difference is that the users are not selected randomly but are rather chosen based on risk. You could start with internal users, then add a very small _canary group_ of randomly selected real users, then include registered beta testers, etc.
-   _A/B testing_: When deciding between two approaches (or whether or not to change something or keep it), you can use feature flags to enable approach A for a group of users and approach B for another group of users. Monitoring of the different groups should then help you decide which approach to choose.
-   _Kill switches_: Feature flags can be used to temporarily switch off resource-heavy features when the system is under heavy load (think of an e-commerce website on Black Friday).
-   _Plan management_: Some services use feature flags to offer a different feature set to different users based on how expensive their subscription is.
-   _Incremental infrastructure migrations_: Feature flags can be used to perform infrastructure migrations on production in small steps (each toggled by a flag) that can be rolled back if needed by turning off the flag. After each step, the team can verify that the system still works correctly.

## Categorizing feature flags

### Lifetime

-   Some flags exist for days, weeks, months
    -   Example: flags used for A/B testing
-   Some flags exist for months, years or even entire system lifetime
    -   Example: kill switches
    -   Example: flags for plan management

The longer the lifetime of a flag, the more careful you need to be about choosing the location of its toggle point(s) and ideally making sure there is only a single toggle point that decides what to do based on the flag.

### Dynamic nature

-   Static flags: only change through actual code changes or configuration file changes
    -   Example: using feature flags to disable unfinished features in released code
-   More dynamic flags: allow their value to be changed at runtime (for example from some kind of admin UI)
    -   Example: kill switches
-   Most dynamic flags: state depends on the current user
    -   Example: flags for A/B testing

The more dynamic a flag is, the more complex the toggle router will need to be.

### Flags changing throughout their lifetime

During its lifetime, the same flag could fulfill different kinds of use cases and potentially need to be implemented and managed in different ways. 

Example, building a feature that recommends products to customers based on what other similar customers have bought. 

-   During development: unfinished code for the feature is already deployed but is disabled in production through a static feature flag in a config file
-   Once developed, we use A/B testing to test the effect on users. 
-   If the feature has a positive effect, we decide to enable it for all customers. However, as it is a performance-intensive feature, we could still keep the flag as a kill switch which can be toggled at runtime.

In the different phases of its lifetime, it could also make sense for the flag to be managed by different teams (development team, sales team, ops team, …).

## Implementation techniques

### Basic flag check

Basic implementation with toggle router:

```javascript
function calculateTotal() {
    if (featureIsEnabled("use-new-calculation-algorithms")) {
    // ...  
```

Limitations:

-   Using a magic string seems kind of brittle
-   A single flag could toggle multiple algorithms in multiple places. In this case, that knowledge is spread across the actual toggle points

### Additional layer of decision logic

```javascript
// shared features config
const features = {
    useNewSummationAlgorithm() {
        return featureIsEnabled("use-new-calculation-algorithms");
    }
}

// toggle point
function calculateTotal() {
    if (features.useNewSummationAlgorithm()) {
    // ...  
```

Additional layer of decision logic, keeping track of the relationship between flags and specific functionality

Limitations: 

-   `calculateTotal`still needs to know about feature toggles, making it hard to test in isolation.

### Injecting decisions

```javascript
function calculateTotal(config) {
    if (config.useNewSummationAlgorithm) {
    // ...  
```

Now, `calculateTotal` has no idea that feature toggles exist. The only thing it knows is that its behavior can change, for whatever reason, based on the config object it receives. Here, that config object is passed as an argument, but it could also be passed when constructing the enclosing object.

### Injecting strategies

Even more flexible and maintainable alternative: use the Strategy pattern.

-   Inject the summation algorithm into the method or the enclosing object. 
-   The method itself doesn’t need to have any idea that its behavior can be changed dynamically. 

```javascript
function calculateTotal(summationAlgorithm) {
    const sumOfItems = summationAlgorithm(items);
    // ...  
```

Benefits:

-   This is a good way to keep toggling out of generic, reusable code
-   If there are multiple places where summation is affected by the feature flag, there can now be a single toggle point (at a higher level) that instantiates the correct summation algorithm to use

## Where to put toggle points

Option A: at edges of system

-   Point where API requests enter the system is typically the point where we have the most knowledge about the actual user making the call, which is vital for dynamic flags
-   Keeping toggling logic out of the core can help with maintainability
-   Toggle points could be put at the level of the user interface, for example deciding whether or not to show a button triggering certain functionality
    -   In this case, an unfinished feature could already be exposed as an API in the back end, but users will never call that API as long as the button for triggering the feature is not shown.

Option B: in the core of the system, close to the functionality they toggle

-   Could be the case for technical flags toggling how something is implemented internally
-   This means that the core of your system needs to know about the feature flags or at least the fact that different modes of operation are possible
    -   Could make maintenance and testing of the core a bit more challenging
-   The core doesn’t always have the necessary context (for example, full info about the current user) to make the decision
    -   Possible to make the actual on/off decision at the edge of the system and then pass it down to the core

## Feature flag configuration

Note: dynamic flag does not necessarily mean dynamic configuration! For example, flags for plan management change value depending on user (very dynamic), but their configuration could even be hardcoded.

Approaches for managing feature flag configuration:

-   _Hard-coded or baked in_
    -   Feature flag configuration is stored in the actual code or set as part of the build process.
    -   Can work for flags guarding unfinished features, where we never want those features to be enabled in production
-   _Command line variables, environment variables or config files_: 
    -   Could be useful the value of a flag should be able to change without having to rebuild the application
    -   Restart is often needed in order to use the new configuration
    -   May be challenging to keep flag configuration consistent across multiple servers or processes
-   _App database_: 
    -   Single source of truth that is potentially shared across multiple servers. 
    -   Allows the configuration to be changed at runtime, often through some kind of admin UI. 
        -   There may be some limitations imposed on which users can change the configuration for certain flags.
-   _Feature management system_: 
    -   Dedicated system specifically aimed at managing feature flag configuration. 
    -   Provide a UI for managing the configuration, including limitations on who can change what. There may even be an audit log tracking when changes were made and by who. 
    -   Often provide mechanisms to ensure that any changes made to the configuration are propagated quickly to all systems that need to know about them. 
    -   May provide tools that help with integrating knowledge about flag configuration and certain application metrics, helping to analyze the effect of turning a certain flag on or off.
-   _Configuration overrides_: 
    -   In some cases, it makes sense to allow feature flag configuration to be overridden, for example by passing a special cookie, query parameter or HTTP header.

General tips, regardless of the chosen approach:

-   Try to keep a clear separation between feature flag configuration and other kinds of configuration
-   Try to include some documentation or metadata (owner, purpose, …) with the feature flag configuration if your approach allows it
-   Try to foresee a very straightforward way for checking the current flag configuration for a running system. Some of the above approaches already provide this through a UI. It can also help to just foresee a simple API that returns the current configuration

## Feature flags and testing

Feature flags determine the behavior of your application. This means that they make it a bit more challenging to properly test the application.

It can help to keep toggle points outside the core of your system where possible. In that case, you can already test the core without having to worry about feature flags.

At some point, you will have to test the system at a level where it is affected by feature flags. In theory, each feature flag means an exponential increase in possible configurations to test. However, in practice, a lot of feature flags will not interfere with each other because they toggle completely unrelated functionality.

A pragmatic approach to testing could be the following:

-   Follow the best-practice convention that a toggle in “on” position means “new behavior” and a toggle in “off” position means “old behavior”
-   Test with current prod config + the flags you intend to turn on
-   Test the fallback configuration (just current prod config, without the flags you intend to turn on)
-   Potentially also test with all flags in “on” position. This can help prevent surprises in the future by detecting regressions in some features that we don’t intend to turn on yet.

## Feature flags and database changes

See [Data schema migration](../data/Data-schema-migration.md)

## Managing the number of flags

Feature flags mean additional complexity, testing effort, etc. -> try to limit the number of feature flags in your system. 

Potential new flags: consider other possibilities

-   Ideally, you could design the feature in such a way that even its first version already has some value or at least has no negative impact on customer experience (so no need for a feature flag)

Existing flags:

-   Make sure each flag has an owner who is responsible for making sure the flag is removed at an appropriate time
-   Determine expiry date for the flag
    -   Can even be enforced through tests that fail if flag exceeds expiry date (_time bombs_)
-   Upper limit on # flags. If upper limit reached, remove an old flag first before adding new one
-   Some feature management systems can help with the detection of obsolete flags by looking for flags that have been either 100% on or 100% off for a long amount of time.

## General best practices

-   _Clear scope_:
    -   The name of a flag should indicate what part of the system it affects, what the purpose of the feature it and ideally also at which layer the feature sits. An example naming convention is `section-purpose-layer`.
-   _Maintain consistency_:
    -   Consistency = being consistent in which flags are turned on for the user
    -   When doing percentage deploys and increasing the percentage, make sure that users for which the feature flag was previously in the “on” state still have the flag turned on
    -   What if users start using the application before logging in (e.g., e-commerce)?
        -   Cookie with a visitor ID, use the visitor ID to determine which features are turned on for the user, and keep using that same visitor ID after the user has logged in
-   _Server-side decisions_:
    -   Try to keep decisions regarding whether or not a feature is enabled on the server side
    -   Makes it a lot easier to manage feature flag states and keep them up to date
    -   Prevents tech-savvy users from playing with flag state themselves
-   _Integrate monitoring with feature flagging_:
    -   Feature flags can have an effect on business metrics like conversion rates, but also on technical metrics like CPU use. Take care to make sure that you can link changes in these metrics to changes in feature flags so you can properly analyze the effect of a flag. 
    -   It may make sense to store some feature flag information with analytics events

## Resources

-   [Feature Toggles (aka Feature Flags)](https://martinfowler.com/articles/feature-toggles.html)
-   [Effective Feature Management ebook](https://launchdarkly.com/effective-feature-management-ebook/)
-   [Feature Flag Best Practices ebook](https://try.split.io/oreilly-feature-flag-best-practices)
