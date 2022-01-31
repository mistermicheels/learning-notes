---
description: How and why to use locking with relational databases
last_modified: 2022-01-31T14:29:20.416Z
---

# Optimistic and pessimistic locking in SQL

## Contents

-   [Why locking?](#why-locking)
-   [Optimistic locking](#optimistic-locking)
-   [Pessimistic locking](#pessimistic-locking)
-   [Combining different strategies](#combining-different-strategies)
-   [Optimistic locking implementation using SQL](#optimistic-locking-implementation-using-sql)
    -   [WHERE](#where)
    -   [OUTPUT/RETURNING or a separate SELECT query](#outputreturning-or-a-separate-select-query)
-   [Pessimistic locking implementation using SQL](#pessimistic-locking-implementation-using-sql)
-   [Locking rows versus locking objects](#locking-rows-versus-locking-objects)
-   [Alternatives](#alternatives)
    -   [Atomic updates and database-level restrictions](#atomic-updates-and-database-level-restrictions)
        -   [Database-level checks for status of related object](#database-level-checks-for-status-of-related-object)
        -   [Find one and update](#find-one-and-update)
    -   [Higher transaction isolation levels](#higher-transaction-isolation-levels)
-   [Resources](#resources)

## Why locking?

Concurrency!

Some scenarios:

-   Your application lets users manage items. Each item has a long description. One of your users starts editing the description of item A at 10:00 and saves his changes at 10:02. Meanwhile, another user starts editing the same item’s description at 10:01 and saves it at 10:03. Because the original description that the second user started from did not yet contain the changes made by the first user, the changes made by the first user are lost without either user being notified about it.
-   Your application communicates with the database through an ORM using the common approach where you retrieve the current version of an object, make some changes to it and then save the entire resulting object to the database. Some user or process changes the same object right after you retrieved it, so the object you are saving does not contain those changes. This leads to your application overwriting the changes with stale data.
-   Your application allows linking items to a group, but only if the group has status “Active”. This restriction is not enforced at the database-level. Before linking an item to a group, you verify that the group has the correct status. However, just before you save the item, another user or process changes the status of the group to “Inactive”. Once you commit, the item is now linked to an inactive group.

## Optimistic locking

(some prefer the term "optimistic concurrency control"  because, unlike pessimistic locking, it does not explicitly lock resources)

-   Perform most of the operation under assumption that no conflicting operations have occurred
-   Just before saving/committing, verify that no conflicts have occurred and abort otherwise

In SQL, two approaches:

-   Compare actual data to data you based yourself on when performing the operation
-   Using a version number or timestamp that changes ever time the data changes

Can be used to retrieve object, make some changes to it and then save and verify that no other changes have been made in the meantime. Could also use same mechanism to verify that a certain object you needed simply didn't change.

Benefits:

-   Flexibility: don't have to care about where or when the "base version" was retrieved. Could have been in different transaction, could have been 15 minutes ago when a user started editing, ...
-   Deadlocks are less likely and it's straightforward to prevent them by always saving object in same order (DB-level locks are only acquired when saving)

Drawbacks:

-   If conflict does occur, you need to deal with operation being aborted
    -   Retrying can make sense in some scenarios
        -   Example: ORM retrieves object, makes changes and immediately saves it. If the operation fails, we can retrieve the most recent version and then try making our changes on that one.
        -   Note: a conflict means that data has changed, might invalidate some precondition!
        -   Note: retry attempts should likely be limited, leading to the possibility for failure again!
    -   Retrying does not make sense in first scenario (users concurrently editing descriptions), because it would just let users unknowingly overwrite each other's changes again. Here, we need user input (e.g. manual merging of changes)!
-   Not ideal if there's lot of conflicting access to the same resource
    -   In that case, you would be aborting operations all the time

## Pessimistic locking

-   Assume conflicting operations will occur
-   Actively block anything that might lead to a conflict

Works by actively locking database rows (or even entire tables) that you need in your operation.

Types of locks:

-   Shared locks (read locks): 
    -   use on data you just need to stay the same until your operation completes
    -   allow other shared locks on the same data
-   Exclusive locks (write locks):
    -   use for reading and writing data you want to update
    -   do not allow any other lock on the same data before transaction is committed or rolled back

Attempts to obtain a lock when it's not allowed will typically block until the conflicting locks are released -> deadlock potential!

Benefits:

-   Completely prevents conflicts from occurring! 
    -   Could actually be best-performing strategy in high-concurrency environments

Drawbacks

-   Misses the flexibility of optimistic locking: everything needs to happen inside same DB transaction
    -   Impractical for scenarios that need to wait for user input (and what if input never comes?)
    -   Can limit options for the way codebase is organized
-   Could unnecessarily limit concurrency
-   Special care needed to prevent deadlocks!
    -   Locks acquired at start of operation -> more locking
    -   Less flexibility regarding order in which locks are obtained (e.g. if you need to retrieve some data based on earlier-retrieved data)
    -   It helps to immediately require the most restrictive locking level you will need during the operation

## Combining different strategies

 It is possible for different locking strategies to exist at different levels in your application!

Example for scenario where users can edit item descriptions:

-   Require users to "check out" item before description can be changed (pessimistic locking)
-   At level of DB communication, we could still use optimistic locking to deal with conflicts caused by users concurrently trying to check out the same item

## Optimistic locking implementation using SQL

(examples assume isolation level Read Committed, which is the default level in several popular relational databases and even the lowest available level for some)

(examples use PostgreSQL dialect)

### WHERE

```sql
UPDATE items
SET name = 'newNameA',
    version = version + 1
WHERE id = 1 AND version = 1
```

-   Version number is used to check for conflicts
-   Application verifies number of updated rows (returned from DB), if that is 0 we know that a conflict has occurred and we can roll back the transaction

Note: DB-level locks are still acquired when performing the actual update! This can lead to DB deadlocks if you're not careful.

```sql
--Transaction A                 -- Transaction B
-- 1                            -- 2
BEGIN TRANSACTION               BEGIN TRANSACTION

UPDATE items                    UPDATE items 
SET name = 'newNameA',          SET name = 'newNameB',
    version = version + 1          version = version + 1
WHERE id = 1 AND version = 1    WHERE id = 2 AND version = 1

-- 3 - blocks                   -- 4 - deadlock
UPDATE items                    UPDATE items 
SET name = 'newNameD',          SET name = 'newNameC',
    version = version + 1          version = version + 1
WHERE id = 2 AND version = 1    WHERE id = 1 AND version = 1

COMMIT TRANSACTION              COMMIT TRANSACTION
```

The problem: the second update statement in transaction A depends on transaction B being committed or rolled back, while the second update statement in transaction B depends on transaction A being committed or rolled back!

Solution: make sure to always lock rows in the same order (flexibility of optimistic locking makes this easy)

### OUTPUT/RETURNING or a separate SELECT query

```sql
UPDATE items
SET name = 'newName', version = version + 1
WHERE id = 1
RETURNING version
```

Application verifies returned version and rolls back transaction if necessary (we know there was a conflict if version has increased by more than 1 relative to the one we had).

For databases not supporting the OUTPUT or RETURNING clause, a separate SELECT statement can be used. 

Note that, even without the RETURNING statement, the above query locks the row until the end of the transaction.

## Pessimistic locking implementation using SQL

Pessimistic locking typically performed at row level, but similar locks can also be obtained for an entire table (if you are only interested in some specific rows, use row-level locking so you don’t unnecessarily limit concurrency)

Shared lock on row (held until commit/rollback of the entire transaction):

```sql
SELECT description
FROM the_table 
WHERE id = 1
FOR SHARE
```

Exclusive lock on row (held until commit/rollback of the entire transaction):

```sql
SELECT description
FROM the_table 
WHERE id = 1
FOR UPDATE
```

## Locking rows versus locking objects

A single object does not always correspond to a single row in the DB!

Example: order containing order lines, 1 table for orders and 1 for order lines, the row for an order contains some data based on data in order lines. What if users concurrently add order lines?

Some approaches:

-   Optimistic locking where order has version number that is increased whenever the order or its order lines are changed
-   Pessimistic locking with lock on order row whenever we update order or its lines
-   Pessimistic locking on order lines table also possible, but row-level locking does not prevent adding new rows!

## Alternatives

### Atomic updates and database-level restrictions

Basic idea: structure data and application in such a way that all updates are made using atomic UPDATE queries that only update exactly the relevant data

-   Could be useful for simple CRUD apps
-   Tricky if value A depends on value B but they can be changed separately
-   Tricky if relationships are involved
-   Does not solve the problem of data being lost if multiple users concurrently edit the description for the same item!

#### Database-level checks for status of related object

When the validity of an update depends on the status of a related object, you might also be able to put the checks for that at the database level and rely purely on the [ACID](./ACID.md) guarantees provided by the DB. For example, let's say we can link items to a group, but only if the group has status “Active”. We can enforce this at the DB level if we link items to a separate table holding IDs for active groups. This way, if we have a transaction adding an item to a group and a concurrent transaction making that group inactive (thus removing it from the active groups table), the DB will not allow both transactions to succeed.

#### Find one and update

Interesting example: using a single query, find a row matching a certain condition and also update it so it doesn't match the condition anymore (example uses SQL Server dialect)

```sql
UPDATE TOP (1) tickets
SET is_available = 0
OUTPUT inserted.ticket_id
WHERE is_available = 1
```

This is similar to, for example, MongoDB's `findOneAndUpdate`. The above approach makes sure that the same ticket is not reserved twice, even with multiple clients running this query at the same time.

If you want to accomplish the same using a separate `SELECT` query and `UPDATE` query, you would need to foresee some explicit optimistic/pessimistic locking or use a higher transaction isolation level (see below).

Note that some other ways of performing the update using a single query do not provide the same guarantees as the query above. For example, this PostgreSQL query is prone to race conditions when executed concurrently by multiple clients and might reserve the same ticket twice:

```sql
WITH cte AS (
    SELECT ticket_id
    FROM tickets
    WHERE is_available = true
    LIMIT 1
)
UPDATE tickets t
SET is_available = false
FROM cte
WHERE t.ticket_id = cte.ticket_id
RETURNING t.ticket_id;
```

Running this query has more or less the same effect as running a separate `SELECT` query and `UPDATE` query. By the time this query gets to the `UPDATE` part, it's possible that the ticket returned from the `SELECT` has already been updated by another client. In order to prevent race conditions for this query, we'd need to use pessimistic locking by including `FOR UPDATE` in the `SELECT`. Alternatively, we could introduce optimistic locking by adding `AND is_available = true` to the `WHERE` clause of the `UPDATE`, but then we might get no ticket ID back while there are actually still plenty of available tickets in the DB.

### Higher transaction isolation levels

(higher than Read Committed)

See [Transaction isolation levels](Transaction-isolation-levels.md)

-   Lack of flexibility: For this to work, everything you do as part of an operation needs to happens inside the same database transaction (like pessimistic locking)
-   Lose control over what exactly is locked and when
    -   Increases likelihood of deadlocks if database uses locking to implement transaction isolation
-   Behavior varies widely between database vendors or even between different versions of the same database
    -   Probably not the best option for applications that need to support multiple databases
-   Does not solve the problem of lost updates in the example with multiple users concurrently editing the same item’s description

## Resources

-   [Concurrency Control](https://en.wikipedia.org/wiki/Concurrency_control)
-   [PostgreSQL Returning Data From Modified Rows](https://www.postgresql.org/docs/current/static/dml-returning.html)
-   [PostgreSQL Explicit Locking](https://www.postgresql.org/docs/current/static/explicit-locking.html)
-   [SQL Server Transaction Locking and Row Versioning Guide](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-2017)
