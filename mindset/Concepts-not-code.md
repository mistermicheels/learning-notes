---
description: Why concepts are more powerful and important than code
last_modified: 2020-10-18T13:48:48.838Z
---

# Concepts, not code

## Contents

-   [Learning](#learning)
    -   [Concepts are universal and timeless](#concepts-are-universal-and-timeless)
    -   [Compounding](#compounding)
    -   [Learning new technologies](#learning-new-technologies)
        -   [The problem with learning new technologies](#the-problem-with-learning-new-technologies)
        -   [The solution: focus on concepts](#the-solution-focus-on-concepts)
        -   [Discovering new technologies and their concepts](#discovering-new-technologies-and-their-concepts)
-   [Understanding systems](#understanding-systems)
-   [Building systems](#building-systems)
-   [Resources](#resources)

## Learning

Whenever you want to learn something new, focus on the general concepts rather than specific implementations!

### Concepts are universal and timeless

-   The technological landscape is continuously changing, which means that specific in-depth knowledge regarding specific technologies can quickly become useless
    -   Even within a certain programming language or framework, the preferred way of doing things will likely change over time and old way might not even work anymore
-   At the same time, the general concepts have stayed the same!
    -   "Low coupling, high cohesion" is as relevant today as it was in the last century
    -   General ideas on how to write clean code, tackle technical debt, collaborate in a team, ... stay valid
-   New and innovative solutions are typically built out of tried and tested patterns, or at least inspired by them

### Compounding

There is a huge compounding effect when learning concepts:

-   Understanding basic concepts makes it a lot easier to understand advanced concepts
-   Understanding the concepts used by a system makes it a lot easier to understand similar systems in the same domain or even completely different domains
-   Understanding the concepts used by some technology makes it a lot easier to understand other concepts in similar or even completely different technologies
-   Finding similar concepts in different places helps to reinforce or refine your understanding of these concepts
-   All of these concepts sit together in your mental toolbox for problem solving

### Learning new technologies

#### The problem with learning new technologies

-   There are a huge number of existing tools, frameworks, libraries, languages, ...
-   In addition to that, there is a constant stream of new technologies that are coming out
-   All of this makes it impossible to have deep knowledge regarding all of them
-   Even if you could gain deep knowledge about all of them, it would probably not be a good use of your time
    -   Most of these technologies will not be relevant to the stuff you are currently working on
    -   A lot of these technologies will probably never be relevant to anything you're working on
    -   By the time something becomes relevant to you, it might have been deprecated, made obsolete by a new and better alternative, ...
    -   By the time something becomes relevant to you, any specifics you learned about how to use it might be outdated (and thus, pretty much useless)

#### The solution: focus on concepts

-   Go for breadth of knowledge rather than in-depth learning
-   When encountering technology that might be relevant to you in the future, learn just enough about it to understand its main concepts:
    -   What problem does it solve?
    -   What are the concepts it uses to solve that problem?
-   The goal here is to learn just enough to put the technology in your "mental toolbox", allowing you to go back to it when you run into a problem that the technology solves
    -   This takes orders of magnitude less time and energy than learning the technology in-depth
-   Understanding the main concepts and patterns used by the technology can give you inspiration for solving similar or even completely different problems in your own code
-   Only spend the time and effort on in-depth learning for technologies that you are actually using

#### Discovering new technologies and their concepts

-   Check some tech news websites, newsletters or conference schedules
-   When you find something interesting, look at the technology's website, read conference talk descriptions (no need to actually watch the talk) or potentially watch short lightning talks about it

## Understanding systems

-   Getting to know a new codebase:
    -   Learning the concepts the code is built upon allows you to quickly understand how the system works at a high level
    -   Understanding those concepts makes it orders of magnitude easier to make sense of any specific code that you encounter later on
    -   If you want to go through all of the existing code, knowing the concepts beforehand makes this a lot more efficient.
    -   Often, going through all of the existing code would be extremely time-consuming and not that effective. Instead, focus on learning the concepts behind the code.
-   Keeping up with new code:
    -   Especially in large teams, it is impossible to be familiar with all of the new code that is written
    -   Instead, strive to be familiar with the concepts behind the new code that is written
-   Understanding the rest of the system in case the code you work on is only part of it:
    -   You will probably not touch or even be able to see the code for other parts of the system
    -   Instead, focus on knowing the concept used by the system as a whole
    -   Ideally, also understand the main concepts used by each of the system's building blocks, or at least the high-level functionality they provide and the concepts they use in communicating with other parts of the system

## Building systems

-   Instead of just diving in and churning out code, make sure that the concepts that the system will use make sense
-   No matter how well-designed your system is, if the concepts it uses don't match the problem domain well then it could be completely useless
-   No matter how clean the code is, if the concepts your system uses under the hood don't fit the purpose then it's probably going to be unnecessarily awkward and complex to develop and maintain the system

## Resources

-   [On learning new technologies: why breadth beats depth](https://codewithoutrules.com/2019/03/29/learn-new-technologies/)
