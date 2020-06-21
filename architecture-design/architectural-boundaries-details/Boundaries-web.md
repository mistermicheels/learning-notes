---
description: How architectural boundaries apply to the web
last_modified: 2020-05-30T15:54:15+02:00
---

# Boundaries and the web

## Contents

-   [Decoupling the domain from the web](#decoupling-the-domain-from-the-web)
-   [Different representations of objects](#different-representations-of-objects)
-   [Micro frontends](#micro-frontends)
-   [Resources](#resources)

## Decoupling the domain from the web

One boundary that almost always makes sense to draw is the separation between your domain and the actual user interface that the user interacts with

Typical to see `Controller` classes (some other terms are used as well) that take care of the interaction with the user and delegate all real work to the code implementing the actual business logic

In principle, none of your business logic should be aware of how it is shown to the user, including whether or not the UI is a web UI!

## Different representations of objects

Different parts of the system have different goals -> they may also need different representations of the same object!

-   When doing server-side rendering, it often makes sense to have a separate view model that simply holds the data to be shown
    -   Data in the view model could be a transformed version of the data obtained from the domain model (e.g. formatting a date) or could aggregate data from several domain objects
-   Data returned from the API could have a different format or structure than the actual domain objects inside the business logic part of the application
    -   Ideally, the data returned from APIs (or expected by APIs) will be aligned with what the consumers of the API care about
-   If your frontend is a single-page application getting data from the backend over an API, feel free to create separate representations of that data that are more comfortable for the rest of the frontend to work with
    -   Backend is mostly about having consistent information regarding the objects in the system, while frontend is mostly about providing the user with an easy way of interacting with those objects

## Micro frontends

Even in a microservices architecture, it is typical to have a backend consisting of several microservices but a single monolithic frontend on top of it

An alternative are micro frontends, where the frontend is stitched together from multiple independently maintained parts. See [Microservices](../reference-architectures/Microservices.md).

## Resources

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))
