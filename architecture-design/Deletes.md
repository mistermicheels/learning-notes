---
description: What to consider when deleting things
last_modified: 2022-01-27T17:10:02.917Z
---

# Deletes

## Contents

-   [Hard deletes vs soft deletes](#hard-deletes-vs-soft-deletes)
    -   [Hard deletes](#hard-deletes)
    -   [Soft deletes](#soft-deletes)
-   [References and deletes](#references-and-deletes)
    -   [Checking whether deletion is allowed](#checking-whether-deletion-is-allowed)
    -   [Cleaning up references](#cleaning-up-references)
    -   [Dealing with references to missing objects](#dealing-with-references-to-missing-objects)
-   [Resources](#resources)

## Hard deletes vs soft deletes

### Hard deletes

(also called physical deletes)

Basic idea: when deleting something, actually delete it from the DB

Benefits:

-   Deleted data is really gone (not making the table and its indexes bigger, not slowing down queries, ...)
-   You cannot accidentally include deleted data in queries
-   You could potentially have your DB automatically cascade deletes for you

Drawbacks/challenges:

-   Restoring data is harder
    -   If you need to be able to restore the data, you need some kind of archiving (to CSV, JSON, database export, ...)
    -   Hard to allow restoring data from within the application
        -   However, maybe your users don't really need that? Maybe all they need is better protection against accidental deletes or a backup/export functionality?
    -   Hard to enforce referential integrity and business rules when restoring
    -   Schema might have changed between the delete and the restore!
-   Requires separate history-keeping (if you actually need that history)
    -   Could be audit log
    -   Could be archive table where you copy deleted records to before actually deleting them from the primary table
    -   Typically requires additional insert query next to the normal delete query, so could be slower than just updating a flag like with soft deletes (see below)

### Soft deletes

(also called logical deletes)

Basic idea: when deleting something, keep it in the DB but mark it as deleted

-   Could be marked using a boolean flag (or a deletion timestamp, which gives you some more info)

Benefits:

-   Very easy to restore deleted data
    -   You could even allow users to restore deleted data from within the application
-   Deleted data is still there for historical purposes
    -   No need to manually copy the data to some archive table in case we want to keep it somewhere
    -   Note: This does still not replace a proper audit trail (see below)

Drawbacks/challenges:

-   Need to be careful not to retrieve "deleted" data for normal queries
    -   Some ORM libraries can help with this
    -   Could create a database view excluding the deleted data and use that view by default when querying
    -   Becomes even trickier when JOINs etc. are involved
-   Deleted data stays in the system, taking up space and possibly impacting performance
    -   Need to manually clean up soft-deleted data that you want to permanently delete
    -   Could be mitigated by setting up some kind of time-based permanent deletion (example: all soft-deleted data is permanently deleted after 30 days)
    -   In some cases, it might make sense to allow certain users to perform hard deletes (note that this prevents any kind of subsequent restoring from within the application)
    -   Note: you may be required to fully delete certain data because of security, privacy or compliance reasons
-   Query performance
    -   A lot queries are going to need your deletion flag, so it probably makes sense to include it in DB indexes
    -   If you expect a lot of data to be deleted with pretty much all queries ignoring deleted data, it could make sense to create a partial/filtered index holding _only_ the non-deleted data
        -   Helps with index size
        -   Note: make sure that any queries retrieving deleted data are still sufficiently performant!
    -   You could also consider actually keeping the deleted data in a different table but with the same structure as the table holding non-deleted data (this is actually going in the direction of hard deletes + archiving)
-   Tricky with hierarchical data
    -   Example: Project has tasks that have subtasks. Deleting an object should delete everything below it.
    -   Store deletion flag only on parent or also on everything below it?
        -   If only on parent: when directly retrieving objects that have a parent, we would need to check the parent to see if they're deleted
        -   If also on everything below: harder to get this right when deleting
        -   If also on everything below: what if object is deleted, then its parent is deleted, then its parent is restored?
            -   We would expect the object that was first deleted to still be deleted, but this would require distinguishing between directly deleted objects and indirectly deleted objects (potentially with different flags)
-   Should uniqueness constraints include deleted objects?
    -   If yes, could be confusing to users
    -   If no, make sure that the uniqueness constraint still allows multiple deleted objects with the same value!
    -   If no, what if restoring one of them would violate the uniqueness constraint?
-   If system enforces quota based on amount of data, does that include soft-deleted objects or not?

Note: Soft deletes still cannot replace a proper audit trail!

-   Doesn't protect against accidentally overwritten or corrupted data
-   If keeping history is the goal, a "deleted" flag is likely not sufficient. You'd typically want to track when something was deleted, by who, in what context, ... 

## References and deletes

There might be other objects holding references to the object you are deleting, which can cause some complications

### Checking whether deletion is allowed

If your application has a single DB and you're using real foreign keys, the DB won't allow you to delete an object that other objects still refer to

-   Potential approach: first check if anything is pointing to the object, then delete it
    -   Drawback: coupling! Having this kind of check means that the code for managing the object needs to know about everything that can reference the object, leading to increased coupling and a high chance of circular references
        -   See also [Circular dependencies](./Circular-dependencies.md)
    -   Drawback: race conditions possible if new reference to the object is added after the check but before the deletion
        -   If you have real foreign keys, the DB will still prevent the delete, but you need to handle the error
-   Potential approach: perform the delete and let the DB generate an error if anything still points to the object
    -   Drawback: not easy to turn DB errors into informative error messages to display to the user (might also introduce a lot of coupling by requiring the code for managing the object to know about everything that can reference the object)

If you're not using foreign keys for the references, the DB does not enforce consistency for the references

-   Example: microservices (each a different DB)
-   Example: decoupled parts within a modular monolith (either using same DB or not)
-   Checking references would increase coupling, and in case of microservices it pretty much guarantees circular dependencies between services
-   Race conditions very hard to prevent
-   Recommended approach: don't check, just delete

Alternative approach: soft deletes (see above)

### Cleaning up references

If you don't have real foreign keys, there might be objects pointing to deleted objects

-   Potential approach: code that does delete also deletes references
    -   Same coupling drawbacks as above
-   Potential approach: use events to trigger cleanup
    -   Code performing delete sends deletion event, other code can listen to the event and perform cleanup accordingly
    -   Code performing delete (and sending the event) doesn't need to know about who reacts to the event and how
    -   No full guarantee that nothing will point to a deleted object (what if system crashes before event is processed, ...)
-   Simplest approach: don't clean up references to deleted object, just deal with them (see also below)

In case you are using soft deletes, you need to consider whether references to soft-deleted objects should also be cleaned up or not (plus what should happen in case of a restore)

### Dealing with references to missing objects

If you don't have real foreign keys, it can be impossible to guarantee that you will never have any objects pointing to a missing object

-   Could have had a race condition
-   Deletion events could not have been processed yet
-   If an object in one DB points to an object in another DB, we can always have references to missing objects even if we don't delete anything!
    -   Example: we create object A in DB 1, we create object B in DB 2 pointing to object A, then some data corruption occurs in DB1 and we need to restore an earlier backup

Recommended approach: tolerate absence of referenced entity, or at least fail gracefully

In case of soft deletes, you need to consider what to do if an object refers to a soft-deleted object

## Resources

-   [What Are Soft Deletes, and How Are They Implemented?](https://www.brentozar.com/archive/2020/02/what-are-soft-deletes-and-how-are-they-implemented/)
-   [Soft-deletion is actually pretty hard](https://medium.com/galvanize/soft-deletion-is-actually-pretty-hard-cb434e24825c)
-   [Are soft deletes a good idea?](https://stackoverflow.com/questions/2549839/are-soft-deletes-a-good-idea)
-   [Physical vs. logical / soft delete of database record?](https://stackoverflow.com/questions/378331/physical-vs-logical-soft-delete-of-database-record)
-   Monolith to Microservices (book by Sam Newman) ([relevant excerpt](https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/ch04.html))
