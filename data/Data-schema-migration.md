---
description: Some techniques for migrating the structure of your data
last_modified: 2020-06-14T18:51:13+02:00
---

# Data schema migration

## Contents

-   [Big Bang](#big-bang)
-   [Code First or Data First](#code-first-or-data-first)
    -   [Complication: rolling code deploys](#complication-rolling-code-deploys)
    -   [Schemaless databases and delayed data schema migration](#schemaless-databases-and-delayed-data-schema-migration)
-   [Expand-Contract migrations](#expand-contract-migrations)
-   [Resources](#resources)

## Big Bang

-   Stop system
-   Deploy new code and migrate DB schema
-   Start system

Simple approach but not doable if system needs to keep running!

## Code First or Data First

Code First:

-   Deploy new code code that is compatible with both old and new schema
-   Migrate DB schema
-   Later on, you could remove support for the old schema from the code

Data First:

-   Migrate DB schema in a way that is compatible with both old and new code
-   Deploy new code
-   Later on, you could remove support for the old code from the DB schema

### Complication: rolling code deploys

-   In order to reduce deployment risk, new code is typically deployed using a rolling approach where not all instances of the running code are upgraded at the same time
    -   If something is wrong with the new code, it can be detected before all requests are affected by it
-   This means that part of the system is running new code and part of the system is still running old code
-   Challenges for the migration:
    -   Need to make sure that different versions of the code running at the same time are able to read each other's written data
        -   Example: old code reading an object saved by new code
    -   Need to make sure that different versions of the code running at the same time don't accidentally throw away each other's written data
        -   Example: old code retrieving an object saved by new code and saving it again
-   In some cases, it might be useful to deploy the code in more than one step, especially when performing Data First migrations:
    1.  Deploy new code that still writes according to old structure but is aware of new structure (and can write according to new structure if that is needed to prevent data loss)
        -   During this step, all data is still in old structure, including data written by the new code
    2.  Once that code runs everywhere, deploy new code that writes according to new structure but is still aware of old structure
        -   During this step, some data will already have new structure (but code from the previous step can handle that)
    3.  Migrate all data with old structure to new structure
    4.  Later on, support for the old structure could be removed from the code (once you're sure that you won't need to roll back to a version of the database that has the old structure in it)

### Schemaless databases and delayed data schema migration

-   In case of schemaless databases, you can have data with different structures sitting together
-   This means you're not forced to migrate the structure of your existing data at all. However, if you have different structures in the database, your code must be able to deal with the different structures.
-   This is more or less a mix of Code First and Data First
    -   The database schema is already compatible with both old and new code (similar to Data First)
    -   After you the new code is deployed, you might want to adjust the structure of existing data to match the new structure (similar to Code first)
-   The step of migrating existing data can be delayed for as long as you like, or even doesn't need to happen at all
    -   In this case need to make a tradeoff between the cost and risk associated with migrating the data versus the cost and risk associated with having data with different structures sitting together and thus making code maintenance harder

## Expand-Contract migrations

Very useful with [feature flags](../processes-techniques/Feature-flags.md), where two versions of code may be running alongside each other for quite some time or the code might switch back and forth between the old and new version.

-   Expand database schema to support both the old and new version
-   Once code settles on a specific fixed version, contract the database schema to only support that version

Example:

-   System has orders
-   Data for each order contains the specific address information for that order (potentially duplicated across many different orders for the same customer)
-   New approach toggled by feature flag: separate management of customer addresses, and orders referring to those addresses

Approach for example:

-   Keep current address column in Order table
-   Add nullable column in Order table which references Address table (current code will ignore this column)
-   Change code so it still fills the old address information columns on Order but also creates Address records and links to them from Order. This concept is called _Duplicate Writes_.
-   Perform a one-time data migration, using the existing data in the address information columns to link each Order to an Address. Once this migration is done, the reference from Order to Address can be made non-nullable.
-   At this point, we can support both states of the feature flag.
    -   Code for old behavior will look at the original address column in the Order table
    -   Code for new behavior will look at new Address table and the new column in the Order table that references these addresses
-   Once the feature has been permanently turned on, we can remove the old address information columns from Order (and the code writing to them) as they are not used anymore.

Verifying correctness of migration: _Dark Reads_

-   When reading data (example: getting address info for a specific order), you read from both places where the data is available
-   Trigger an alert if data is not identical

## Resources

-   [Feature Flag Best Practices ebook](https://try.split.io/oreilly-feature-flag-best-practices)
-   [Online migrations at scale](https://stripe.com/blog/online-migrations)
