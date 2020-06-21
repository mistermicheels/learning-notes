---
description: An overview of database normalization for relational databases
last_modified: 2020-05-30T15:54:15+02:00
---

# Database normalization

## Contents

-   [Basic idea](#basic-idea)
-   [Normal forms](#normal-forms)
    -   [1NF (first normal form)](#1nf-first-normal-form)
    -   [2NF (second normal form)](#2nf-second-normal-form)
    -   [3NF (third normal form)](#3nf-third-normal-form)
-   [Resources](#resources)

## Basic idea

> Database normalization is the process of structuring a relational database in accordance with a series of so-called normal forms in order to reduce data redundancy and improve data integrity.

Basic idea: avoid the existence of redundant data in your database because it is a source of possible inconsistencies. 

The way to get rid of this redundant data is generally to introduce new tables.

Example: Table with of items with item id, description, manufacturer name and manufacturer country. Storing the manufacturer’s country in every row is a form of redundant data: if we know the manufacturer, we also know the country. And what if we change the manufacturer for a row but forget to change the country? The solution here is to create a separate table for manufacturers, with their country, and refer to that table from the items table.

## Normal forms

Normal forms = formally defined "levels of database normalization"

Normal forms from least normalized to most normalized (see below for ones in bold)

-   UNF: [Unnormalized form](https://en.wikipedia.org/wiki/Unnormalized_form) (no normalization applied yet)
-   **1NF**: [First normal form](https://en.wikipedia.org/wiki/First_normal_form)
-   **2NF**: [Second normal form](https://en.wikipedia.org/wiki/Second_normal_form)
-   **3NF**: [Third normal form](https://en.wikipedia.org/wiki/Third_normal_form)
-   EKNF: [Elementary key normal form](https://en.wikipedia.org/wiki/Elementary_key_normal_form)
-   BCNF: [Boyce–Codd normal form](https://en.wikipedia.org/wiki/Boyce%E2%80%93Codd_normal_form)
-   4NF: [Fourth normal form](https://en.wikipedia.org/wiki/Fourth_normal_form)
-   ETNF: Essential tuple normal form
-   5NF: [Fifth normal form](https://en.wikipedia.org/wiki/Fifth_normal_form)
-   DKNF: [Domain-key normal form](https://en.wikipedia.org/wiki/Domain-key_normal_form)
-   6NF: [Sixth normal form](https://en.wikipedia.org/wiki/Sixth_normal_form)

### 1NF (first normal form)

Meaning: values in columns are atomic (each cell has only a single value)

Example: 

**Book table**

| Title                                            | Subject                 |
| ------------------------------------------------ | ----------------------- |
| Beginning MySQL Database Design and Optimization | MySQL, Database, Design |

Problem: Subject has multiple values in a single cell

Solution: make Subject into its own table

**Book table**

| Title                                            |
| ------------------------------------------------ |
| Beginning MySQL Database Design and Optimization |

**Subject table**

| ID | Name     |
| -- | -------- |
| 1  | MySQL    |
| 2  | Database |
| 3  | Design   |

**Book - Subject table** (many-to-many relationship, needed because book can have multiple subjects and multiple books can share the same subject)

| Title                                            | Subject ID |
| :----------------------------------------------- | :--------- |
| Beginning MySQL Database Design and Optimization | 1          |
| Beginning MySQL Database Design and Optimization | 2          |
| Beginning MySQL Database Design and Optimization | 3          |

### 2NF (second normal form)

Meaning: 1NF + no partial dependencies (values depend on the whole of every _candidate key_)

Candidate key: minimal set of columns whose values uniquely identify a single row in the table

Example:

**Book table**

| Title                                                   | Format    | Author       | Price |
| ------------------------------------------------------- | --------- | ------------ | ----- |
| Beginning MySQL Database Design and Optimization        | Hardcover | Chad Russell | 49.99 |
| Beginning MySQL Database Design and Optimization        | E-book    | Chad Russell | 22.34 |
| The Relational Model for Database Management: Version 2 | E-book    | E.F.Codd     | 13.88 |
| The Relational Model for Database Management: Version 2 | Paperback | E.F.Codd     | 22.34 |

This table has only one candidate key ({ Title, Format })

Problem: only price depends on the entire candidate key, author does not

Solution: extract formats and prices into different table

**Book table**

| Title                                                   | Author       |
| ------------------------------------------------------- | ------------ |
| Beginning MySQL Database Design and Optimization        | Chad Russell |
| The Relational Model for Database Management: Version 2 | E.F.Codd     |

**Format - Price table**

| Title                                                   | Format    | Price |
| ------------------------------------------------------- | --------- | ----- |
| Beginning MySQL Database Design and Optimization        | Hardcover | 49.99 |
| Beginning MySQL Database Design and Optimization        | E-book    | 22.34 |
| The Relational Model for Database Management: Version 2 | E-book    | 13.88 |
| The Relational Model for Database Management: Version 2 | Paperback | 39.99 |

### 3NF (third normal form)

Meaning: 2NF + no transitive dependencies (see example below)

Note: Database is often considered "normalized" if it meets 3NF

Example:

**Book table**

| Title                                                   | Author       | Genre ID | Genre Name      |
| ------------------------------------------------------- | ------------ | -------- | --------------- |
| Beginning MySQL Database Design and Optimization        | Chad Russell | 1        | Tutorial        |
| The Relational Model for Database Management: Version 2 | E.F.Codd     | 2        | Popular science |

Problem: Genre ID and Genre Name both depend on the primary key { Title } but are not independent of each other. Dependency _Title_ -> _Genre Name_ can be deduced from _Title -> Genre ID_ and _Genre ID -> Genre Name_ (this means we have a transitive dependency)

Solution: separate Genre table

**Book table**

| Title                                                   | Author       | Genre ID |
| ------------------------------------------------------- | ------------ | -------- |
| Beginning MySQL Database Design and Optimization        | Chad Russell | 1        |
| The Relational Model for Database Management: Version 2 | E.F.Codd     | 2        |

**Genre table**

| Genre ID | Genre Name      |
| -------- | --------------- |
| 1        | Tutorial        |
| 2        | Popular science |

## Resources

-   [Database normalization](https://en.wikipedia.org/wiki/Database_normalization)
