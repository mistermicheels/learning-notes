---
description: How architectural boundaries apply to the use of databases
---

# Boundaries and the database

See:

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))

## Contents

-   [Boundaries between the domain and the database](#boundaries-between-the-domain-and-the-database)
-   [Separation at the database level](#separation-at-the-database-level)

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

## Separation at the database level

For larger systems, it can make sense to separate different parts of the application down to the database level. Each part uses different tables or a different database, with no links between data belonging to different parts. This kind of separation is considered good practice when setting up a microservices architecture. You can also do this in monolithic applications, potentially as a stepping stone towards a feature microservices architecture.

Separation at the database level makes it easier to reason about separate parts of the application without having to think about other parts. It also provides more flexibility to change the schema or database technology for a certain part of the system.

When drawing boundaries down to the database level, some data that is relevant to two parts of the system might exist on both sides of the boundary between them

See also [Microservices](../reference-architectures/Microservices.md)
