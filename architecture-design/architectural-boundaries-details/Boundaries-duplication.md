# Boundaries and duplication

See:

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](https://www.slideshare.net/thekua/building-evolutionary-architectures))

## Contents

-   [False duplication](#false-duplication)
-   [Data duplication and bounded contexts](#data-duplication-and-bounded-contexts)

## False duplication

Watch out for _false duplication_!

-   Real duplication: duplicates always have to change together
    -   This is what the DRY (Don’t Repeat Yourself) principle wants you to avoid
-   False duplication: code/structures/... that are identical now but likely to change at different times or for different reasons
    -   Common with vertical slicing, where certain functionalities may start out looking similar but end up diverging significantly
    -   Can also happen with horizontal slicing, for example the apparent duplication between a database row and the corresponding structure we send to the UI
        -   It may be tempting to pass the database row directly to the UI, and in some cases this can be a good idea, but it isn’t hard to imagine that the structure of the data to show in the UI and the structure of the data in the DB could have to change independently of each other
    -   The fact that two things are the same at this moment does not necessarily mean that they are real duplicates and that that apparent duplication is a bad thing
    -   Attempts to get rid of false duplication tend to lead to unnecessary coupling through shared code, which will then come back to bite you when the “duplicates” suddenly need to change independently of each other

## Data duplication and bounded contexts

See [Microservices]\(
