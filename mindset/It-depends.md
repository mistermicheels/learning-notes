---
description: Everything is a trade-off
last_modified: 2020-11-21T18:14:37.203Z
---

# It depends

## Contents

-   [Basic idea](#basic-idea)
-   [Trade-offs](#trade-offs)
    -   [Make trade-offs explicit](#make-trade-offs-explicit)
-   [No perfect solutions!](#no-perfect-solutions)
-   [Good solutions and flexibility](#good-solutions-and-flexibility)
-   [Best practices](#best-practices)
-   [Tools, not rules](#tools-not-rules)
-   [Test-driving approaches](#test-driving-approaches)
-   [Documenting the decision process](#documenting-the-decision-process)
-   [Implementing the chosen approach](#implementing-the-chosen-approach)
-   [Moving to a different approach](#moving-to-a-different-approach)
-   [Resources](#resources)

## Basic idea

-   What technology should I use for my web application’s back end? _It depends_
-   Should I use a relational or NoSQL database? And which one? _It depends_
-   Should I really have more unit than integration tests? _It depends_
-   Is it bad to have an anemic domain model? _It depends_
-   Should we run our project using SCRUM? _It depends_

## Trade-offs

Almost every decision you make when developing or designing software is a trade-off!

Areas to take into account:

-   initial development effort
-   maintenance effort
-   correctness
-   performance
-   usability

Tradeoffs not only between these factors but also within these areas! E.g. performance for use case A vs performance for use case B

### Make trade-offs explicit

-   Explicitly list the tradeoffs you are making
-   Designing two different solutions and looking at how they compare to each other can help you identify relevant tradeoffs

## No perfect solutions!

 _The Best Solution®_ or _The Right Way™_ typically do not exist!

Every approach will likely have its own drawbacks or limitations that another approach doesn't have.

## Good solutions and flexibility

Instead of looking for perfect solutions, look for two things:

-   Good solutions that make sense and for which we don’t see an alternative that is clearly much better
-   Flexibility through good architecture and coding practices

Choosing between solutions:

-   One that stands out: go for it!
-   Hard time choosing: typically means they are all good! implement simplest one!
    -   Quickest way to working solution
    -   Implementing gives better understanding of problem and benefits/drawbacks of current solution

Flexibility:

-   Good architecture and coding practices provide some degree of flexibility to change your choice later on
-   How much flexibility do we need? _It depends_
    -   Additional flexibility typically comes a the expense of additional layers of abstraction and complexity

## Best practices

Best practices:

-   Widely accepted as good solutions
    -   If there is one clear best practice approach regarding your problem and you don’t see a significant reason not to use it, just go with that approach!
-   Does not mean they are perfect!
    -   Some situations where you would be better off using another approach
    -   Sometimes even several completely different best practice solutions to the same problem!
        -   The more discussion over which is best, the more likely both are valid options

## Tools, not rules

Methodologies (DDD, SCRUM, ...) are tools, not rules!

-   Not necessarily applicable to every situation
-   Not always possible/desired to be completely strict about "rules"
    -   Often makes sense to adjust the details of approach to fit the specific requirements of your project and team
    -   Often, different people already have different interpretations of the rules regarding those details!

## Test-driving approaches

It can help to compare candidate approaches through techniques like prototyping (see also [Fail fast](./Fail-fast.md))

## Documenting the decision process

Document options, trade-offs, ...

Helps to reevaluate approach at a later time if new option pops up or situation changes!

## Implementing the chosen approach

The approach you choose will likely still some drawbacks/limitations, don't let this block you!

-   Actually commit to implementing the chosen approach and giving it a fair chance
-   Don't keep second-guessing your decision after you've made it
-   If you're afraid you'll run into some unforeseen drawbacks/limitations, plan your implementation in such a way that they will turn up sooner rather than later (see also [Fail fast](./Fail-fast.md))

## Moving to a different approach

What if, for some reason, you are convinced that the approach you are currently using is clearly inferior to some other approach?

Even if architecture and code are flexible, there are some costs and risks associated with making the change. The benefits of switching to the other approach may or may not outweigh those costs and risks. 

So, should you make the change? _It depends._

## Resources

-   [Software Architecture is Overrated, Clear and Simple Design is Underrated](https://blog.pragmaticengineer.com/software-architecture-is-overrated/)
-   [Five Worlds](https://www.joelonsoftware.com/2002/05/06/five-worlds/)
