---
description: Often, it makes sense to start from the client point of view
last_modified: 2021-10-03T14:52:55.756Z
---

# Client-first design

## Contents

-   [Basic idea](#basic-idea)
-   [Code](#code)
-   [Errors](#errors)
-   [Horizontal layers, frontend and backend](#horizontal-layers-frontend-and-backend)
-   [Public APIs](#public-apis)
-   [Resources](#resources)

## Basic idea

When designing something (functions, classes, methods, APIs, ...), it often makes sense to start from how it's going to be used and base your design on that

This ensures that what you're creating is actually useful and that it makes sense in the context of where it's used

## Code

Client-first design for functions, classes, methods, utilities, libraries, ...

-   When in doubt, first write the code that will be using these functions, classes, methods, utilities or libraries
    -   Helps with ensuring that concepts and structure make sense from the client side
    -   Helps with picking names that make make sense in the context of the client code (see also [Names - Implementer versus user names](../architecture-design/Names.md#implementer-versus-user-names))
    -   Helps to ensure that you're not missing anything that's needed on the client side
    -   Prevents building logic that is actually not needed at all
    -   Prevents building an awkward API that client code will later have to work around or that will need to be changed once client code gets written
-   Avoid writing utilities or shared libraries without knowing how they're going to be used
    -   "Before software can be reusable it first has to be usable" - Ralph Johnson
    -   If it's unclear how exactly the shared code is going to be used, it's probably too early to write it
    -   If you're writing the library purely for external use, find a way to discover how it's really going to be used
        -   It can help to build your own example implementations for different use cases
        -   It can help to design the library with a small representative sample of client developers
        -   It can make sense to gather feedback through alpha/beta programs
    -   It can make sense to write the shared code together with two or more different kinds of client code, as this will prevent you from building something so tied to one client's use case that it's not useful to other clients
-   It can help to build one part of functionality at a time

## Errors

-   When defining custom exception classes or error types, consider including some extra information that can be useful to the caller for figuring out what happened or for proper logging
    -   Can be especially important when building a reusable library
    -   See also [Exception handling - Providing context with exceptions](../architecture-design/Exception-handling.md#providing-context-with-exceptions)
-   Throwing different kinds of errors might not make sense if the caller has only one way to handle them
    -   See also [Exception handling - Client-first design for exception classes](../architecture-design/Exception-handling.md#client-first-design-for-exception-classes)

## Horizontal layers, frontend and backend

Example: frontend -> API layer -> business logic layer -> persistence layer -> DB

Some potential approaches with benefits/drawbacks:

-   **Top-down, front-to-back** (pure client-first)
    -   First design frontend and APIs it needs, base business logic and the rest of the backend on that
    -   Allows building actual frontend with mocked data to get quick detailed feedback from team or customers
    -   Might lead to better user experience, since that is what you actually start from
    -   Might lead to APIs that return too much data or require impractical/heavy operations on the backend side
-   **Bottom-up, back-to-front** (opposite of client-first)
    -   First design DB and business logic, base API on business logic, base frontend on API
    -   Allows starting from a solid technical foundation
    -   Could reduce risk if there are some crucial unknowns regarding low-level implementation that can have high impact on architecture (prototyping could be an alternative, see [Fail fast - Tracer bullets and prototypes](../mindset/Fail-fast.md#tracer-bullets-and-prototypes))
    -   Might lead to a frontend with bad user experience because it's based on a more technical perspective
    -   Might lead to APIs that are impractical to use for the frontend and require the frontend to make more calls, stitch data together at the client side, ...
    -   Might require the API to be adjusted once the frontend is written
-   **Outside-in**
    -   First design frontend user experience as well as the DB and business logic, then build API layer together with detailed frontend implementation
    -   Can be a good approach if it's really clear what the main concepts are
    -   Might lead to a mismatch between what the frontend requires and what the backend can offer
-   **Middle-out**
    -   First design API as "contract" between frontend and backend, then design actual frontend and rest of backend
    -   Allows taking into account the needs of both backend and frontend in the API design
    -   Allows parallel implementation of frontend and backend once the contract is in place
    -   Hard to get this right
        -   Typically some frontend needs or backend limitations are only discovered during implementation
        -   Might require adjustments to API as frontend and backend are written

Note: there is no right or wrong here!

-   Best approach depends on context!
-   Could make sense to combine them
-   Could make sense to switch between them as you go
-   Keep in mind potential pitfalls listed above
-   Regardless of where you start, it helps to have some awareness of how the part you're currently focusing on affects others parts

Interesting alternative: **thin vertical slices**

-   Instead of working based on horizontal layers, build thin slices of full-stack functionality
-   If slice is thin enough, all the technical building blocks can be designed together
-   Might need a good foundation of existing full-stack functionality first

## Public APIs

-   Similar to writing shared libraries (see above, [Code](#code))
    -   Others will be building client code that builds on top of the public API
    -   If same API will also be used internally, take care not to build API that is too tied to your internal use case
    -   If API is purely for external use, find a way to discover how it's really going to be used (own example implementations of client use cases, input from small representative sample of client developers, alpha/beta programs, ...)
-   Similar to frontend from horizontal layers (see above, [Horizontal layers, frontend and backend](#horizontal-layers-frontend-and-backend))

## Resources

-   [Build software from front-to-back](https://www.happyvalley.io/posts/build-front-to-back/) ([HN comments](https://news.ycombinator.com/item?id=23179850))
-   Some articles from c2 wiki:
    -   [Proving Top Down Design Harmful](https://wiki.c2.com/?ProvingTopDownDesignHarmful)
    -   [Two Ways To Design](https://wiki.c2.com/?TwoWaysToDesign)
    -   [Bottom Up Programming](https://wiki.c2.com/?BottomUpProgramming)
    -   [Middle Out](https://wiki.c2.com/?MiddleOut)
