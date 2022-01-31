---
description: A very high-level overview of the data store landscape, covering relational databases (SQL), NoSQL and NewSQL data stores
last_modified: 2022-01-31T10:44:35.250Z
---

# SQL, NoSQL, NewSQL

## Contents

-   [Relational databases (SQL)](#relational-databases-sql)
    -   [Tables, rows, relationships and schemas](#tables-rows-relationships-and-schemas)
    -   [SQL](#sql)
    -   [ACID transactions](#acid-transactions)
    -   [Normalization](#normalization)
-   [NoSQL](#nosql)
    -   [Transactions](#transactions)
    -   [Types of NoSQL data stores](#types-of-nosql-data-stores)
        -   [Document store](#document-store)
        -   [Key-value store](#key-value-store)
        -   [Graph database](#graph-database)
        -   [Time-series database](#time-series-database)
-   [NewSQL](#newsql)
-   [Which one to use?](#which-one-to-use)
-   [Hosted data stores](#hosted-data-stores)
-   [Resources](#resources)

## Relational databases (SQL)

-   Also called RDBMS (relational database management system)
-   Have been around for many decades
-   Popular RDBMSes are mature systems and there are lots of developers and database administrators that have several years of experience in dealing with them
    -   This means that there is a wealth of knowledge available on best practices, how to tackle certain issues, etc.
-   SQL standard describing the query language and behavior of relational databases
    -   Still, different databases typically provide a different dialect of that query language and they may differ significantly in their behavior in some cases (although possibly all within the bounds of the standard)

### Tables, rows, relationships and schemas

-   Tables (= _relations_)
    -   Each table is a set of columns, each of a certain type, that can hold data for the rows in the table
    -   Each table has a subset of columns, the table’s _primary key (PK)_, that uniquely identifies each row in the table
    -   There may also be other subsets of columns uniquely identifying each row in the table, known as alternate keys (AK).
-   Relationships
    -   Possible to link rows in a table to rows in another table by including the column(s) of that other table’s primary key
        -   This is called a _foreign key_
        -   If defined correctly, database enforces that foreign key links to actual row in the other table
    -   This way, we can define one-to-one relationships and one-to-many relationships
    -   Also possible to represent many-to-many relationships using an intermediate table to store foreign keys to both tables in the relationship

All of the tables, columns, keys, relationships, etc. are defined in the database schema. The database actively enforces the schema and forbids data that doesn’t match it (incorrect data type for a column, foreign key linking to a row that doesn’t exist, …).

### SQL

SQL (Structured Query Language):

-   Declarative language that allows performing CRUD operations on the data and the database schema 
-   Declarative = you specify _what_ you want your query to do instead of _how_ to do it. The database system itself figures out a how exactly the query will be performed. This can simplify things, but it can also make it challenging to optimize queries that get executed in a sub-optimal way.

### ACID transactions

See [ACID properties](./sql/ACID.md)

### Normalization

See [Normalization](./sql/Normalization.md)

## NoSQL

-   Became popular in the early twenty-first century as an alternative to relational databases
-   The term NoSQL encompasses lots of different data stores with different concepts, approaches, query languages, etc. that offer a solution to some problem for which relational databases are maybe not an ideal solution
    -   In order to achieve this, they generally need to make compromises in terms of features and the guarantees offered by the data store
    -   Depending on the application, it's possible that developers need to foresee some things on the application side that would just be handled by the database if they were using a relational database
    -   Developers used to working with a non-distributed relational database should be especially careful when working with distributed NoSQL databases as those may introduce the possibility for inconsistencies in areas where the developers take consistency for granted

Typical selling point: specialized solution for particular use cases

-   Example: graph databases (see below)

Typical selling point: horizontal scalability

-   Vertical scaling: make your machines more powerful by adding CPU power, memory, faster disks, etc.
    -   Becomes expensive or practically impossible once you reach a certain point
-   Horizontal scaling: add more machines and distribute the load between them
    -   Becomes cheaper than vertical scaling one certain scale is reached
    -   Allows you to keep on scaling up further by adding additional machines
-   NoSQL databases tend to be built for horizontal scaling, while relational databases are typically not very good at it
-   See also [CAP theorem](./CAP-theorem.md)

### Transactions

NoSQL databases typically don't offer transactions with ACID guarantees that relational databases provide

-   Some only provide transactional integrity at the level of a single entry (which may still contain structured data or an array of values)
-   Some don't even provide any form of transactions at all

Strategies for dealing with lack of transactional support:

-   Redesign your data model so you don’t need more transactional support than what the system offers
    -   Document databases often provide powerful update functionality for atomically performing a set of changes at the level of a single document (set new value for one property + increment another property + add a new element to an array property + ...)
    -   The database might provide operations such as "update the first entry matching this filter and return it" that you can use instead of separate retrieve and update operations
-   Perform the required concurrency control at the level of your application
-   Tolerate the possible concurrency issues caused by not having transactions and adjust your application and possibly your users’ expectations to this

### Types of NoSQL data stores

Note: this is not intended to be complete list of all possible types

#### Document store

-   Data is stored as documents containing structured data (think something JSON-like)
-   When performing queries, you can typically retrieve or filter on data at any level inside the documents
-   Typically the main candidate for storing your application’s domain data if you don’t want to store that data in a relational database
-   Example: MongoDB

Fit:

-   Can be a good fit if each piece of data has a hierarchical structure (looks like a tree), as you can just put that entire structure in a document
-   Can be a good fit if some of your fields need to hold structured data (nested data structures, arrays, ...)
    -   Especially true if you want to query based on that structured data, or make updates inside of it
-   Works well for one-to-one and one-to-many relationships
-   Many-to-one and many-to-many relationships can be hard to model and query
    -   Example: you want to store information on actors, movies and which actors played in which movies
    -   One option: include the data regarding actors inside the documents for the movies or vice versa
        -   This is _denormalization_ (see also [Normalization](./sql/Normalization.md)) and will lead to duplicate data and the possibility for inconsistencies
    -   Other option: have documents for actors, documents for movies, and storing references to movies inside actors
        -   Similar to the concept of foreign keys in relational databases
        -   Problem: document stores often do not offer real foreign key constraints, so there is nothing on the database level preventing you from deleting an actor that a movie still refers to
        -   Problem: performing queries that combine data from different documents is often not easy or efficient (you might even need to put all of the logic for this in application code, requiring multiple requests to the DB)

Schemaless?:

-   Often, document stores are _schemaless_
-   This means that the database does not enforce a certain structure of the documents you store in it
-   Typically, this does not mean that there is no schema for the data, but it means that that schema is either implicitly or explicitly defined by your application rather than at the database level
-   Offers more flexibility in the face of changes to the structure of your data
    -   Specifically, it allows data with the old structure to sit next to data with the new structure, without forcing you to migrate the old data to the new structure (yet)
    -   Drawbacks of existence of documents of the same type with different structures:
        -   Your application needs to be able to handle the different structures (can lead to loads and loads of if-statements)
        -   Can make maintenance difficult
    -   Take care to document the changes to the data’s structure and migrate old data when it makes sense

Note: some relational databases actually offer document store capabilities!

-   Example: recent versions of PostgreSQL allows storing JSON data and performing queries based on the contents of that JSON data
-   This can be a good option if some of your data is hierarchical in nature but you still want ACID capabilities
-   If you don’t need to query based on the actual contents of the structured data, you can even just use any relational database and store the data as text in a column

#### Key-value store

-   Made for storing data as a dictionary (key-value map)
    -   All the data is stored in the database as a value with a unique key identifying that value. 
-   Values for different keys can have different data types. Data types offered by a key-value store may include strings, lists of strings, sets of strings and even key-value maps. 
-   It is typically up to the application to determine what the keys look like. For example, if you want to store data for users, you may use the key `user:1` for the user with id 1.
-   You can typically provide an expiration date or TTL for a key, automatically deleting it at a certain time
    -   Can be useful to automatically invalidate tokens stored in the key-value store
    -   Can help to automatically purge old cached data
-   Example: Redis

Fit:

-   Useful if your data looks like a key-value map
-   Popular use case is using a clusters in-memory key-value stores as a very fast distributed cache for often-retrieved data

#### Graph database

-   Represents data as a graph of nodes and relationships between those nodes
-   Typically offer some specialized graph-based algorithms for analyzing the data (shortest path, clustering, ...)
-   Example: Neo4j

Fit:

-   Good fit when your data can naturally be represented as a network of nodes connected by edges that represent relationships between nodes
-   Example: people on a social network site and their friends. If you model this as each person being a node and each friendship being an edge connecting nodes, storing the data in a graph database helps you recommend friends of friends, identify clusters of people that are all friends of each other, etc.

    Note: there exist extensions to RDBMSes (for example PostgreSQL) that offer graph database capabilities as well

#### Time-series database

-   Aimed at storing values that change throughout time
-   Have storage engines and query languages that are optimized for storing time-series data, making it easy and efficient to perform time-based queries that can aggregate huge amounts of data
-   Examples: InfluxDB, SiriDB

Fit:

-   Typical use case: storing data obtained from sensors that are constantly measuring values like temperature, humidity, etc.
    -   Time-series database can make it easy to store a year’s worth of temperature measurements (one measurement each minute) and then retrieve the maximum and minimum measured temperature per week

Note that there exist extensions to RDBMSes that offer time-series database capabilities. 

-   Example: Timescale (builds upon PostgreSQL)

## NewSQL

NewSQL systems are a class of relational database management systems that aim at providing the ACID guarantees of relational databases with the horizontal scalability of NoSQL databases. There are several categories of NewSQL databases:

-   Completely new systems, often built from scratch with distributed deployment being a major focus. They often use techniques that are similar to the techniques used by NoSQL databases. Examples include Google Spanner and CockroachDB. These systems typically have some limitations with regards to the features they support or the extent to which they provide true ACID guarantees.
-   SQL storage engines optimized for horizontal scalability, replacing the default storage engines of relational databases. These storage engines may have some limitations that are not present in the database’s default storage engine.
-   Middleware that sits on top of a cluster of relational database instances. An example is Vitess. Note that these systems may not offer ACID guarantees.

## Which one to use?

-   Choosing which data store to use is a tradeoff and there is likely no “wrong” or “right” choice. 
    -   Choice will likely depend on the kind of data you need to store, the kind of queries you will be performing, the scalability you need, the consistency you need, the knowledge of your team, how well the available tooling fits your use case, etc.
    -   Different options might actually be relatively similar. For example, some relational databases offer support for structured data and some document databases offer support for transactions and schema validation.
-   There is no rule stating that you should use either SQL, NoSQL or NewSQL. 
    -   Example: it is very common to use a relational database for your application’s domain data but use a key-value store for caching purposes. 
    -   It could also be a good idea to store parts of your domain data in a relational database and other parts in a document database, depending on which one is a better fit for which part of the data. Of course, this means you have to keep an additional data store up and running and the team has an additional data store to get familiar with.

## Hosted data stores

When you are evaluating data stores for your project, it is a good idea to also consider the hosted data stores that are offered by cloud providers like AWS or Microsoft Azure. These hosted data stores include SQL, NoSQL and NewSQL data stores and using them could save you the headaches involved in managing your own data store or data store cluster. However, you should be careful regarding the amount of vendor lock-in this generates.

## Resources

-   [Relational database](https://en.wikipedia.org/wiki/Relational_database)
-   [NoSQL](https://en.wikipedia.org/wiki/NoSQL)
-   [Living Without Transactions](https://stackoverflow.com/a/39210371)
-   [Patterns for Schema Changes in Document Databases](https://stackoverflow.com/questions/5029580/patterns-for-schema-changes-in-document-databases)
-   [NewSQL](https://en.wikipedia.org/wiki/NewSQL)
