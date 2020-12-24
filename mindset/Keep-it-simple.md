---
description: Some tips for reducing effort and improving results by avoiding needless complexity
last_modified: 2020-12-24T14:15:34.859Z
---

# Keep it simple

## Contents

-   [Architecture](#architecture)
-   [Technology](#technology)
-   [Code](#code)
-   [Features and scope](#features-and-scope)
-   [Approach](#approach)
-   [Processes](#processes)
-   [Effort](#effort)
-   [Don't take it too far](#dont-take-it-too-far)
-   [Resources](#resources)

## Architecture

-   Architectural complexity comes with significant development and maintenance overhead, that overhead might not be worth it
    -   See also [Architectural boundaries - The costs of boundaries](../architecture-design/Architectural-boundaries.md#the-costs-of-boundaries)
    -   Over-engineering is often worse than under-engineering
-   Start simple, evolve as needed based on actual problems that manifest themselves
    -   "Big design up front" doesn't work, because at the point you are making that design you don't know the system and domain well enough yet
    -   Changes in requirements can come at any time and may affect the desired architecture
    -   Evolving a simple architecture is easier than evolving a complex one!
        -   Changing boundaries inside a monolith is orders of magnitude easier than changing boundaries in a system of distributed services
    -   Typical example regarding microservices: projects that split into microservices from the start typically face a lot more problems than projects that start with a well-structured monolith and only split off into services where it provides clear benefits
-   When changing architecture, go for small incremental steps rather than big changes
    -   Less risk, shorter feedback loop, ...
    -   Might make sense to temporarily keep some suboptimal parts, just to ease transition
    -   Changes could be guided by [Architectural fitness functions](../architecture-design/Architectural-fitness-functions.md)
-   What worked for someone else will not necessarily work for you
-   Premature complexity is also a form of technical debt

## Technology

-   By default, pick boring, proven technologies that you know over shiny new ones
    -   Maintaining and learning new technologies comes at a cost. Is that cost worth it in your case?
    -   Spending less time and energy trying out new technologies means you have more time and energy to solve real business problems
    -   When solving a problem with boring, mature technologies, there are likely tried and tested solutions available
    -   Community size and active maintenance are important!
    -   Note: this doesn't mean you should stay stuck with ancient tech forever! As always, [It depends](./It-depends.md)
-   Use existing solutions for technological problems that you do not understand deeply or are not at the core of what you do
    -   _"If the overwhelming majority of your hand-written code isn’t domain-specific and doesn’t relate to the application’s purpose, then you’re using the wrong tools."_ (see [Programming Sucks! Or At Least, It Ought To  - The Daily WTF](https://thedailywtf.com/articles/Programming-Sucks!-Or-At-Least%2C-It-Ought-To-))

## Code

-   Go for "dumb code"
    -   It takes a good developer to write code that looks so simple that any idiot could have written it
        -   "_Any fool can write code that a computer can understand. Good programmers write code that humans can understand._" - Martin Fowler
    -   The simpler and more obvious the code, the easier it is to review, debug, maintain, ...
    -   You know you have a great developer if you give them a complex problem and they solve it using simple building blocks that fit together in obvious ways
-   Don't sacrifice readability and maintainability for performance, unless it's needed to solve a real performance problem

## Features and scope

-   Is a new feature really worth the development/maintenance effort and added complexity in codebase, operations, application user interface, ...?
    -   Code needs to be developed and maintained
    -   Feature needs to be incorporated in user interface, documented, ...
    -   Feature might conflict with other features, now or in the future, from functional or technical point of view
-   Customers asking for a complex feature might be missing an alternative, simpler feature which provides the same or even more benefits
    -   Ask yourself: "What is the user really trying to accomplish"
-   Features that seem important to you might not be important at all to your customers
-   Try to look for information and processes that you can keep out of scope of the system
    -   The fact that something exists in the real world doesn't mean that our system needs to know about it
    -   The system doesn't need to know what happens as part of a certain process (either in the real world or in another system) if it only cares about the result and has a reliable way of getting that result

## Approach

-   "Do the simplest thing that could possibly work"
    -   Start with something ridiculously simple and only add complexity when needed
    -   Avoid non-essential complexity that doesn't add value
    -   In case of doubt between different approaches, try the simplest one first (see also [It depends](./It-depends.md))
    -   Simplicity means it's also easy to adjust if needed
-   Don't solve problems you don't have
    -   Only spend time and energy solving a problem if you are facing it right now or are absolutely sure you will be facing it in the near future
    -   Solving a problem you end up never having is a waste of time and effort
    -   It's very hard to predict exactly what your future problems will look like, so any premature solutions are likely to be solving the wrong problem
    -   Solving a problem you don't currently have makes it very hard to validate your solution
    -   See also [YAGNI](https://martinfowler.com/bliki/Yagni.html)
-   Small, incremental steps
    -   You don't have to solve everything at once, some things can be "good enough for now"
    -   Split problems and look for decisions you can postpone or things you can improve later
    -   Limit scope of discussions
-   Ask yourself: "What problem are we actually solving here?"
    -   When you find yourself solving a sub-problem three levels deep, it might make sense to consider an alternative high-level approach

## Processes

-   Processes are there to streamline the way the team works, not to cause unnecessary delays and frustration
-   When something doesn't work for you, adjust it or try something different
-   When something works for you and solves your problems, there's no need to change it, even if it's not the current flavor of "how things should be done"

## Effort

-   ‘Doing it right’ doesn’t make sense if it costs you more effort without real practical benefits
-   Pareto principle: you can likely get 80% of the benefits by only spending 20% of the effort
    -   20% of the functionality can provide 80% of the value to your end users
    -   20% of the testing can give you 80% of the confidence that your application works
    -   It's not the end of the world if some very rare situations lead to a transaction failing because of deadlock, suboptimal error message, ...
    -   It's not the end of the world if some exceptional cases require additional action by some batch process or even a human
-   Know when to stop optimizing!
    -   The more you optimize, the lower the ROI of additional optimizations and the higher the benefit would be of spending the effort on other things instead
    -   At some point, you need to decide that the current option is good enough
    -   Applies to architecture, code quality, solution approaches, ...
-   Not everything is a priority
    -   Some things are not worth spending more time and energy on, even if you know they could be improved
    -   If you're feeling overwhelmed, find out what the real a priorities are (your team or manager could help)
    -   Pick your battles: not every discussion is a hill you should be willing to die on.
-   Ask for help when it makes sense
    -   If you're struggling with something, you're likely to find a colleague that can help you out
    -   Asking for help is a good way to bond with your colleagues, as it shows you trust them and value their expertise
-   Learning
    -   You don't have to know everything! 
    -   Keep learning, but accept that you will never come close to knowing everything, and neither will anyone else
    -   Learning high-level concepts already goes a long way (see also [Concepts, not code](./Concepts-not-code.md))
    -   It might help to keep a list of "topics to research later"

## Don't take it too far

-   _"Make everything as simple as possible, but not simpler."_ - Albert Einstein
-   Determining how simple something should be is a tradeoff
-   You should probably not try to "simplify away" the unavoidable complexities in your domain (those complexities might even be the reason your system exists)
-   The definition of "good enough" will likely be different based on how crucial the problem you are solving is to the system/domain
    -   It is probably not a good idea to take a lot of shortcuts in the foundations of your codebase/architecture
    -   A situation that occurs all the time in the domain probably deserves some extra effort
-   The definition of "good enough" will need to depend on how high the cost of failure is
    -   See also [Why are we so bad at software engineering?](https://www.bitlog.com/2020/02/12/why-are-we-so-bad-at-software-engineering/)
    -   If the cost of failure is high, it can make sense to do pre-mortems to identify and mitigate potential sources of failure
-   If you want to build a reliable system, you might have to spend more time on proper error handling than on development of the actual happy path!
-   Relaxing quality standards can help you move fast in the beginning, but too much technical debt can slow further development to a crawl and require an enormous amount of time and energy to fix later on
-   As always, [It depends](./It-depends.md)

## Resources

-   [Simplicity, Please - A Manifesto for Software Development](https://www.infoq.com/articles/simplicity-manifesto-development/)
-   [Software Architecture is Overrated, Clear and Simple Design is Underrated](https://blog.pragmaticengineer.com/software-architecture-is-overrated/)
-   [You Are Not Google](https://blog.bradfieldcs.com/you-are-not-google-84912cf44afb)
-   [YAGNI, Cargo Cult and Overengineering - the Planes Won't Land Just Because You Built a Runway in Your Backyard](https://codeahoy.com/2017/08/19/yagni-cargo-cult-and-overengineering-the-planes-wont-land-just-because-you-built-a-runway-in-your-backyard/)
-   [Choose Boring Technology](https://mcfunley.com/choose-boring-technology)
-   [Tech Choices I Regret at Spectrum](https://mxstbr.com/thoughts/tech-choice-regrets-at-spectrum)
-   [Write Stupid Code](https://thorstenball.com/blog/2015/10/22/write-stupid-code/)
-   [Less Dirty Code](https://hackernoon.com/less-dirty-code-2c27321g)
-   [Programming Sucks! Or At Least, It Ought To  - The Daily WTF](https://thedailywtf.com/articles/Programming-Sucks!-Or-At-Least%2C-It-Ought-To-)
-   [The Simplest Thing That Could Possibly Work](http://www.agilenutshell.com/simplest_thing)
-   [YAGNI](https://martinfowler.com/bliki/Yagni.html)
-   [Jonathan Blow on solving hard problems](https://www.youtube.com/watch?v=6XAu4EPQRmY) ([transcript](https://old.reddit.com/r/programming/comments/bx8p52/jonathan_blow_on_solving_hard_problems/eq4rl7j/))
-   [Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle)
-   [The Danger of “Simplicity”](https://asthasr.github.io/posts/danger-of-simplicity/)
-   [I could do that in a weekend!](https://danluu.com/sounds-easy/)
