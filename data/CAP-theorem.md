---
description: The CAP theorem and its implications for distributed data stores
last_modified: 2020-05-30T15:54:15+02:00
---

# CAP theorem

## Contents

-   [Basic idea](#basic-idea)
-   [Criticism](#criticism)
-   [CAP consistency vs. ACID consistency](#cap-consistency-vs-acid-consistency)
    -   [SQL Server example](#sql-server-example)
-   [Resources](#resources)

## Basic idea

This theorem states that it is impossible for a distributed data store to simultaneously provide more than two out of the following three guarantees:

-   _Consistency_: Every read returns either the relevant value as it was written by the latest successful write or an error
-   _Availability_: Every request receives a non-error response
-   _Partition tolerance_: The system keeps working, even if any number of messages is dropped or delayed by the network that connects the different instances

Implications:

> No distributed system is safe from network failures, thus network partitioning generally has to be tolerated. In the presence of a partition, one is then left with two options: consistency or availability. When choosing consistency over availability, the system will return an error or a time-out if particular information cannot be guaranteed to be up to date due to network partitioning. When choosing availability over consistency, the system will always process the query and try to return the most recent available version of the information, even if it cannot guarantee it is up to date due to network partitioning.
>
> In the absence of network failure – that is, when the distributed system is running normally – both availability and consistency can be satisfied

## Criticism

-   Can be misleading if presented as "pick 2 out of 3"
    -   Every distributed system has to assume the possibility of network failures, so actually the trade-off is between consistency and availability
    -   When the network is working correctly, you can still have both consistency and availability at the same time (you don't have to abandon 1 out of the 3 at all times)
-   Notion of consistency is limited and can be confusing
    -   Consistency as defined in CAP theorem is actually linearizability (preventing a read from returning a value that's different from the last written value, basically making it seem like there is only one copy of the data rather than multiple copies which might not have caught up with each other)
    -   There are also other consistency models in the distributed systems research, plus other uses of the term _consistency_ in the data store world
        -   For an overview (not necessarily complete) of consistency models for distributed systems, take a look at [Consistency Models](https://jepsen.io/consistency)
-   Only takes into account network partitions (nodes that are alive but disconnected from each other)
    -   Ignores dead nodes, etc.

Still, the CAP theorem has been of large historical importance as it encouraged people to also explore distributed systems that limit consistency in favor of availability, which can make sense for certain large-scale web services. This has been an important inspiration for the NoSQL movement.

## CAP consistency vs. ACID consistency

See also [ACID properties](./sql/ACID.md)

Both mean something completely different:

-   CAP consistency: Every read returns either the relevant value as it was written by the latest successful write or an error
-   ACID consistency: The execution of the transaction must bring the database to a valid state, respecting the database’s schema

In fact, when relational databases are deployed in a distributed fashion, there are typically different modes available that can have an impact on CAP consistency. 

### SQL Server example

See: 

-   [SQL Server Availability Modes](https://docs.microsoft.com/en-us/sql/database-engine/availability-groups/windows/availability-modes-always-on-availability-groups?view=sql-server-2017)
-   [Offload read-only workload to secondary replica of an Always On availability group](https://docs.microsoft.com/en-us/sql/database-engine/availability-groups/windows/active-secondaries-readable-secondary-replicas-always-on-availability-groups?view=sql-server-2017)

When setting up a high-availability cluster for Microsoft SQL Server, you have the choice between the availability modes _synchronous commit_ and _asynchronous commit_. Synchronous commit waits to return for a transaction until it has effectively been synchronized to the other instances (secondary replicas). Asynchronous commit, on the other hand, does not wait for the secondary replicas to catch up. If asynchronous commit is used and the cluster is configured to allow reads to go directly to the secondary replicas, it is possible that reads return stale data.

## Resources

-   [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem)
-   Designing Data-Intensive Applications (book by Martin Kleppmann)
-   [Consistency Models](https://jepsen.io/consistency)
