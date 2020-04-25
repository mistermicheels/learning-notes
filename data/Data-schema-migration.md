---
description: Some techniques for migrating the structure of your data
---

# Data schema migration

See:

-   [Feature Flag Best Practices ebook](https://try.split.io/oreilly-feature-flag-best-practices)

## Contents

-   [Big Bang](#big-bang)
-   [Code First](#code-first)
-   [Data First](#data-first)
-   [Expand-Contract migrations](#expand-contract-migrations)

## Big Bang

-   Stop system
-   Deploy new code and migrate DB schema
-   Start system

Simple approach but not doable if system needs to keep running!

## Code First

-   Deploy new code code that is compatible with both old and new schema (on instance next to instance running old code)
-   Retire old code
-   Migrate DB schema

## Data First

-   Migrate DB schema in a way that is compatible with both old and new code
-   Deploy new code (on instance next to instance running old code)
-   Retire old code

## Expand-Contract migrations

Very useful with [feature flags](../processes-techniques/Feature-flags.md), where two versions of code may be running alongside each other for quite some time or the code might switch back and forth between the old and new version.

-   Expand database schema to support both the old and new version
-   Once code settles on a specific fixed version, contract the database schema to only support that version

Example: database of orders, Order table contains some columns with address information. New approach toggled by feature flag: separate management of addresses in an Address table and orders linking to that table.

Approach for example:

-   Add nullable column in Order which references Address (current code will ignore this column)
-   Change code so it still fills the old address information columns on Order but also creates Address records and links to them from Order. This concept is called _Duplicate Writes_.
-   Perform a one-time data migration, using the existing data in the address information columns to link each Order to an Address. Once this migration is done, the reference from Order to Address can be made non-nullable.
-   At this point, we can support both states of the feature flag.
-   Once the feature has been permanently turned on, we can remove the old address information columns from Order (and the code writing to them) as they are not used anymore.

Verifying correctness of migration: _Dark Reads_

-   When reading data (example: getting address info for a specific order), you read from both places where the data is available
-   Trigger an alert if data is not identical
