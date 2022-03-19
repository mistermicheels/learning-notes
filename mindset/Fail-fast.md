---
description: On keeping your feedback loops short
last_modified: 2022-03-19T11:07:39.841Z
---

# Fail fast

## Contents

-   [Basic idea](#basic-idea)
-   [General tips](#general-tips)
-   [Architecture, design and code](#architecture-design-and-code)
-   [Development process](#development-process)
    -   [Tracer bullets and prototypes](#tracer-bullets-and-prototypes)
-   [People](#people)
-   [Resources](#resources)

## Basic idea

If your approach is going to fail, you want to realize that as soon as possible

-   You want to run into problems when it's still cheap and easy to fix them or correct course
-   It doesn't make sense to invest a lot of effort into something that isn't going to work anyway

Basically, it’s about **making the feedback loop as short as possible** so you can quickly abandon things that won't work without wasting more effort on them

If your feedback loop is short enough, the process of **trying things and learning from mistakes** can actually be a lot more effective than trying to get it right immediately, because you gain a lot of knowledge and experience along the way. See also [Pragmatism and imperfectionism - Consider going for imperfect action now instead of possibly perfect action in the future](Pragmatism-imperfectionism.md#consider-going-for-imperfect-action-now-instead-of-possibly-perfect-action-in-the-future)

All of this also means that, when trying to solve a problem, it can be a lot more effective to focus on **reducing the length of your feedback loop first**. If your current approach requires you to spend a lot of time and effort before you can validate your solution, the actual problem you should be solving is how to shorten your feedback loop. See also [You Are Solving The Wrong Problem](https://uxmag.com/articles/you-are-solving-the-wrong-problem)

## General tips

-   Identify your feedback loops and check if they can be shortened
    -   Feedback can be related to code quality, functionality, customer satisfaction, product-market fit, ...
-   Ask yourself: "What is the simplest incarnation of my idea that allows me to validate whether it will work?"
    -   Could be as simple as a sketch on a napkin
-   Split big problems into small steps that allow you to verify that you're on the right track after each step
-   Tackle risky or uncertain parts as early as possible
-   Be proactive about asking for feedback
    -   This can be as simple as announcing something you're about to do, which gives people a chance to stop you or suggest an alternative approach (this is usually also faster than asking and waiting for explicit permission)
        -   "Do whatever you want, but do it loudly" (from [Three Growth Strategies for Individual Contributors](https://hackernoon.com/three-growth-strategies-for-individual-contributors-kv4q3zgt))
-   Make sure that you know how to check if a task is "done" and if it solved the problem you wanted to solve

## Architecture, design and code

-   If the problem you're solving requires a non-trivial approach, discuss it with a colleague before actually fully implementing it
    -   You don't want to find out during code review that you need to throw most of your code away because your approach won't fit in with the rest of the system or you should have leveraged something that already existed
    -   Fifteen minutes of discussion can prevent days of wasted development effort
-   Within the code itself, put checks as early as possible in the flow so your program doesn't do useless work
-   When considering a new piece of technology, try to build a proof of concept with it that shows you if it performs well under the kind of load you foresee
    -   This can also force you to consult the technology's documentation while creating the proof of concept, giving you an idea of how good that documentation is
-   When building fault-tolerant systems, it can make sense to deliberately trigger faults at random, even up in production, so any problem with fault tolerance surfaces sooner rather than later
    -   See also [Architectural fitness functions](../architecture-design/Architectural-fitness-functions.md)

## Development process

-   Set up your development environment so it immediately alerts you of syntax errors, violations of coding style convention, code that is likely to have unintended effects, ...
    -   You don't want to waste your energy and your colleagues' energy by identifying, discussing and fixing these through code reviews
    -   See also [Static analysis](../processes-techniques/Static-analysis.md)
-   Fast automated tests can notify you of a bug in your code while you are in the middle of working on it, rather than having to switch contexts to fix it once the bug is found during code review or (even worse) after deployment
-   Monitoring for errors on a shared dev environment can help to find bugs before they are deployed to production
-   If requirements are unclear, clarify them with someone or make a quick small POC and validate that with someone
-   New tools or processes: first set up something simple and check if the added value is what you expected it to be, only then invest in improving
    -   Works a lot better than trying to set up something "perfect" immediately

### Tracer bullets and prototypes

Both can help you to get early customer feedback, as well as feedback on some technical aspects of the system

**Tracer bullets:** take a requirement and build an initial version of the entire system that fulfills that requirement

-   Can be used to get feedback from the customers
-   The result should be a part of the skeleton for the final application
    -   "Lean but complete"
    -   Already includes all necessary components, including automated tests, build pipelines, ...
    -   Sets up a structure for development team to work in (and allows to correct course if that structure is not working)

**Prototypes:** build something disposable to explore and validate a specific aspect of the final system

-   Useful for unproven or experimental parts, or parts that are absolutely critical to the final system
-   Things you could prototype: new functionality, user interface design, interaction with third-party tools or components, ...
-   Disposable: throwaway code, style and code quality don't matter, completeness doesn't matter
    -   The goal is to learn, not to build something useful
    -   Prototype code should never be deployed
-   Doesn't have to be code!
    -   **Paper prototypes** can be very useful for testing user interfaces
    -   You can prototype an idea for an automated process by executing the process manually and validating the value the process brings
    -   When analyzing product-market fit for a startup, it could even make sense to do a small-scale "launch" where part of the end-to-end process is taken care of by humans instead of by software

## People

-   If you notice tension in the room, discuss it explicitly before it grows too big to handle
-   If something doesn't sit well with you, bring it up before it grows into a huge source of worry or frustration
    -   Plenty of people have quit their jobs over issues that could have easily been solved if they would have been brought up early enough

## Resources

-   [Inefficient Efficiency](https://medium.com/@kentbeck_7670/inefficient-efficiency-5b3ab5294791)
-   [You Are Solving The Wrong Problem](https://uxmag.com/articles/you-are-solving-the-wrong-problem)
-   [3 Problems to Stop Looking For in Code Reviews](https://medium.com/swlh/3-problems-to-stop-looking-for-in-code-reviews-981bb169ba8b)
-   The Pragmatic Programmer (book by Andrew Hunt and David Thomas) ([summary](https://github.com/HugoMatilla/The-Pragmatic-Programmer))
-   [Three Growth Strategies for Individual Contributors](https://hackernoon.com/three-growth-strategies-for-individual-contributors-kv4q3zgt)
-   [How to validate your startup idea quickly](https://amanjain.substack.com/p/how-to-validate-your-startup-idea)
-   [The painted door test](https://briandavidhall.com/the-painted-door-test/)
-   [Wizard of Oz testing – a method of testing a system that does not yet exist.](https://www.simpleusability.com/inspiration/2018/08/wizard-of-oz-testing-a-method-of-testing-a-system-that-does-not-yet-exist/)
