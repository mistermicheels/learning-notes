---
description: Some ways to improve the quality of your team's code through code review and collaboration
last_modified: 2020-11-01T12:34:21.452Z
---

# Code review and collaboration workflows

## Contents

-   [Instant review (pair programming)](#instant-review-pair-programming)
    -   [Pair programming and junior developers](#pair-programming-and-junior-developers)
        -   [Pairing a junior with a senior](#pairing-a-junior-with-a-senior)
        -   [Pairing two juniors](#pairing-two-juniors)
    -   [Mobbing](#mobbing)
-   [Synchronous review](#synchronous-review)
    -   [Synchronous review and pairing](#synchronous-review-and-pairing)
-   [Asynchronous review](#asynchronous-review)
    -   [What to do while waiting for feedback?](#what-to-do-while-waiting-for-feedback)
    -   [Asynchronous review and pairing](#asynchronous-review-and-pairing)
-   [Review after the fact](#review-after-the-fact)
-   [Automated review](#automated-review)
-   [Applying feedback received during review](#applying-feedback-received-during-review)
-   [Resources](#resources)

## Instant review (pair programming)

-   One programmer (driver writes code), other programmer (navigator) reviews the code immediately
    -   Roles are switches frequently
-   Pairing partner typically counts as reviewer from a code review perspective
    -   It's common for pairs to commit directly without further review

Advantages:

-   Creates joint ownership of the code: more than one person has detailed knowledge regarding that part of the code
    -   Knowledge can get spread through the team by mixing up the pairs
-   Helps with focus:
    -   While there is a lot of interaction within a pair, this interaction does not require context switching because both members of the pair are working on the same thing
    -   The pair can also keep each other on track and prevent each other from slacking off or being tempted to write quick-and-dirty code
-   Different perspectives and levels of overview
    -   Two people know more than one
    -   Navigator can focus on big picture while driver can focus on details

Pair programming works well when you need to write some code solving a complex business problem with lots of possible scenarios. While the driver codes, the navigator can provide guidance and help with making sure that all scenarios and edge cases are taken into account.

Disadvantages:

-   Can be exhausting, especially for introverts
-   Sometimes, people need space to come up with good ideas
-   There are situations where it would be way more productive to have people do (some of) their work separately instead of looking at the same screen together
    -   Example: technical problem requiring research, exploration and experimentation. Googling stuff, playing around and building small experiments or quick proof of concepts works way better if developers work on their own machine. Of course, this doesn’t mean that they can’t check in regularly to discuss their findings.

### Pair programming and junior developers

#### Pairing a junior with a senior

-   Can work, but changes the dynamic of the pair to be more focused on mentoring
-   Typically, the junior developer will be the driver most of the time 
    -   Senior will help the junior keep track of the different cases to handle and provide instant help when the junior is stuck
-   Can be a very good way to get the junior developer up to speed quickly
    -   As senior, avoid giving too much guidance
    -   Give hints or ask questions to help the junior figure it out
    -   Sometimes, it can even make sense to let the junior wander down a path that the senior knows to be a dead end
        -   Junior should be allowed to make mistakes, while the senior can then help the junior to learn from those mistakes by really understanding what went wrong and why
-   Benefits for senior
    -   Junior developers typically spend a lot of time learning, they might have picked up on something that benefits the senior as well
    -   The questions asked by the junior developer force the senior to be explicit about the reasoning behind certain best practices, the way the codebase was designed, the approaches used for certain problems, ...
        -   Learning by teaching
        -   Can help expose some potential gaps in senior's knowledge or even flaws in the design that went unnoticed
-   Can still be exhausting and frustrating for senior, so best to switch things up after a while

#### Pairing two juniors

-   Risky
    -   While there is a chance that they can fill in the gaps in each other’s knowledge and reasoning, there is also a big chance that you will just have two people being stuck for hours on a problem that could have been solved quickly with a bit of guidance from a senior developer.
-   Solutions:
    -   Forbidding less experienced developers to form a team
        -   Can seem harsh, also not always practical
    -   Guidance provided by team
        -   The team should help them estimate how much time they should allow themselves to spend on a task and how quickly they should ask for help

### Mobbing

Mobbing is similar to pair programming, but involves more people. Some types of mobbing:

-   _Code jam_: This is basically pairing, but with more navigators. The driver still switches frequently. Often, code jams are time-boxed sessions dedicated to solving a specifically hairy challenge.
-   _Randori_: Here, you have one regular pair (driver + navigator, switching roles often). The rest of the people just observe. However, every so often, one of the observers replaces one member of the pair.
-   _Mob programming_: This is similar to a code jam. However, instead of having time-boxed sessions, the team sees this type of collaboration as their main way of working. Teams using this approach say it helps with learning, quick decision making, communication, preventing technical debt, etc. Relevant video: [Mob Programming, A Whole Team Approach - Woody Zuill](https://vimeo.com/131643015).

## Synchronous review

-   First create something (code, design, …) on your own
-   Then call someone over in order to get feedback
-   Synchronous: your are looking at the work together, at the same time

Advantages:

-   Easier to explain context
    -   Helps if reviewer is not familiar with the problem being solved
-   Allows having real discussion
    -   Helpful if more the work under review requires more than just a few remarks
-   People have the chance to work on their own, explore and make their own mistakes

Disadvantages:

-   Context switches: getting someone to look at your code with you will typically require a context switch for at least one of you
    -   Can have a huge effect on productivity, especially for tasks that require deep focus and concentration
-   Does not allow the reviewer to prepare the review by having a look at the code or the problem before actually coming over to review
    -   Without being able to take some time to have good look at the code and let it sink in, the reviewer may fail to spot some potential problems

### Synchronous review and pairing

Even when working in pairs, synchronous review can be helpful for situations where classical pair programming doesn’t make sense or when you and your pairing partner need a break from the constant interaction for a while

Some strategies:

-   _Divide and conquer_
    -   Divide the problem into smaller tasks and divide them among the pair
    -   Each person works separately on their tasks
    -   Pair supports each other and frequently sit together to review the work
    -   Can be a good approach for research and experimentation
-   _Supported soloing_
    -   Similar to Divide and conquer, but now working on completely different things
    -   Can work well for seniors working together
    -   Can work well for a senior supporting a junior or even a small number of seniors supporting a pool of juniors

Finally, even when doing classical pair programming, synchronous review can be used if the pair needs some support from the rest of the team to solve a particularly hairy problem or make an important decision.

## Asynchronous review

-   First create something (code, design, …) on your own
-   Then, allow others to review this _asynchronously_
    -   Does not require you and the reviewer to be looking at the code at the same moment
    -   Typically through some kind of technology, for example pull requests
        -   Sharing code, making comments, tracking adjustments made to the code, ...

Advantages:

-   Asynchronous:
    -   You can submit your code when it suits you
    -   Reviewers can review when it suits them
        -   Also allows them to have a proper look, taking as much time as needed to really understand what the code does, how it handles certain situations and how it could affect the rest of the system
-   Easier to check the readability of the code
    -   Without the original developer being there to explain, the reviewer truly experiences how readable the code is
    -   If the original developer provided additional documentation, it is typically tracked in the code reviewing tool and can often be consulted even after the code has been accepted

Drawbacks:

-   Asynchronous: you may have to wait a while for feedback
    -   Still some context switching when going back to the code later on
    -   The team should make sure that code and comments are reviewed and processed fairly quickly, meaning that the feedback loop stays relatively short
        -   The longer the feedback loop gets, the harder it is for a committer or reviewer to switch contexts when they receive feedback on their code or comments.
        -   A longer feedback loop also increases the chance that other changes in the codebase will conflict with the code under review
-   Not suited for real discussion
    -   Excessive asynchronous back-and-forth can be detrimental to productivity
    -   Some companies have guidelines to "just accept the changes if the code is decent and offer suggestions for improvement as suggestions for new changes (instead of reasons for not accepting the current changes)"
    -   Can switch to synchronous review or even pairing if they are more suitable for the current change

### What to do while waiting for feedback?

-   Simplest option: work on something unrelated
-   If other work depends on work under review, things can get more complex. Avoid submitting code for review if it depends on other code that is still under review. It's often more productive to push people for a review of the original code.
    -   You can work on top of code currently under review and reapply your changes once reviewed code gets merged
    -   If you make it clear that your PR is part of a series, reviewers might be inclined to immediately approve your PR but specify comments for further improvement

### Asynchronous review and pairing

When applying the pairing strategies described in the section on synchronous review, asynchronous review could be used instead of synchronous review if there is a need or desire to handle things in an asynchronous fashion.

## Review after the fact

-   Code is reviewed after it is pushed/merged
-   Example: mob review where the entire team sits together to have a look at a piece of code in order to share knowledge and possibly get suggestions for further improvement
-   Other example: pairs commit directly to main, developers are notified when commits are made to the main branch and can then have a look at the code and potentially suggest some improvements
-   Can be useful to combine with other forms of review
-   Can be useful if people's availability prevents pairing or timely synchronous/asynchronous review

## Automated review

-   No humans involved
-   Automated formatting, enforcing coding style, checking for common bugs, checking dependencies, ...
-   See [Static analysis](./Static-analysis.md)
-   Great addition to any reviewing process, allows reviewers to focus on things that really need a human judgement

## Applying feedback received during review

For asynchronous and also synchronous review, a lot of feedback will fall into three categories:

-   _"This will cause specific problem X"_ -> Fix the code
-   _"I don’t understand what is happening."_ -> Refactor for readability or add documentation
-   _"In my opinion ..."_ -> Take it or leave it, it's up to you

## Resources

-   [4 Types Of Code Reviews Any Professional Developer Should Know About](https://dzone.com/articles/4-types-of-code-reviews-any-professional-developer)
-   [Pairing with Junior Developers](https://madeintandem.com/blog/2015-1-pairing-with-junior-developers/)
-   [Mob Programming, A Whole Team Approach - Woody Zuill](https://vimeo.com/131643015)
-   [Why Code Reviews Hurt Your Code Quality and Team Productivity](https://simpleprogrammer.com/code-review-trunk-based-development/)
-   [Pairing, Are You Doing it Wrong?](https://www.thoughtworks.com/insights/blog/pairing-are-you-doing-it-wrong)
-   [The Art of Pull Requests](https://hackernoon.com/the-art-of-pull-requests-6f0f099850f9)
-   [Three categories of PR comments](https://medium.com/@matt_68798/i-have-trouble-with-the-guideline-whatever-one-of-us-writes-the-other-2-have-to-be-cool-with-1fec5da99c48)
