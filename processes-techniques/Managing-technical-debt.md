---
description: Technical debt and how to deal with it
last_modified: 2021-01-02T18:48:07.387Z
---

# Managing technical debt

## Contents

-   [Defining technical debt](#defining-technical-debt)
-   [Categorizing technical debt](#categorizing-technical-debt)
    -   [Impact](#impact)
    -   [Cost and risk of fixing it](#cost-and-risk-of-fixing-it)
    -   [Contagion](#contagion)
-   [Tracking technical debt](#tracking-technical-debt)
-   [Ideal amount of technical debt](#ideal-amount-of-technical-debt)
-   [Repaying technical debt](#repaying-technical-debt)
-   [Resources](#resources)

## Defining technical debt

Technical debt: things about your system that aren't the way they should be

-   Unreadable code, code duplication, other code smells, ...
    -   Might get created over time if changes are made without proper cleanup
-   Design and architecture that are not a good fit for the system
    -   Can be caused by not evolving them together with the system as needed
    -   Design and architecture that are good fit now might not be good fit anymore next year
-   Lack of proper tests, monitoring and alerting
    -   See [Testing](./Testing.md) and [Testing after production](./testing-details/Testing-after-production.md)
    -   Can lead to fear of improving code/design/architecture, creating even more technical debt!

## Categorizing technical debt

### Impact

-   To what extent does the technical debt affect end users?
    -   Bugs, unexpected behavior, performance issues, ...
-   To what extent does the technical debt affect the development team?
    -   Slowing down implementation, developers needing to keep peculiarities in mind when developing, ...

### Cost and risk of fixing it

-   How much work is it to fix the technical debt?
-   How big is the risk of introducing issues when fixing the technical debt?

### Contagion

If the technical debt continues to exist, how much will it spread? What other parts of the system will it infect?

-   Badly-designed subsystem can lead to awkward code using that subsystem
-   Awkwardly structured data can lead to awkward code working with that data
-   Developers might start following the "conventions" from the bad code, or even copy-pasting it
-   Developers might take shortcuts because technical debt makes it too hard to do things "the right way"

Contagion is an important aspect!

-   If technical debt is isolated and doesn't affect other code, cost/risk of fixing stays more or less constant
    -   Impact on development team might still change over time depending on what the team is working on
-   If technical debt is highly contagious, its impact and the cost/risk of fixing it will likely keep going up as it spreads throughout the codebase

## Tracking technical debt

It can help to explicitly track significant pieces of technical debt in your backlog or issue tracker

-   Makes the technical debt explicit and visible
-   Can prioritize it along with the rest of the tasks
-   Can plan to tackle it along with functional changes to relevant parts

Finding technical debt in existing code

-   You could go through the code and look for [Code Smells](https://sourcemaking.com/refactoring/smells)
-   You could make use of [Static analysis](./Static-analysis.md) tools to detect security issues, common bugs, code smells, duplication, ...
-   Some technical debt might only become obvious once you really start working with the code

Note that technical debt might be created over time by changing code without cleaning up as needed, the context changing in such a way that the current design isn't ideal anymore, ...

## Ideal amount of technical debt

Try to keep it low!

-   Code quality is essential to long-term development speed
    -   Taking on technical debt to build features faster can slow down development of those same features!
    -   Over time, tech debt can make development grind to a halt and bring an organization to its knees
-   Code quality can have a big impact on motivation and employee turnover
    -   Working with bad code is draining
    -   Lack of productivity is frustrating
    -   In severe cases, developers feel their skills get out of date because it's too dangerous to upgrade to a recent version of the language, incorporate modern practices and replace legacy dependencies
-   Technical debt often leads to developers creating even more technical debt
    -   Feeling that effort spent on code quality won't be valued, won't make a difference, ...
        -   Relevant: [The Broken Windows Theory](https://github.com/dwmkerr/hacker-laws#the-broken-windows-theory)
    -   Slow progress and fear of breaking stuff can lead to quick fixes that only create more technical debt
-   Spending the extra time to do things right from the start is often faster than fixing the debt later
    -   See the well-known "cost of change" curve
    -   Fixing things is harder when there's already data in DB, customers using the functionality, other code depending on the badly written or designed code (or even following its "conventions"), ...

Ideal amount of technical debt is not zero!

-   It’s normal to have a certain amount of technical debt
-   Professional software development is about delivering value, only reason for maintainability is that it helps to keep delivering value over time
    -   If there are no places in your codebase that make you think “we could improve this given some more time, but it’s good enough for now”, you are probably making suboptimal use of time and resources
-   For startups, it can make sense to go for "quick and dirty" at first and clean up after establishing product-market fit
    -   Make sure slower development (new features, changes) doesn't prevent actually reaching product-market fit!
    -   Some alternative approaches: [Fail fast](../mindset/Fail-fast.md)
    -   In case of throw-away prototypes, you can go wild with tech debt (just make sure they're really thrown away)

Advice:

-   Try to avoid creating significant technical debt
    -   If time is tight, prefer reducing scope instead of creating a mess
    -   When changing existing code, take some time to clean it up if that makes sense
-   Don't go overboard with avoiding technical debt
    -   Making things better is not always an efficient use of your time
    -   See also [Keep it simple - Effort](../mindset/Keep-it-simple.md#Effort)
-   If you do create technical debt, try to make sure it's isolated from other code and is easy to fix later on

## Repaying technical debt

What to repay?

-   Is the expected benefit from improving the code worth the time investment and risk?
-   Set priorities based on impact, cost/risk of fixing and contagion
    -   Over time, contagious technical debt will probably grow in impact and in cost/risk of fixing it!
-   For big pieces of technical debt, a gradual approach might make sense (pay off in small chunks)

When to repay it?

-   Try to make repaying technical debt a standard, implicit part of the development process
-   It can make sense to clean up any code that you already happen to be working on
    -   Benefit: most effort on parts of code that are often modified (and thus important to keep clean)
-   It can make sense to dedicate a certain percentage of each sprint to tasks for repaying tech debt
-   It can make sense to have dedicated "tech debt reduction" sprints
    -   Sprint after a big release can work well (can fix any pre-release shortcuts, probably still a while until next release)
-   Smaller tech debt issues could be a good way for new developers to get familiar with certain parts of the system, especially if proper regression tests are already in place

Techniques to use when repaying technical debt:

-   [Refactoring](./Refactoring.md) can be useful (note also includes a part on rewrites)
-   Other process and techniques from the notes could be useful as well

## Resources

-   [TechnicalDebt](https://martinfowler.com/bliki/TechnicalDebt.html)
-   [Pragmatic Technical Debt Management](https://www.infoq.com/articles/pragmatic-technical-debt/)
-   [Tech Debt and the Pragmatic Middle Ground](https://blog.pragmaticengineer.com/tech-debt/)
-   [A taxonomy of tech debt](https://technology.riotgames.com/news/taxonomy-tech-debt)
-   [The Birth of Legacy Software – How Change Aversion Feeds On Itself](https://software.rajivprab.com/2019/11/25/the-birth-of-legacy-software-how-change-aversion-feeds-on-itself/)
-   [Technical debt as a lack of understanding](https://daverupert.com/2020/11/technical-debt-as-a-lack-of-understanding/)
-   [The Human Cost of Tech Debt](https://www.infragistics.com/community/blogs/b/erikdietrich/posts/the-human-cost-of-tech-debt)
-   [The Broken Windows Theory](https://github.com/dwmkerr/hacker-laws#the-broken-windows-theory)
-   [Technical Debt: A Repayment Plan](https://www.infoq.com/articles/tech-debt-repayment/)
