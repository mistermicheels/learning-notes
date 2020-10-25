---
description: Some tips for troubleshooting issues in your system
last_modified: 2020-10-25T21:56:09.030Z
---

# Issue troubleshooting

## Contents

-   [General tips](#general-tips)
-   [Reproducing the issue locally](#reproducing-the-issue-locally)
    -   [What if you can't reproduce locally?](#what-if-you-cant-reproduce-locally)
-   [After fixing the issue](#after-fixing-the-issue)
    -   [What if you couldn't fix the issue?](#what-if-you-couldnt-fix-the-issue)
-   [Resources](#resources)

## General tips

Write it down!

-   Write down what you know about the problem
-   List your hypotheses and strategies for proving/disproving them
    -   You can eliminate potential causes by taking them out of the picture or testing them separately
        -   This could be sections of code, components, settings for software you're using, ...
    -   Don't eliminate a hypothesis without testing it
-   List the assumptions you're making and check if you need to validate them
    -   Even if you're 99% percent sure that a certain component is not the cause of the issue, it still makes sense to check it once you've gone through other more obvious hypotheses
    -   Keep in mind that coincidences can happen! For example, the fact that an issue is first observed right after a release doesn't necessarily mean that it's caused by the changes made during the release.
-   List any interesting observations you make
-   List any patterns you see

Look for the most obvious, dumb things first

-   It's typically just your code, your data or your settings
-   It's very unlikely that the issue is caused by bugs in your compiler, language runtime, browser, database software, libraries (especially if they are mature and battle-tested)

Don't rush and don't skimp on breaks

-   Trying to go too fast may make you miss important details or fail to see a general pattern, leading to a lot of time and energy spent going in the wrong direction
-   Breaks are needed to stay sharp, plus taking your focus away from the problem can trigger a light bulb moment as well. See also [Hammock-driven development](../mindset/Hammock-driven-development.md)

Ask for help if it makes sense!

-   An extra pair of eyes can help to see anything you missed
-   The act of describing the issue to someone might already give you some ideas
-   Even if the other person doesn't know a lot about that part of the system, they might still provide valuable input. See also [Hammock-driven development - Bonus: the power of interactions and the outsider effect](../mindset/Hammock-driven-development.md#bonus-the-power-of-interactions-and-the-outsider-effect)
-   In addition to asking people in your team, it could also make sense to ask people online

## Reproducing the issue locally

Reproducing the issue locally should typically be your first priority

-   On your local machine, it's a lot easier to properly debug the code step by step, try out possible solutions, mess around in the database, ...
    -   Just being able to really hook up a debugger to the code could save you hours of running in circles while mentally going through the code
    -   It's about shortening the feedback loop! See also [Fail fast](../mindset/Fail-fast.md)
-   Once you find input, data, settings, ... that allows you to reproduce the issue, store it somewhere for reference
    -   Playing around with these could suddenly cause the issue to disappear and make you lose your reproduction scenario
-   Ideally, set up some automated tests that reproduce the issue
    -   These can guide you when fixing the issue, plus they act as regression tests to make sure the issue isn't introduced again
    -   Setting up the tests at this point allows you to validate that they indeed fail when the issue is present

How to get there

-   Check issue description, potential error traces, logs, ... and keep revisiting them as often as necessary
-   Play around with your local environment based on all of this
-   If this doesn't allow you to reproduce the issue locally, try and see if there's another environment where you can safely try to reproduce it without messing up important data
    -   If this is the case, try to replicate the relevant input, data and settings onto your local machine, potentially by restoring a backup from production to your local DB etc.
-   If you suspect a concurrency bug, it could help to simulate high-concurrency situations using unit tests, a performance testing tool, ...

### What if you can't reproduce locally?

Note: this is really the worst-case scenario!

If there is another environment where you can safely reproduce the issue and play around with it, you can investigate it there and add some additional logging to help you understand the issue better

-   Watch out that this additional logging isn't an issue in itself! Excessive logging can bring a system to its knees. 
    -   Could be mitigated by sampling (only log 1 out of every n sessions/requests). Important to sample at the session/request level rather than on the level of individual log statements, because you typically need to see patterns between related logs within the same session/request. Not very useful if the issue occurs infrequently (likely to miss the sessions/requests where the issue occurs).
    -   Could be mitigated by keeping some additional logging in memory and discarding it if nothing interesting happens (be careful about the amount of used memory though). You could potentially use a ring buffer (if full, oldest entries are discarded) with a fixed size, where you write the whole ring buffer to disk if something interesting happens. In this case, determining the size of the ring buffer becomes the tricky part.
-   Go for an environment that's as far away from production as possible, while still allowing you to reproduce the bug. Things like restoring a production backup to a staging environment could be useful.
    -   If production is really the only option, try to reduce the risk by limiting your scope. For example, you could limit your testing to a single user account that's owned by your team and not a real customer. Or, you could limit the servers you try something on.

If the error is caused by the system getting into a certain state but you can't figure out how it got into that state, you could write some automated tests that put the system in that state and use those tests to make sure the system handles that state correctly

-   High risk of solving a symptom rather than the actual issue
-   Could be more helpful to instead set up something that allows you to detect when the system gets into that state again

## After fixing the issue

-   If you haven't been able to reproduce the issue locally before, spend some time making sure that you can now reproduce it locally using your increased knowledge of the issue
    -   It might be worth adjusting your setup to make it easier to reproduce these kinds of issues in the future
-   Make sure you have appropriate automated tests that will detect the issue if it's introduced again
    -   Ideally, you already wrote some automated tests that failed before fixing the issue and that are now passing due to your fix
-   Clean up data if necessary
-   Check if there's a need for additional logging that would make it easier to debug these kinds of issues in the future
-   Document your findings and share with the team
    -   Especially important if the issue taught you new things you will need to pay attention to as a team

### What if you couldn't fix the issue?

-   If the issue is gone for now but you haven't been able to pinpoint what caused it, it could be helpful to set up something that allows you to detect the issue earlier on if it happens again
-   If the issue is still there, it could make sense to build a workaround for it

## Resources

-   [The case of the missing DNS packets: a Google Cloud support story](https://cloud.google.com/blog/topics/inside-google-cloud/google-cloud-support-engineer-solves-a-tough-dns-case)
-   [How to debug in production](https://dev.to/tamasrev/how-to-debug-in-production-4f8)
-   [10 Tips For Debugging in Production](https://dev.to/molly_struve/10-tips-for-debugging-in-production-ko1)
