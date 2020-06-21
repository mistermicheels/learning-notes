---
description: Some ways to avoid service classes getting bigger and bigger
last_modified: 2020-06-13T13:29:49+02:00
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
-   This approach makes it relatively easy to provide undo functionality or show a history of actions (if needed)

Example: virtual file system

-   Situation:
    -   Fat service class with functionality for file creation, file update, file deletion, replacing a folder's contents with contents from an archive, ...
    -   For every call to the service class, all changes must happen within a single DB transaction
    -   All changes generate events that other components can listen to, plus they generate updates to an in-memory representation of the current state of the file system. However, those events and updates are only valid once the entire transaction is committed.
-   Solution:
    -   Each file action (create, update, delete, ...) is implemented as its own class
    -   All of these file action classes share the same interface, which specifies that they return events and in-memory cache updates
    -   Bigger actions (archive import etc.) delegate work to smaller actions that they create
    -   For every call to the service class, it creates the necessary actions based on the received input and also passes a transactional DB connection on construction
    -   Service class collects event and cache updates
    -   When all actions for a service class call have completed, the service class commits the DB transaction, sends events and applies updates to the in-memory file system representation
    -   In this particular case, file actions depended on several lower-level services. Solution: file action factory service with methods for creating each type of action. Each method takes action input + DB connection and calls the action's constructor with action input, DB connection and instances of lower level services.

```typescript
export interface FileAction {
    public executeAndGetResult(): Promise<FileActionResult>;
}

export interface FileActionResult {
    events: FileEvent[];
    cacheUpdates: FileCacheUpdate[];
}
```

## Resources

-   [Service layer - fat service classes?](https://softwareengineering.stackexchange.com/questions/269544/service-layer-fat-service-classes)
-   [Command pattern](https://en.wikipedia.org/wiki/Command_pattern)
