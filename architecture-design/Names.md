---
description: Some ideas on finding good names
last_modified: 2022-01-27T17:10:02.926Z
---

# Names

## Contents

-   [Intention-revealing names](#intention-revealing-names)
-   [Meaningful distinctions](#meaningful-distinctions)
-   [Consistency](#consistency)
-   [Searchable names](#searchable-names)
-   [Avoiding overly long names](#avoiding-overly-long-names)
    -   [Why very long names are bad](#why-very-long-names-are-bad)
    -   [Don't go overboard with self-documenting code](#dont-go-overboard-with-self-documenting-code)
    -   [Don't include data types](#dont-include-data-types)
    -   [Don't include unnecessary context](#dont-include-unnecessary-context)
    -   [Don't include unnecessary specifics](#dont-include-unnecessary-specifics)
    -   [Don't include words that don't mean anything](#dont-include-words-that-dont-mean-anything)
    -   [Avoid "and" or "or"](#avoid-and-or-or)
-   [Solution domain names](#solution-domain-names)
-   [Implementer versus user names](#implementer-versus-user-names)
-   [Names and design](#names-and-design)
-   [Names and legacy code](#names-and-legacy-code)
-   [Resources](#resources)

## Intention-revealing names

Name should be explicit about what something is supposed to be, without requiring additional comments

Bad:

```java
int elapsed; // elapsed time in seconds  
int created; // days since creation
```

Good:

```java
int elapsedTimeSeconds;
int daysSinceCreation;
```

## Meaningful distinctions

When dealing with similar but different things, go for names that make it clear which is which

Bad:

```javascript
function canAddCustomer(customer) {
    for (const cust of customerService.getCustomers()) {
        if (customer.name === cust.name) {
            return false;
        }
    }
    
    return true;
}
```

Good:

```javascript
function canAddCustomer(newCustomer) {
    for (const existingCustomer of customerService.getCustomers()) {
        if (newCustomer.name === existingCustomer.name) {
            return false;
        }
    }
    
    return true;
}
```

## Consistency

Pick one word per concept and use that consistently

Example: "fetch" vs. "get" vs. "retrieve"

-   Don't use different ones for code that is basically doing the same thing
-   If different ones mean different things (for example, "get" for already retrieved values and "fetch" when retrieving from DB), be consistent about it

## Searchable names

For public constants or other things used in a wider scope, use specific names that make them easy to search for if needed

Rule of thumb: "length of name should correspond to its scope"

## Avoiding overly long names

### Why very long names are bad

-   Distract from the actual operations that are being performed
-   Hard to scan visually
    -   Especially bad if there are subtle differences between similar names
-   Force extra line breaks which interrupt the flow of the code
-   Long class names discourage developers from declaring variables of that type
-   Long method names distract from their argument lists
-   Long variable names obfuscate the logic

### Don't go overboard with self-documenting code

-   Self-documenting code is good, but don't take it too far by including everything you know into the name
    -   Instead of `checkIfCityIsKnownAndStreetIsInCity`, go for `verifyAddress`
-   A somewhat long function with a few comments indicating logical blocks could be a lot more readable and maintainable than a bunch of small functions with overly long and specific names
    -   The harder it is to come up with a short and clear name, the more likely it is that you're taking the splitting too far
    -   The need to go with a very long name can indicate that the function you've split off just doesn't make too much sense on its own

### Don't include data types

Bad:

```java
String nameString;
List<Employee> employeeList;
```

Good:

```java
String name;
List<Employee> employees;
```

### Don't include unnecessary context

Code with unnecessary context:

```typescript
class UserService {
    constructor(private userRepository: UserRepository) {}

    getUserByUserId(userId: number) {
        return this.userRepository.getUserByUserId(userId);
    }
}
```

Unnecessary context:

-   Since we're in `UserService`, it's obvious that we are getting users, the repository is a user repository and provided IDs will be user IDs unless stated otherwise
-   Same for `UserRepository`

Improved version:

```typescript
class UserService {
    constructor(private repository: UserRepository) {}

    getById(id: number) {
        return this.repository.getById(id);
    }
}
```

Note: sometimes, additional context _is_ necessary!

-   Inside an `Address` class, it's clear what `state` means
-   Used separately in another context, a variable named `state` could contain anything (especially since "state" is a generic term in software development), so `addressState` would be better

### Don't include unnecessary specifics

Once a name makes it clear what it refers to and what it doesn't refer to, any additional info is redundant

Examples:

-   `superStrongFinalBoss` doesn't add more value than `finalBoss` if there's only one final boss or if all final bosses are super strong
-   `PayingCustomer` doesn't add more value than `Customer` if all customers are paying

### Don't include words that don't mean anything

Some generic words that often don't mean anything when added to a name:

-   Data
-   State
-   Amount
-   Value
-   Manager
-   Engine
-   Object
-   Entity
-   Instance

Rule of thumb: does the name still mean the same if you remove the generic word?

-   If yes, remove it
-   If no, keep it (or try to find a better name)

### Avoid "and" or "or"

Function names using "and" or "or" to combine parts typically mean the function is doing too much

Ways to improve this:

-   Break apart into smaller pieces
-   If the two things should really always happen together:
    -   Consider finding a better name for that entire operation
    -   Consider creating something else that encapsulates the combination of the smaller pieces

Exceptions:

-   "getXOrThrow" can be a very useful pattern to indicate a function that will throw when it can't find what it's looking for

## Solution domain names

Use solution domain names (algorithms, design patterns) where it makes sense, since those are obvious to other developers familiar with them

Examples:

-   OrderObserver
-   JobQueue

Note: Not all developers are familiar with all algorithms/patterns!

-   "AccountVisitor" might be confusing to developers not familiar with Visitor pattern
-   Potential solutions:
    -   Look for another name (although this might confuse developers already familiar with the pattern)
    -   Look for a simpler solution without the complexity from the pattern
    -   Educate the team on useful patterns for your codebase

## Implementer versus user names

Prefer names that make sense in the context of client code over names that describe implementation (in this context, user = developer writing client code)

See also [Client-first design](../processes-techniques/Client-first-design.md)

Example from C++: `log2p1()`

-   What it does: return binary logarithm of the input value, plus one
    -   Name is exactly this
-   Why it's useful: result is the number of bits needed to store the input value
-   Why the name is bad:
    -   Name is only obvious to someone who already knows how number of bits is calculated
    -   Anyone looking at the code using it will have to make the same connection
-   Better name: `bit_width()`
    -   Obviously relevant to developer wanting to calculate required number of bits
    -   Immediately clear when looking at code using it

Example of an exception to this: `popcount()`

-   What it does: execute the `popcount` instruction
-   Why it's useful: counts the number of bits set to 1
-   Why the name seems bad:
    -   The "pop" has nothing to do with "push", it's an abbreviation for "population"
    -   Even "population count" doesn't mean a lot to someone not familiar with it
-   Why the name is actually good: "popcount" is the standard name for a function doing this, so anyone familiar with bit manipulation will be looking for this name

## Names and design

-   Bad names make it harder to build a mental model of the code, which also makes it harder to create a good design
-   If it's hard to name something, this can be an indicator that the thing you're trying to name is not designed well
    -   Could be taking on too many responsibilities
    -   Could be missing a crucial part

## Names and legacy code

When dealing with legacy code, it can make sense to temporarily go with "bad" names that are overly long and almost describe the entire implementation. This way, it's at least clear what a piece of code is doing. Then, when you're more confident, you can start actually improving the design and improving names in the process.

While you're trying to make sense of a codebase, `get_response_id_and_add_response_to_db` can be a helpful name. Or even `get_response_id_and_probably_use_db` if you haven't been able to fully untangle the function's implementation yet.

See also [Is it fine to use "AND" in a function name?](https://understandlegacycode.com/blog/improving-legacy-function-names/)

## Resources

-   Clean Code (book by Robert C. Martin)  ([summary of relevant chapter](https://dzone.com/articles/naming-conventions-from-uncle-bobs-clean-code-phil))
-   [It's probably time to stop recommending Clean Code](https://qntm.org/clean) ([relevant comment about long names](https://qntm.org/clean#komment5efa2bc6c7130))
-   [Self Documenting Code](https://ahungry.com/blog/2020-01-02-Self-Documenting-Code.html)
-   [Long Names Are Long](http://journal.stuffwithstuff.com/2016/06/16/long-names-are-long/)
-   [Naming Things: Implementer vs. User Names](https://foonathan.net/2019/11/implementer-vs-user-names/#content)
-   [Naming Things in Code](http://journal.stuffwithstuff.com/2009/06/05/naming-things-in-code/)
-   [Is it fine to use "AND" in a function name?](https://understandlegacycode.com/blog/improving-legacy-function-names/)
