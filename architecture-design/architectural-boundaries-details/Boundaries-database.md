---
description: How architectural boundaries apply to the use of databases
last_modified: 2020-11-21T18:14:37.148Z
---

# Boundaries and the database

## Contents

-   [Boundaries between the domain and the database](#boundaries-between-the-domain-and-the-database)
-   [Separation at the database level](#separation-at-the-database-level)
-   [Resources](#resources)

## Boundaries between the domain and the database

Typically makes sense to draw a boundary between the actual domain logic and the database (unless your application is a thin layer around the database that doesn’t really have any domain logic)

One widespread convention: _Repository_ pattern:

-   All interaction with the database is encapsulated inside Repository classes
-   The domain logic interacts with these classes, without having to know anything database-specific

```java
interface UserRepository {
    getUsers(): Promise<User[]>;
    getUser(id: string): Promise<User>;
    saveUser(user: User): Promise<void>;
    deleteUser(id: string): Promise<void>;
}

class SqlServerUserRepository implements UserRepository {
    // implement UserRepository methods by talking to SQL Server
}

class UserService {
    constructor(private repository: UserRepository) { }

    async updateName(id: string, newName: string) {
        const user = await this.repository.getUser(id);
        user.setName(newName);
        await this.repository.saveUser(user);
    }
}
```

If the domain logic is using the repository interface, then it also becomes easy to swap out the `SqlServerUserRepository` for a different implementation, for example an in-memory repository for testing purposes.

```java
class InMemoryUserRepository implements UserRepository {
    // implement UserRepository methods using in-memory storage
}
```

The _Repository_ pattern also makes it easy to implement _caching_. Ideally, the repository takes care of caching values and invalidating the cache as needed, without other code even being aware that there is any caching at all.

## Separation at the database level

For larger systems, it can make sense to separate different parts of the application down to the database level

-   Each part uses different tables or a different database
-   No direct links (like foreign keys) between data belonging to different parts
-   Considered good practice when setting up a microservices architecture
    -   Sharing of database tables between services introduces tight coupling, potential data corruption in case of conflicting code between the services, ...
-   Can also do this in monolithic applications, potentially as a stepping stone towards a future microservices architecture
-   Easier to reason about separate parts of the application without having to think about other parts
-   More flexibility to change the schema or database technology for a certain part of the system

When drawing boundaries down to the database level, some data that is relevant to two parts of the system might exist on both sides of the boundary between them

See also [Microservices](../reference-architectures/Microservices.md), and specifically [Microservices - Data duplication and bounded contexts](../reference-architectures/Microservices.md#data-duplication-and-bounded-contexts)

## Resources

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))
