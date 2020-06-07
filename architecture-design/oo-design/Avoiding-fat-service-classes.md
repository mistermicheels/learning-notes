---
description: Some ways to avoid service classes getting bigger and bigger
---

# Avoiding fat service classes

## Contents

-   [Basic idea](#basic-idea)
-   [Approach: split into sub-services](#approach-split-into-sub-services)
-   [Approach: delegate to focused classes](#approach-delegate-to-focused-classes)
-   [Resources](#resources)

## Basic idea

-   In a lot of applications, you have service classes that act as a facade for lower-level domain logic and also contain coordination and control logic
-   These service classes tend to grow over time and can become so "fat" that they are difficult to maintain

## Approach: split into sub-services

Basic idea:

-   Identify different areas of functionality within the fat service class
    -   Potential way to split: identify sub-concepts
    -   Potential way to split: retrieval of data vs. changing data
-   Create a separate service for each area
-   If needed, you can create a helper service for sharing common functionality
-   Either the old fat service class acts as a facade to these more specific service classes, or clients call the sub-services directly

## Approach: delegate to focused classes

Basic idea:

-   Identify the actions that the fat service class is performing
    -   This could be as simple as "1 public method = 1 action"
-   Create a separate class to represent each action
    -   It might make sense to have all of these actions implement a common interface, especially if there are some "cross-cutting concerns" that need to be taken care of regardless of the specific type of action
-   The old fat service class creates the actions and then delegates to them
    -   Typically each call to the fat service class will create one or more instances of the action classes based on the specific input received
-   The old fat service class takes care of cross-cutting concerns if needed

This can be seen as a form of the [Command pattern](https://en.wikipedia.org/wiki/Command_pattern)

Benefits:

-   Class per action means that we get some very focused classes
-   Class per action means we can easily compose higher-level actions out of lower-level actions
-   This approach makes it relatively provide undo functionality or show a history of actions (if needed)

Example: virtual file system

-   Fat service class with functionality for file creation, file deletion, replacing a folder's contents with contents from an archive
-   Action class for create, for delete, ...
-   Action class for replacing a folder's contents with contents from an archive delegates to action classes for create and delete
-   Cross-cutting concerns:
    -   For every call to the service class, all actions must happen within a single DB transaction
    -   All actions generate events and updates to an in-memory representation of the current state of the file system, but those cannot be applied until the entire transaction is committed
    -   Solution:
        1.  Service class passes transactional DB connection when constructing the actions
        2.  Actions return events and updates to be applied to in-memory file system representation, service class collects them
        3.  When all actions for a service call have completed, service class commits DB transaction, sends events and applies updates to in-memory file system representation

## Resources

-   [Service layer - fat service classes?](https://softwareengineering.stackexchange.com/questions/269544/service-layer-fat-service-classes)
-   [Command pattern](https://en.wikipedia.org/wiki/Command_pattern)
