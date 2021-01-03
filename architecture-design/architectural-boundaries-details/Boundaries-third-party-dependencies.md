---
description: Why it's important to create boundaries around your dependencies
last_modified: 2021-01-03T11:43:26.271Z
---

# Boundaries and third-party dependencies

## Contents

-   [Main idea](#main-idea)
-   [Boundaries around dependencies](#boundaries-around-dependencies)
-   [Be extra careful with frameworks](#be-extra-careful-with-frameworks)
-   [Resources](#resources)

## Main idea

Take care not to let too much of your code depend on third-party code!

-   External dependencies evolve in a way you do not control
    -   Their newest version including some critical bugfixes may introduce breaking changes in an API you use or even remove the functionality you use
    -   They may stop being properly maintained
-   Your own requirements relevant to the dependency may change
-   All of this can force you to change the way you use the dependency or even replace it with another dependency

## Boundaries around dependencies

Consider creating a boundary around the external dependency that decouples the rest of the system from it (this boundary is sometimes called an _Anti-Corruption Layer_):

-   The public interface of that boundary should be written in terms of what your system needs from the dependency
-   Logic inside the boundary will be specific to the interaction with that particular dependency. 
-   This also applies when the external dependency is another system!
    -   In that case, it often makes sense to set up some kind of validation for the responses from that system

Benefits:

-   If the API of the dependency changes or you replace it, the boundary protects you from having to change all code that used the dependency. As long as you can fulfill the contract specified by the public interface of the boundary, no code outside of the boundary has to be aware of the change.
    -   Especially useful if you consider the dependency to be a temporary solution that is sufficient for now but will most likely need to change in the future. The boundary allows you to avoid premature complexity by going for a simple solution, while keeping your options open regarding the upgrade to a more complex solution.
-   You can also use the boundary to create some automated tests for the specific functionality that your system needs to get from the boundary. By testing against the boundary, you don’t have to change your tests in order to be able to test a new version of the dependency or even a replacement.

## Be extra careful with frameworks

-   Frameworks tend to dictate the structure of your application and may even ask you to base your domain objects on the abstractions they provide. If you allow this, it will be very difficult to get the framework out afterwards.
    -   An opinionated framework dictating the structure of your application can also be a good thing, allowing team to focus on building functionality rather than discussing the ideal structure
-   For more flexibility, it can help to let the framework operate on some kind of separate representation of your domain objects instead of the domain objects themselves. Your boundary could then take care of performing the necessary translations between that separate representation and the actual domain objects.
    -   Can require a lot of overhead in terms of additional classes, getting data in and out of DTOs to pass between layers, taking care of things that your framework would normally automatically take care of, ...
    -   Might not be worth it!
-   Tightly integrating a framework into your application should be a conscious and well-motivated decision

## Resources

-   Clean Architecture (book by Robert C. Martin)
-   Building Evolutionary Architectures (book by Neal Ford, Rebecca Parsons and Patrick Kua) ([summary slides](http://nealford.com/downloads/Evolutionary_Architecture_Keynote_by_Neal_Ford.pdf))
-   [Our Software Dependency Problem](https://research.swtch.com/deps)
-   [Is it common practice to validate responses from 3rd party APIs?](https://softwareengineering.stackexchange.com/questions/410248/is-it-common-practice-to-validate-responses-from-3rd-party-apis)
