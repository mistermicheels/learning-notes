---
description: These techniques allow breaking large changes into chunks of smaller changes that don't break the system
last_modified: 2022-01-31T10:44:35.327Z
---

# Branch By Abstraction and application strangulation

## Contents

-   [Branch by abstraction](#branch-by-abstraction)
    -   [Basic idea](#basic-idea)
    -   [Anatomy of the abstraction layer](#anatomy-of-the-abstraction-layer)
    -   [Why not real branches?](#why-not-real-branches)
    -   [Real-world example](#real-world-example)
-   [Application strangulation (also known as Strangler pattern)](#application-strangulation-also-known-as-strangler-pattern)
    -   [Basic idea](#basic-idea-1)
    -   [Real-world example](#real-world-example-1)
-   [Resources](#resources)

## Branch by abstraction

### Basic idea

Branch by Abstraction is useful if the team needs to replace a certain component of the system, but this needs to be spread out over multiple commits.

Basically, this is how it works:

-   Write an abstraction layer on top of the component you need to replace
-   Make clients call the abstraction layer instead of the original component
    -   Could happen in multiple commits
-   Now, use the abstraction layer to switch over to the new component as it is being built. The new layer of indirection could already forward some calls to the new component, or there could be a toggle indicating which component implementation to use.
    -   Will typically happen in multiple commits
-   Once the new component is fully built and the abstraction layer doesn’t call the old component anymore, get rid of the old component
-   Get rid of the abstraction layer

### Anatomy of the abstraction layer

Several possibilities:

-   Interface that both old and new implementation implement
    -   Allows you to choose which of the implementations (old or new) to instantiate when a consumer requires an object conforming to that interface
-   Actual class that delegates to old or new implementation as needed
    -   Could be based on some flag (built into the code or in a configuration file) that allows developers working on the new implementation to test it while others are not affected by it yet.
    -   Could use the new implementation for some calls and the old implementation for others.
-   Actual layer in application’s architecture
    -   Example: if you are moving to a new persistence framework and you are using a layered architecture, you could already have an abstraction layer in the form of repositories that encapsulate all interaction with the database. This could allow you to make the change one repository at a time, while repositories you didn’t touch are still using the old persistence framework

### Why not real branches?

Drawbacks of using branches for these kinds of big changes:

-   Making large changes means that your branch will probably touch a large part of the codebase. The fact that the changes are large also means you will probably spend a long time working on them, giving the rest of the team plenty of time to make changes to the parts of the codebase you touch in a way that conflicts with what you are doing.
-   It’s even worse if your team also uses long-lived branches for regular feature development, because that increases the chances that the rest of the team are making incompatible changes that you don’t know about until the team has already invested a lot of time in them.

Benefits Branch by Abstraction:

-   Allows making changes in an incremental way while keeping the system running at all times
-   You can still collaborate with other developers in one single branch, meaning that potential conflicts are detected immediately
-   Because the system keeps on working, you could choose to release a working version of the system containing a half-completed migration

See also [Trunk Based Development](./Trunk-Based-Development.md)

### Real-world example

See [Move Fast and Fix Things](https://github.blog/2015-12-15-move-fast/)

GitHub saw the need to replace a critical part of their platform (merges) with a new implementation

-   change needs to happen without downtimes while deploying on average 60 times a day
-   unacceptable to break existing functionality

The solution: branch by abstraction!

Their abstraction layer: [Scientist](https://github.com/github/scientist)

-   wraps both old and new behavior
-   always runs the old behavior
-   decides whether to also run new behavior or not
-   measures the durations of all behaviors
-   always returns what old behavior returns
-   swallows and logs any exceptions thrown by new behavior
-   logs any discrepancies between the results obtained from the old and new behavior
    -   similar to the _Duplicate Writes_ and _Dark Reads_ in Expand-Contract data migrations (see [Data schema migration](../data/Data-schema-migration.md))

This allowed them to test the new implementation on actual production data, comparing both results and performance. After fixing some bugs, it allowed them to be confident enough to completely switch over to the new behavior in production

## Application strangulation (also known as Strangler pattern)

### Basic idea

Very similar to Branch by Abstraction, but operates at different level:

-   Branch by Abstraction happens within a single codebase, using abstraction mechanisms of the programming language
-   Application strangulation could be used to migrate between different applications potentially written in completely different languages. The abstraction layer typically comes in the form of a reverse proxy that decides whether to call the API of the old application or the API of the new application (this could depend on the specific call being made and will likely change throughout the migration)

See the real-world example below, or another real-world example: [How Shopify Reduced Storefront Response Times with a Rewrite](https://engineering.shopify.com/blogs/engineering/how-shopify-reduced-storefront-response-times-rewrite).

### Real-world example

See [Bye bye Mongo, Hello Postgres](https://www.theguardian.com/info/2018/nov/30/bye-bye-mongo-hello-postgres)

The Guardian used application strangulation to move from MongoDB to PostgreSQL, keeping their system working while performing the migration. MongoDB would stay their main source of truth until the migration was completed, but in the meantime they also needed to make sure that all of their data got migrated into PostgreSQL and that the system was able to run on PostgreSQL only once fully switched over.

Branch By Abstraction could have been an option here, but there was very little separation of concerns in the original application so introducing an abstraction layer would have been costly and risky. Instead, decision was made to build a whole new application next to the old one.

Once the new application was running next to the other one, the team created a reverse proxy that worked as follows:

1.  Accept incoming traffic
2.  Forward the traffic to the primary API and return the result to the caller
3.  Asynchronously forward the traffic to the secondary API
4.  Compare the results from both APIs and log any differences

After migrating the existing data, any differences between the results from both APIs would indicate bugs that needed to be solved. If the team got to the point where there were no differences being logged, they could be confident that the new API works in the same way as the old API. Switching the primary and secondary API in the proxy allowed the team to essentially switch to the new API while still having a fallback in the form of the old API that was still receiving all requests.

The migration of existing data itself also made use of the fact that both applications had the same API. The flow was as follows:

1.  Get content from the API backed by MongoDB
2.  Save that content to the API backed by PostgreSQL
3.  Get the content from the API backed by PostgreSQL
4.  Verify that the responses from (1) and (3) are identical

Finally, when everything was working with the new API as primary, the team got rid of the proxy and the old API in order to complete the migration.

Note that, during the period in which both APIs were running next to each other, calls for both reads and writes were being forwarded to each API and the results were compared. This is very similar to the _Duplicate Writes_ and _Dark Reads_ in Expand-Contract data migrations (see [Data schema migration](../data/Data-schema-migration.md))

## Resources

-   [Introducing Branch By Abstraction](https://paulhammant.com/blog/branch_by_abstraction.html)
-   [Branch By Abstraction](https://trunkbaseddevelopment.com/branch-by-abstraction/)
-   [BranchByAbstraction](https://martinfowler.com/bliki/BranchByAbstraction.html)
-   [Make Large Scale Changes Incrementally with Branch By Abstraction](https://continuousdelivery.com/2011/05/make-large-scale-changes-incrementally-with-branch-by-abstraction/)
-   [Application strangulation](https://trunkbaseddevelopment.com/strangulation/)
